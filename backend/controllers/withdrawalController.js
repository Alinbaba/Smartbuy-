const Withdrawal = require("../models/Withdrawal");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

const executeFinancialTransaction = require(
"../utils/financialTransaction"
);

const createAuditLog = require(
"../utils/auditLog"
);

// ======================================================
// CREATE WITHDRAWAL REQUEST
// ======================================================

exports.createWithdrawal = async (req, res) => {

try {

    const {
        wallet,
        amount,
        currency,
        withdrawalMethod,
        description,
        bankAccount,
        paymentGateway
    } = req.body;


    // --------------------------------------------------
    // Validate amount
    // --------------------------------------------------

    if (
        amount === undefined ||
        amount === null ||
        Number(amount) <= 0
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Withdrawal amount must be greater than zero."

        });

    }


    const numericAmount = Number(amount);


    // --------------------------------------------------
    // Find wallet
    // --------------------------------------------------

    const walletData =
        await Wallet.findById(wallet);


    if (!walletData) {

        return res.status(404).json({

            success: false,

            message: "Wallet not found."

        });

    }


    // --------------------------------------------------
    // Wallet ownership security
    // --------------------------------------------------

    if (
        walletData.user.toString() !==
        req.user._id.toString()
    ) {

        return res.status(403).json({

            success: false,

            message:
                "You are not authorized to use this wallet."

        });

    }


    // --------------------------------------------------
    // Check balance
    // --------------------------------------------------

    if (
        Number(walletData.availableBalance) <
        numericAmount
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Insufficient wallet balance."

        });

    }


    // --------------------------------------------------
    // Create withdrawal + audit atomically
    // --------------------------------------------------

    const result =
        await executeFinancialTransaction(

            async (session) => {

                const withdrawal =
                    await Withdrawal.create(

                        [{

                            user:
                                walletData.user,

                            wallet:
                                walletData._id,

                            amount:
                                numericAmount,

                            currency:
                                currency ||
                                walletData.currency ||
                                "NGN",

                            withdrawalMethod,

                            paymentGateway:
                                paymentGateway ||
                                "none",

                            bankAccount:
                                bankAccount ||
                                {},

                            description:
                                description ||
                                "",

                            requestedBy:
                                req.user._id,

                            status:
                                "pending"

                        }],

                        {
                            session
                        }

                    );


                const createdWithdrawal =
                    withdrawal[0];


                // ------------------------------------------
                // Audit
                // ------------------------------------------

                await createAuditLog({

                    req,

                    user: req.user,

                    action:
                        "CREATE_WITHDRAWAL",

                    module:
                        "withdrawal",

                    description:
                        "Withdrawal request created successfully.",

                    targetModel:
                        "Withdrawal",

                    targetId:
                        createdWithdrawal._id,

                    targetName:
                        createdWithdrawal.withdrawalId,

                    newValues: {

                        amount:
                            createdWithdrawal.amount,

                        currency:
                            createdWithdrawal.currency,

                        withdrawalMethod:
                            createdWithdrawal.withdrawalMethod,

                        status:
                            createdWithdrawal.status

                    },

                    session

                });


                return createdWithdrawal;

            }

        );


    return res.status(201).json({

        success: true,

        message:
            "Withdrawal request created successfully.",

        withdrawal: result

    });


} catch (error) {

    return res.status(500).json({

        success: false,

        message: error.message

    });

}

};

// ======================================================
// GET MY WITHDRAWALS
// ======================================================

exports.getMyWithdrawals = async (req, res) => {

try {

    const withdrawals =
        await Withdrawal.find({

            user: req.user._id

        })

        .populate(
            "wallet",
            "walletId walletType"
        )

        .populate(
            "transaction"
        )

        .sort({
            createdAt: -1
        });


    return res.status(200).json({

        success: true,

        totalWithdrawals:
            withdrawals.length,

        withdrawals

    });


} catch (error) {

    return res.status(500).json({

        success: false,

        message: error.message

    });

}

};

