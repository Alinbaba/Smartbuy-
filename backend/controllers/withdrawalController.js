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
// HELPER: Get Authenticated User ID
// ======================================================

const getUserId = (req) => {

    return req.user?._id || req.user?.id;

};


// ======================================================
// HELPER: Validate Withdrawal Amount
// ======================================================

const validateAmount = (amount) => {

    return (
        typeof amount === "number" &&
        Number.isFinite(amount) &&
        amount > 0
    );

};


// ======================================================
// CREATE WITHDRAWAL REQUEST
// ======================================================
//
// Flow:
//
// User
//   ↓
// Validate wallet ownership
//   ↓
// Validate amount
//   ↓
// Check balance
//   ↓
// Create pending withdrawal
//
// IMPORTANT:
// Wallet balance is NOT deducted here.
//
// Balance is deducted only when the withdrawal
// reaches the completion stage.
// ======================================================

exports.createWithdrawal = async (req, res) => {

    try {

        const userId = getUserId(req);

        if (!userId) {

            return res.status(401).json({

                success: false,

                message: "Authentication required."

            });

        }


        const {

            wallet,
            amount,
            currency = "NGN",
            withdrawalMethod,
            description = "",
            bankAccount = {},
            paymentGateway = "none"

        } = req.body;


        // ==============================================
        // Validate Amount
        // ==============================================

        if (!validateAmount(amount)) {

            return res.status(400).json({

                success: false,

                message:
                    "Withdrawal amount must be greater than zero."

            });

        }


        // ==============================================
        // Find Wallet
        // ==============================================

        const walletData = await Wallet.findById(wallet);


        if (!walletData) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }


        // ==============================================
        // SECURITY:
        // Make Sure Wallet Belongs To Current User
        // ==============================================

        if (
            String(walletData.user) !==
            String(userId)
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to use this wallet."

            });

        }


        // ==============================================
        // Check Wallet Balance
        // ==============================================

        if (walletData.availableBalance < amount) {

            return res.status(400).json({

                success: false,

                message: "Insufficient wallet balance."

            });

        }


        // ==============================================
        // Create Withdrawal
        // ==============================================

        const withdrawal = await Withdrawal.create({

            user: userId,

            wallet: walletData._id,

            amount,

            currency: String(currency).toUpperCase(),

            withdrawalMethod,

            description,

            requestedBy: userId,

            bankAccount,

            paymentGateway,

            status: "pending"

        });


        // ==============================================
        // Audit Log
        // ==============================================

        await createAuditLog({

            req,

            user: req.user,

            action: "CREATE_WITHDRAWAL",

            module: "withdrawal",

            description:
                "Withdrawal request created successfully.",

            targetModel: "Withdrawal",

            targetId: withdrawal._id,

            targetName: withdrawal.withdrawalId,

            newValues: {

                amount: withdrawal.amount,

                currency: withdrawal.currency,

                withdrawalMethod:
                    withdrawal.withdrawalMethod,

                status: withdrawal.status

            }

        });


        return res.status(201).json({

            success: true,

            message:
                "Withdrawal request created successfully.",

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
// GET MY WITHDRAWALS
// ======================================================

exports.getMyWithdrawals = async (req, res) => {

    try {

        const userId = getUserId(req);


        if (!userId) {

            return res.status(401).json({

                success: false,

                message: "Authentication required."

            });

        }


        const withdrawals = await Withdrawal.find({

            user: userId

        })

        .populate(

            "wallet",

            "walletId walletType"

        )

        .populate(

            "transaction",

            "transactionType amount currency status"

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
// GET ALL WITHDRAWALS - ADMIN
// ======================================================

exports.getAllWithdrawals = async (req, res) => {

    try {

        const withdrawals = await Withdrawal.find()

            .populate(

                "user",

                "fullName username email"

            )

            .populate(

                "wallet",

                "walletId walletType"

            )

            .populate(

                "transaction",

                "transactionType amount currency status"

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
            await Withdrawal.findById(req.params.id)

                .populate(

                    "user",

                    "fullName username email"

                )

                .populate(

                    "wallet",

                    "walletId walletType availableBalance"

                )

                .populate(

                    "transaction"

                );


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

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
// APPROVE WITHDRAWAL
// ======================================================
//
// pending
//    ↓
// approved
//
// NO wallet deduction happens here.
// ======================================================

exports.approveWithdrawal = async (req, res) => {

    try {

        const userId = getUserId(req);


        const result =
            await executeFinancialTransaction(

                async (session) => {

                    const withdrawal =
                        await Withdrawal.findOne({

                            _id: req.params.id,

                            status: "pending"

                        }).session(session);


                    if (!withdrawal) {

                        throw new Error(

                            "Withdrawal not found or is no longer pending."

                        );

                    }


                    withdrawal.status =
                        "approved";

                    withdrawal.approvedBy =
                        userId;

                    withdrawal.approvedAt =
                        new Date();


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

                        newValues: {

                            status:
                                withdrawal.status,

                            approvedBy:
                                userId,

                            approvedAt:
                                withdrawal.approvedAt

                        },

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
// approved
//    ↓
// processing
//
// Wallet is NOT deducted here.
// ======================================================

exports.processWithdrawal = async (req, res) => {

    try {

        const userId = getUserId(req);


        const result =
            await executeFinancialTransaction(

                async (session) => {

                    const withdrawal =
                        await Withdrawal.findOne({

                            _id: req.params.id,

                            status: "approved"

                        }).session(session);


                    if (!withdrawal) {

                        throw new Error(

                            "Withdrawal not found or is not approved."

                        );

                    }


                    withdrawal.status =
                        "processing";


                    if (!withdrawal.estimatedCompletion) {

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

                        newValues: {

                            status:
                                withdrawal.status,

                            estimatedCompletion:
                                withdrawal.estimatedCompletion

                        },

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
// REJECT WITHDRAWAL
// ======================================================
//
// pending
//    ↓
// rejected
//
// No wallet deduction.
// ======================================================

exports.rejectWithdrawal = async (req, res) => {

    try {

        const userId = getUserId(req);


        const reason =
            req.body.rejectionReason ||
            "Withdrawal rejected by administrator.";


        const result =
            await executeFinancialTransaction(

                async (session) => {

                    const withdrawal =
                        await Withdrawal.findOne({

                            _id: req.params.id,

                            status: "pending"

                        }).session(session);


                    if (!withdrawal) {

                        throw new Error(

                            "Withdrawal not found or cannot be rejected."

                        );

                    }


                    withdrawal.status =
                        "rejected";

                    withdrawal.rejectedBy =
                        userId;

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

                        newValues: {

                            status:
                                withdrawal.status,

                            rejectionReason:
                                reason

                        },

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
// pending
//    ↓
// cancelled
//
// No wallet deduction.
// ======================================================

exports.cancelWithdrawal = async (req, res) => {

    try {

        const userId = getUserId(req);


        const reason =
            req.body.cancellationReason ||
            "Withdrawal cancelled.";


        const result =
            await executeFinancialTransaction(

                async (session) => {

                    const withdrawal =
                        await Withdrawal.findOne({

                            _id: req.params.id,

                            user: userId,

                            status: "pending"

                        }).session(session);


                    if (!withdrawal) {

                        throw new Error(

                            "Withdrawal not found or cannot be cancelled."

                        );

                    }


                    withdrawal.status =
                        "cancelled";

                    withdrawal.cancelledBy =
                        userId;

                    withdrawal.cancelledAt =
                        new Date();

                    withdrawal.cancellationReason =
                        reason;


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
                            "Withdrawal request cancelled.",

                        targetModel:
                            "Withdrawal",

                        targetId:
                            withdrawal._id,

                        targetName:
                            withdrawal.withdrawalId,

                        newValues: {

                            status:
                                withdrawal.status,

                            cancellationReason:
                                reason

                        },

                        metadata: {

                            cancellationReason:
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
// processing
//    ↓
// failed
//
// This happens BEFORE wallet deduction in our workflow.
// Therefore no refund is required here.
// ======================================================

exports.failWithdrawal = async (req, res) => {

    try {

        const userId = getUserId(req);


        const reason =
            req.body.failureReason ||
            "Withdrawal processing failed.";


        const result =
            await executeFinancialTransaction(

                async (session) => {

                    const withdrawal =
                        await Withdrawal.findOne({

                            _id: req.params.id,

                            status: "processing"

                        }).session(session);


                    if (!withdrawal) {

                        throw new Error(

                            "Withdrawal not found or is not processing."

                        );

                    }


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

                        newValues: {

                            status:
                                withdrawal.status,

                            failureReason:
                                reason

                        },

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
// failed
//    ↓
// processing
//
// Retry counter increases.
// ======================================================

exports.retryFailedWithdrawal = async (req, res) => {

    try {

        const result =
            await executeFinancialTransaction(

                async (session) => {

                    const withdrawal =
                        await Withdrawal.findOne({

                            _id: req.params.id,

                            status: "failed"

                        }).session(session);


                    if (!withdrawal) {

                        throw new Error(

                            "Withdrawal not found or cannot be retried."

                        );

                    }


                    withdrawal.retryCount += 1;

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
                            "Failed withdrawal returned to processing.",

                        targetModel:
                            "Withdrawal",

                        targetId:
                            withdrawal._id,

                        targetName:
                            withdrawal.withdrawalId,

                        newValues: {

                            status:
                                withdrawal.status,

                            retryCount:
                                withdrawal.retryCount,

                            estimatedCompletion:
                                withdrawal.estimatedCompletion

                        },

                        metadata: {

                            retryCount:
                                withdrawal.retryCount

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
// COMPLETE WITHDRAWAL
// ======================================================
//
// processing
//      ↓
// Wallet balance deducted
//      ↓
// Transaction created
//      ↓
// Withdrawal completed
//      ↓
// Audit created
//      ↓
// COMMIT
//
// Everything happens inside ONE MongoDB transaction.
//
// If ANY operation fails:
// EVERYTHING ROLLS BACK.
// ======================================================

exports.completeWithdrawal = async (req, res) => {

    try {

        const userId = getUserId(req);


        const result =
            await executeFinancialTransaction(

                async (session) => {

                    // ==================================
                    // Find Processing Withdrawal
                    // ==================================

                    const withdrawal =
                        await Withdrawal.findOne({

                            _id: req.params.id,

                            status: "processing"

                        }).session(session);


                    if (!withdrawal) {

                        throw new Error(

                            "Withdrawal not found or is not processing."

                        );

                    }


                    // ==================================
                    // Find Wallet
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
                    // Verify Wallet Ownership
                    // ==================================

                    if (

                        String(wallet.user) !==
                        String(withdrawal.user)

                    ) {

                        throw new Error(

                            "Withdrawal wallet ownership mismatch."

                        );

                    }


                    // ==================================
                    // Check Wallet Balance
                    // ==================================

                    if (

                        wallet.availableBalance <
                        withdrawal.amount

                    ) {

                        throw new Error(

                            "Insufficient wallet balance."

                        );

                    }


                    // ==================================
                    // Record Starting Balance
                    // ==================================

                    const balanceBefore =
                        wallet.availableBalance;


                    // ==================================
                    // Calculate Processing Fee
                    // ==================================

                    const processingFee =
                        Number(

                            withdrawal.processingFee || 0

                        );


                    if (

                        processingFee < 0 ||
                        processingFee > withdrawal.amount

                    ) {

                        throw new Error(

                            "Invalid processing fee."

                        );

                    }


                    // ==================================
                    // Calculate Net Amount
                    // ==================================

                    const netAmount =
                        withdrawal.amount -
                        processingFee;


                    // ==================================
                    // Deduct Wallet
                    // ==================================

                    wallet.availableBalance -=
                        withdrawal.amount;


                    wallet.totalWithdrawn =
                        (wallet.totalWithdrawn || 0) +
                        withdrawal.amount;


                    wallet.lastWithdrawalDate =
                        new Date();


                    wallet.lastTransactionDate =
                        new Date();


                    // ==================================
                    // Save Wallet Inside Transaction
                    // ==================================

                    await wallet.save({

                        session

                    });


                    // ==================================
                    // Create Financial Transaction
                    // ==================================

                    const transactionResult =
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

                                description:
                                    "Wallet withdrawal completed",

                                balanceBefore,

                                balanceAfter:
                                    wallet.availableBalance,

                                status:
                                    "successful",

                                performedBy:
                                    userId

                            }],

                            {

                                session

                            }

                        );


                    const transaction =
                        transactionResult[0];


                    // ==================================
                    // Complete Withdrawal
                    // ==================================

                    withdrawal.status =
                        "completed";


                    withdrawal.completedBy =
                        userId;


                    withdrawal.completedAt =
                        new Date();


                    withdrawal.transaction =
                        transaction._id;


                    withdrawal.netAmount =
                        netAmount;


                    // ==================================
                    // Calculate Processing Duration
                    // ==================================

                    if (withdrawal.updatedAt) {

                        withdrawal.processingDuration =
                            Math.max(

                                0,

                                Date.now() -
                                new Date(
                                    withdrawal.updatedAt
                                ).getTime()

                            );

                    }


                    // ==================================
                    // Save Withdrawal
                    // ==================================

                    await withdrawal.save({

                        session

                    });


                    // ==================================
                    // Audit Log
                    // ==================================

                    await createAuditLog({

                        req,

                        user: req.user,

                        action:
                            "COMPLETE_WITHDRAWAL",

                        module:
                            "withdrawal",

                        description:
                            "Withdrawal completed successfully.",

                        targetModel:
                            "Withdrawal",

                        targetId:
                            withdrawal._id,

                        targetName:
                            withdrawal.withdrawalId,

                        oldValues: {

                            status:
                                "processing",

                            balanceBefore

                        },

                        newValues: {

                            status:
                                "completed",

                            balanceAfter:
                                wallet.availableBalance,

                            processingFee,

                            netAmount

                        },

                        metadata: {

                            transactionId:
                                transaction._id,

                            walletId:
                                wallet._id

                        },

                        session

                    });


                    // ==================================
                    // Return Complete Result
                    // ==================================

                    return {

                        withdrawal,

                        transaction,

                        balanceBefore,

                        balanceAfter:
                            wallet.availableBalance,

                        processingFee,

                        netAmount

                    };

                }

            );


        // ==========================================
        // Successful Response
        // ==========================================

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
// GET WITHDRAWAL SUMMARY
// ======================================================

exports.getWithdrawalSummary = async (req, res) => {

    try {

        const userId = getUserId(req);


        const withdrawals =
            await Withdrawal.find({

                user: userId

            });


        let totalAmount = 0;

        let completedAmount = 0;

        let pendingAmount = 0;


        withdrawals.forEach(

            (withdrawal) => {

                totalAmount +=
                    withdrawal.amount;


                if (
                    withdrawal.status ===
                    "completed"
                ) {

                    completedAmount +=
                        withdrawal.amount;

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
                        withdrawal.amount;

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