// ======================================================
// GET WITHDRAWAL BY ID
// ======================================================

exports.getWithdrawalById = async (req, res) => {

try {

    const withdrawal =
        await Withdrawal.findById(
            req.params.id
        )

        .populate(
            "user",
            "fullName username email"
        )

        .populate(
            "wallet",
            "walletId walletType"
        )

        .populate(
            "transaction"
        );


    if (!withdrawal) {

        return res.status(404).json({

            success: false,

            message:
                "Withdrawal not found."

        });

    }


    // --------------------------------------------------
    // Owner/admin access security
    // --------------------------------------------------

    const ownerId =
        withdrawal.user._id
            ? withdrawal.user._id.toString()
            : withdrawal.user.toString();


    const currentUserId =
        req.user._id.toString();


    const isAdmin =
        req.user.role === "admin" ||
        req.user.role === "superadmin";


    if (
        ownerId !== currentUserId &&
        !isAdmin
    ) {

        return res.status(403).json({

            success: false,

            message:
                "You are not authorized to view this withdrawal."

        });

    }


    return res.status(200).json({

        success: true,

        withdrawal

    });


} catch (error) {

    return res.status(500).json({

        success: false,

        message: error.message

    });

}

};

// ======================================================
// GET ALL WITHDRAWALS - ADMIN
// ======================================================

exports.getAllWithdrawals = async (req, res) => {

try {

    const withdrawals =
        await Withdrawal.find()

        .populate(
            "user",
            "fullName username email"
        )

        .populate(
            "wallet",
            "walletId walletType"
        )

        .populate(
            "approvedBy",
            "fullName username email"
        )

        .populate(
            "completedBy",
            "fullName username email"
        )

        .populate(
            "rejectedBy",
            "fullName username email"
        )

        .populate(
            "cancelledBy",
            "fullName username email"
        )

        .populate(
            "transaction"
        )

        .sort({
            createdAt: -1
        });


    return res.status(200).json({

        success: true,

        totalWithdrawals:
            withdrawals.length,

        withdrawals

    });


} catch (error) {

    return res.status(500).json({

        success: false,

        message: error.message

    });

}

};

// ======================================================
// APPROVE WITHDRAWAL
// ======================================================
//
// pending → approved
//
// No wallet deduction occurs here.
// ======================================================

exports.approveWithdrawal = async (req, res) => {

try {

    const result =
        await executeFinancialTransaction(

            async (session) => {

                const withdrawal =
                    await Withdrawal.findById(
                        req.params.id
                    ).session(session);


                if (!withdrawal) {

                    throw new Error(
                        "Withdrawal not found."
                    );

                }


                if (
                    withdrawal.status !==
                    "pending"
                ) {

                    throw new Error(
                        "Only pending withdrawals can be approved."
                    );

                }


                const oldStatus =
                    withdrawal.status;


                withdrawal.status =
                    "approved";

                withdrawal.approvedBy =
                    req.user._id;

                withdrawal.approvedAt =
                    new Date();

                withdrawal.estimatedCompletion =
                    new Date(
                        Date.now() +
                        (30 * 60 * 1000)
                    );


                await withdrawal.save({

                    session

                });


                await createAuditLog({

                    req,

                    user: req.user,

                    action:
                        "APPROVE_WITHDRAWAL",

                    module:
                        "withdrawal",

                    description:
                        "Withdrawal approved and ready for processing.",

                    targetModel:
                        "Withdrawal",

                    targetId:
                        withdrawal._id,

                    targetName:
                        withdrawal.withdrawalId,

                    oldValues: {

                        status:
                            oldStatus

                    },

                    newValues: {

                        status:
                            withdrawal.status,

                        approvedBy:
                            withdrawal.approvedBy,

                        approvedAt:
                            withdrawal.approvedAt

                    },

                    changes: [

                        "status",

                        "approvedBy",

                        "approvedAt"

                    ],

                    session

                });


                return withdrawal;

            }

        );


    return res.status(200).json({

        success: true,

        message:
            "Withdrawal approved successfully.",

        withdrawal: result

    });


} catch (error) {

    return res.status(400).json({

        success: false,

        message: error.message

    });

}

};

// ======================================================
// PROCESS WITHDRAWAL
// ======================================================
//
// approved → processing
//
// No wallet deduction occurs here.
// ======================================================

exports.processWithdrawal = async (req, res) => {

try {

    const result =
        await executeFinancialTransaction(

            async (session) => {

                const withdrawal =
                    await Withdrawal.findById(
                        req.params.id
                    ).session(session);


                if (!withdrawal) {

                    throw new Error(
                        "Withdrawal not found."
                    );

                }


                if (
                    withdrawal.status !==
                    "approved"
                ) {

                    throw new Error(
                        "Only approved withdrawals can be processed."
                    );

                }


                const oldStatus =
                    withdrawal.status;


                withdrawal.status =
                    "processing";


                if (
                    !withdrawal.estimatedCompletion
                ) {

                    withdrawal.estimatedCompletion =
                        new Date(
                            Date.now() +
                            (30 * 60 * 1000)
                        );

                }


                await withdrawal.save({

                    session

                });


                await createAuditLog({

                    req,

                    user: req.user,

                    action:
                        "PROCESS_WITHDRAWAL",

                    module:
                        "withdrawal",

                    description:
                        "Withdrawal moved to processing.",

                    targetModel:
                        "Withdrawal",

                    targetId:
                        withdrawal._id,

                    targetName:
                        withdrawal.withdrawalId,

                    oldValues: {

                        status:
                            oldStatus

                    },

                    newValues: {

                        status:
                            withdrawal.status

                    },

                    changes: [

                        "status"

                    ],

                    session

                });


                return withdrawal;

            }

        );


    return res.status(200).json({

        success: true,

        message:
            "Withdrawal moved to processing.",

        withdrawal: result

    });


} catch (error) {

    return res.status(400).json({

        success: false,

        message: error.message

    });

}

};

// ======================================================
// COMPLETE WITHDRAWAL
// ======================================================
//
// processing → completed
//
// Financial transaction:
//
// Wallet deduction
//      +
// Transaction record
//      +
// Withdrawal update
//      +
// Audit log
//
// ALL INSIDE ONE MONGODB TRANSACTION.
// ======================================================

exports.completeWithdrawal = async (req, res) => {

try {

    const result =
        await executeFinancialTransaction(

            async (session) => {


                // ==================================
                // Get current withdrawal
                // ==================================

                const withdrawal =
                    await Withdrawal.findById(
                        req.params.id
                    ).session(session);


                if (!withdrawal) {

                    throw new Error(
                        "Withdrawal not found."
                    );

                }


                if (
                    withdrawal.status !==
                    "processing"
                ) {

                    throw new Error(
                        "Only processing withdrawals can be completed."
                    );

                }


                // ==================================
                // Get wallet
                // ==================================

                const wallet =
                    await Wallet.findById(
                        withdrawal.wallet
                    ).session(session);


                if (!wallet) {

                    throw new Error(
                        "Wallet not found."
                    );

                }


                // ==================================
                // Wallet ownership verification
                // ==================================

                if (
                    wallet.user.toString() !==
                    withdrawal.user.toString()
                ) {

                    throw new Error(
                        "Wallet ownership validation failed."
                    );

                }


                // ==================================
                // Check balance
                // ==================================

                if (
                    Number(
                        wallet.availableBalance
                    ) <
                    Number(
                        withdrawal.amount
                    )
                ) {

                    throw new Error(
                        "Insufficient wallet balance."
                    );

                }


                // ==================================
                // Capture balance
                // ==================================

                const balanceBefore =
                    Number(
                        wallet.availableBalance
                    );


                // ==================================
                // Processing fee
                // ==================================

                const processingFee =
                    Number(
                        withdrawal.processingFee ||
                        0
                    );


                if (
                    processingFee >
                    withdrawal.amount
                ) {

                    throw new Error(
                        "Processing fee cannot exceed withdrawal amount."
                    );

                }


                const netAmount =
                    withdrawal.amount -
                    processingFee;


                // ==================================
                // Deduct wallet
                // ==================================

                wallet.availableBalance =
                    balanceBefore -
                    withdrawal.amount;


                wallet.totalWithdrawn =
                    Number(
                        wallet.totalWithdrawn || 0
                    ) +
                    Number(
                        withdrawal.amount
                    );


                wallet.lastWithdrawalDate =
                    new Date();


                wallet.lastTransactionDate =
                    new Date();


                await wallet.save({

                    session

                });


                // ==================================
                // Create transaction
                // ==================================

                const transaction =
                    await Transaction.create(

                        [{

                            user:
                                withdrawal.user,

                            wallet:
                                wallet._id,

                            transactionType:
                                "withdrawal",

                            transactionDirection:
                                "debit",

                            amount:
                                withdrawal.amount,

                            currency:
                                withdrawal.currency,

                            paymentMethod:
                                withdrawal.withdrawalMethod,

                            paymentGateway:
                                withdrawal.paymentGateway,

                            status:
                                "successful",

                            balanceBefore,

                            balanceAfter:
                                wallet.availableBalance,

                            description:
                                "Wallet withdrawal completed.",

                            performedBy:
                                req.user._id

                        }],

                        {

                            session

                        }

                    );


                // ==================================
                // Update withdrawal
                // ==================================

                const completionTime =
                    new Date();


                withdrawal.status =
                    "completed";


                withdrawal.completedBy =
                    req.user._id;


                withdrawal.completedAt =
                    completionTime;


                withdrawal.processingFee =
                    processingFee;


                withdrawal.netAmount =
                    netAmount;


                withdrawal.transaction =
                    transaction[0]._id;


                // ----------------------------------
                // Calculate actual processing time
                // ----------------------------------

                if (
                    withdrawal.updatedAt
                ) {

                    withdrawal.processingDuration =
                        Math.max(

                            completionTime.getTime() -
                            withdrawal.updatedAt.getTime(),

                            0

                        );

                }


                await withdrawal.save({

                    session

                });


                // ==================================
                // Audit log
                // ==================================

                await createAuditLog({

                    req,

                    user: req.user,

                    action:
                        "COMPLETE_WITHDRAWAL",

                    module:
                        "withdrawal",

                    description:
                        "Withdrawal completed and wallet balance deducted.",

                    targetModel:
                        "Withdrawal",

                    targetId:
                        withdrawal._id,

                    targetName:
                        withdrawal.withdrawalId,

                    oldValues: {

                        status:
                            "processing",

                        walletBalance:
                            balanceBefore

                    },

                    newValues: {

                        status:
                            "completed",

                        walletBalance:
                            wallet.availableBalance,

                        processingFee,

                        netAmount,

                        transaction:
                            transaction[0]._id

                    },

                    changes: [

                        "status",

                        "walletBalance",

                        "transaction",

                        "completedBy",

                        "completedAt"

                    ],

                    metadata: {

                        amount:
                            withdrawal.amount,

                        processingFee,

                        netAmount,

                        balanceBefore,

                        balanceAfter:
                            wallet.availableBalance

                    },

                    session

                });


                return {

                    withdrawal,

                    transaction:
                        transaction[0]

                };

            }

        );


    return res.status(200).json({

        success: true,

        message:
            "Withdrawal completed successfully.",

        data: result

    });


} catch (error) {

    return res.status(400).json({

        success: false,

        message: error.message

    });

}

};

// ======================================================
// REJECT WITHDRAWAL
// ======================================================
//
// pending → rejected
// ======================================================

exports.rejectWithdrawal = async (req, res) => {

try {

    const result =
        await executeFinancialTransaction(

            async (session) => {

                const withdrawal =
                    await Withdrawal.findById(
                        req.params.id
                    ).session(session);


                if (!withdrawal) {

                    throw new Error(
                        "Withdrawal not found."
                    );

                }


                if (
                    withdrawal.status !==
                    "pending"
                ) {

                    throw new Error(
                        "Only pending withdrawals can be rejected."
                    );

                }


                const reason =
                    req.body.rejectionReason ||
                    "Withdrawal rejected by administrator.";


                withdrawal.status =
                    "rejected";

                withdrawal.rejectedBy =
                    req.user._id;

                withdrawal.rejectedAt =
                    new Date();

                withdrawal.rejectionReason =
                    reason;


                await withdrawal.save({

                    session

                });


                await createAuditLog({

                    req,

                    user: req.user,

                    action:
                        "REJECT_WITHDRAWAL",

                    module:
                        "withdrawal",

                    description:
                        "Withdrawal request rejected.",

                    targetModel:
                        "Withdrawal",

                    targetId:
                        withdrawal._id,

                    targetName:
                        withdrawal.withdrawalId,

                    metadata: {

                        rejectionReason:
                            reason

                    },

                    session

                });


                return withdrawal;

            }

        );


    return res.status(200).json({

        success: true,

        message:
            "Withdrawal rejected successfully.",

        withdrawal: result

    });


} catch (error) {

    return res.status(400).json({

        success: false,

        message: error.message

    });

}

};

// ======================================================
// CANCEL WITHDRAWAL
// ======================================================
//
// Only the withdrawal owner can cancel.
// pending → cancelled
// ======================================================

exports.cancelWithdrawal = async (req, res) => {

try {

    const result =
        await executeFinancialTransaction(

            async (session) => {

                const withdrawal =
                    await Withdrawal.findById(
                        req.params.id
                    ).session(session);


                if (!withdrawal) {

                    throw new Error(
                        "Withdrawal not found."
                    );

                }


                // ----------------------------------
                // Ownership security
                // ----------------------------------

                if (
                    withdrawal.user.toString() !==
                    req.user._id.toString()
                ) {

                    throw new Error(
                        "You are not authorized to cancel this withdrawal."
                    );

                }


                if (
                    withdrawal.status !==
                    "pending"
                ) {

                    throw new Error(
                        "Only pending withdrawals can be cancelled."
                    );

                }


                withdrawal.status =
                    "cancelled";

                withdrawal.cancelledBy =
                    req.user._id;

                withdrawal.cancelledAt =
                    new Date();

                withdrawal.cancellationReason =
                    req.body.cancellationReason ||
                    "Withdrawal cancelled by user.";


                await withdrawal.save({

                    session

                });


                await createAuditLog({

                    req,

                    user: req.user,

                    action:
                        "CANCEL_WITHDRAWAL",

                    module:
                        "withdrawal",

                    description:
                        "Withdrawal request cancelled by owner.",

                    targetModel:
                        "Withdrawal",

                    targetId:
                        withdrawal._id,

                    targetName:
                        withdrawal.withdrawalId,

                    metadata: {

                        cancellationReason:
                            withdrawal.cancellationReason

                    },

                    session

                });


                return withdrawal;

            }

        );


    return res.status(200).json({

        success: true,

        message:
            "Withdrawal cancelled successfully.",

        withdrawal: result

    });


} catch (error) {

    return res.status(400).json({

        success: false,

        message: error.message

    });

}

};

// ======================================================
// FAIL WITHDRAWAL
// ======================================================
//
// processing → failed
// ======================================================

exports.failWithdrawal = async (req, res) => {

try {

    const result =
        await executeFinancialTransaction(

            async (session) => {

                const withdrawal =
                    await Withdrawal.findById(
                        req.params.id
                    ).session(session);


                if (!withdrawal) {

                    throw new Error(
                        "Withdrawal not found."
                    );

                }


                if (
                    withdrawal.status !==
                    "processing"
                ) {

                    throw new Error(
                        "Only processing withdrawals can be marked as failed."
                    );

                }


                const reason =
                    req.body.failureReason ||
                    "Withdrawal processing failed.";


                withdrawal.status =
                    "failed";

                withdrawal.failureReason =
                    reason;


                await withdrawal.save({

                    session

                });


                await createAuditLog({

                    req,

                    user: req.user,

                    action:
                        "FAIL_WITHDRAWAL",

                    module:
                        "withdrawal",

                    description:
                        "Withdrawal processing failed.",

                    targetModel:
                        "Withdrawal",

                    targetId:
                        withdrawal._id,

                    targetName:
                        withdrawal.withdrawalId,

                    metadata: {

                        failureReason:
                            reason

                    },

                    session

                });


                return withdrawal;

            }

        );


    return res.status(200).json({

        success: true,

        message:
            "Withdrawal marked as failed.",

        withdrawal: result

    });


} catch (error) {

    return res.status(400).json({

        success: false,

        message: error.message

    });

}

};

// ======================================================
// RETRY FAILED WITHDRAWAL
// ======================================================
//
// failed → processing
// ======================================================

exports.retryFailedWithdrawal = async (req, res) => {

try {

    const result =
        await executeFinancialTransaction(

            async (session) => {

                const withdrawal =
                    await Withdrawal.findById(
                        req.params.id
                    ).session(session);


                if (!withdrawal) {

                    throw new Error(
                        "Withdrawal not found."
                    );

                }


                if (
                    withdrawal.status !==
                    "failed"
                ) {

                    throw new Error(
                        "Only failed withdrawals can be retried."
                    );

                }


                const maxRetries = 3;


                if (
                    Number(
                        withdrawal.retryCount || 0
                    ) >= maxRetries
                ) {

                    throw new Error(
                        "Maximum withdrawal retry limit reached."
                    );

                }


                withdrawal.retryCount =
                    Number(
                        withdrawal.retryCount || 0
                    ) + 1;


                withdrawal.status =
                    "processing";


                withdrawal.failureReason =
                    "";


                withdrawal.estimatedCompletion =
                    new Date(
                        Date.now() +
                        (30 * 60 * 1000)
                    );


                await withdrawal.save({

                    session

                });


                await createAuditLog({

                    req,

                    user: req.user,

                    action:
                        "RETRY_WITHDRAWAL",

                    module:
                        "withdrawal",

                    description:
                        "Failed withdrawal was retried and returned to processing.",

                    targetModel:
                        "Withdrawal",

                    targetId:
                        withdrawal._id,

                    targetName:
                        withdrawal.withdrawalId,

                    metadata: {

                        retryCount:
                            withdrawal.retryCount,

                        maxRetries

                    },

                    session

                });


                return withdrawal;

            }

        );


    return res.status(200).json({

        success: true,

        message:
            "Withdrawal retry started successfully.",

        withdrawal: result

    });


} catch (error) {

    return res.status(400).json({

        success: false,

        message: error.message

    });

}

};

// ======================================================
// WITHDRAWAL SUMMARY
// ======================================================

exports.getWithdrawalSummary = async (req, res) => {

try {

    const withdrawals =
        await Withdrawal.find({

            user: req.user._id

        });


    let totalAmount = 0;

    let completedAmount = 0;

    let pendingAmount = 0;


    withdrawals.forEach(

        (withdrawal) => {

            totalAmount +=
                Number(
                    withdrawal.amount || 0
                );


            if (
                withdrawal.status ===
                "completed"
            ) {

                completedAmount +=
                    Number(
                        withdrawal.amount || 0
                    );

            }


            if (

                withdrawal.status ===
                    "pending" ||

                withdrawal.status ===
                    "approved" ||

                withdrawal.status ===
                    "processing"

            ) {

                pendingAmount +=
                    Number(
                        withdrawal.amount || 0
                    );

            }

        }

    );


    return res.status(200).json({

        success: true,

        summary: {

            totalWithdrawals:
                withdrawals.length,

            totalAmount,

            completedAmount,

            pendingAmount

        }

    });


} catch (error) {

    return res.status(500).json({

        success: false,

        message: error.message

    });

}

};
