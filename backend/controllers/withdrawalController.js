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

        if (!amount || amount <= 0) {

            return res.status(400).json({

                success: false,

                message: "Withdrawal amount must be greater than zero."

            });

        }


        // --------------------------------------------------
        // Find wallet
        // --------------------------------------------------

        const walletData = await Wallet.findById(wallet);


        if (!walletData) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }


        // --------------------------------------------------
        // Security: wallet must belong to logged-in user
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
        // Check available balance
        // --------------------------------------------------

        if (walletData.availableBalance < amount) {

            return res.status(400).json({

                success: false,

                message: "Insufficient wallet balance."

            });

        }


        // --------------------------------------------------
        // Create withdrawal
        // --------------------------------------------------

        const withdrawal = await Withdrawal.create({

            user: walletData.user,

            wallet: walletData._id,

            amount,

            currency: currency || walletData.currency || "NGN",

            withdrawalMethod,

            paymentGateway:
                paymentGateway || "none",

            bankAccount:
                bankAccount || {},

            description:
                description || "",

            requestedBy: req.user._id,

            status: "pending"

        });


        // --------------------------------------------------
        // Audit log
        // --------------------------------------------------

        await createAuditLog({

            req,

            user: req.user,

            action: "CREATE_WITHDRAWAL",

            module: "withdrawal",

            description:
                "Withdrawal request created successfully.",

            targetModel: "Withdrawal",

            targetId: withdrawal._id,

            targetName: withdrawal.withdrawalId

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

        const withdrawals =
            await Withdrawal.find({

                user: req.user._id

            })
            .populate(
                "wallet",
                "walletId walletType"
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

                message: "Withdrawal not found."

            });

        }


        // --------------------------------------------------
        // Owner/admin access should normally be enforced
        // by route authorization middleware as well.
        // --------------------------------------------------

        if (
            withdrawal.user._id &&
            withdrawal.user._id.toString() !==
            req.user._id.toString()
        ) {

            const isAdmin =
                req.user.role === "admin" ||
                req.user.role === "superadmin";

            if (!isAdmin) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You are not authorized to view this withdrawal."

                });

            }

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
// IMPORTANT:
// Approval does NOT deduct money.
//
// It only changes:
//
// pending → approved
//
// Money is deducted only during completion.
// ======================================================

exports.approveWithdrawal = async (req, res) => {

    try {

        const withdrawal =
            await Withdrawal.findById(
                req.params.id
            );


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }


        if (withdrawal.status !== "pending") {

            return res.status(400).json({

                success: false,

                message:
                    "Only pending withdrawals can be approved."

            });

        }


        withdrawal.status = "approved";

        withdrawal.approvedBy =
            req.user._id;

        withdrawal.approvedAt =
            new Date();

        withdrawal.estimatedCompletion =
            new Date(
                Date.now() +
                (30 * 60 * 1000)
            );


        await withdrawal.save();


        await createAuditLog({

            req,

            user: req.user,

            action: "APPROVE_WITHDRAWAL",

            module: "withdrawal",

            description:
                "Withdrawal approved and ready for processing.",

            targetModel: "Withdrawal",

            targetId: withdrawal._id,

            targetName: withdrawal.withdrawalId

        });


        return res.status(200).json({

            success: true,

            message:
                "Withdrawal approved successfully.",

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
// PROCESS WITHDRAWAL
// ======================================================
//
// approved → processing
//
// This stage does NOT deduct wallet balance.
// ======================================================

exports.processWithdrawal = async (req, res) => {

    try {

        const withdrawal =
            await Withdrawal.findById(
                req.params.id
            );


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }


        if (withdrawal.status !== "approved") {

            return res.status(400).json({

                success: false,

                message:
                    "Only approved withdrawals can be processed."

            });

        }


        withdrawal.status =
            "processing";


        await withdrawal.save();


        await createAuditLog({

            req,

            user: req.user,

            action: "PROCESS_WITHDRAWAL",

            module: "withdrawal",

            description:
                "Withdrawal moved to processing.",

            targetModel: "Withdrawal",

            targetId: withdrawal._id,

            targetName: withdrawal.withdrawalId

        });


        return res.status(200).json({

            success: true,

            message:
                "Withdrawal moved to processing.",

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
// COMPLETE WITHDRAWAL
// ======================================================
//
// processing → completed
//
// THIS is the financial operation.
//
// Wallet update
// Transaction record
// Withdrawal update
//
// all happen inside ONE MongoDB transaction.
// ======================================================

exports.completeWithdrawal = async (req, res) => {

    try {

        const withdrawal =
            await Withdrawal.findById(
                req.params.id
            );


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }


        if (withdrawal.status !== "processing") {

            return res.status(400).json({

                success: false,

                message:
                    "Only processing withdrawals can be completed."

            });

        }


        const result =
            await executeFinancialTransaction(

                async (session) => {


                    // ==================================
                    // Get withdrawal again inside
                    // transaction
                    // ==================================

                    const currentWithdrawal =
                        await Withdrawal.findById(
                            withdrawal._id
                        ).session(session);


                    if (!currentWithdrawal) {

                        throw new Error(
                            "Withdrawal not found."
                        );

                    }


                    if (
                        currentWithdrawal.status !==
                        "processing"
                    ) {

                        throw new Error(
                            "Withdrawal is no longer processing."
                        );

                    }


                    // ==================================
                    // Get wallet
                    // ==================================

                    const wallet =
                        await Wallet.findById(
                            currentWithdrawal.wallet
                        ).session(session);


                    if (!wallet) {

                        throw new Error(
                            "Wallet not found."
                        );

                    }


                    // ==================================
                    // Check balance
                    // ==================================

                    if (
                        wallet.availableBalance <
                        currentWithdrawal.amount
                    ) {

                        throw new Error(
                            "Insufficient wallet balance."
                        );

                    }


                    // ==================================
                    // Balance snapshot
                    // ==================================

                    const balanceBefore =
                        wallet.availableBalance;


                    // ==================================
                    // Calculate fee
                    // ==================================

                    const processingFee =
                        Number(
                            currentWithdrawal.processingFee || 0
                        );


                    const netAmount =
                        Math.max(
                            currentWithdrawal.amount -
                            processingFee,
                            0
                        );


                    // ==================================
                    // Deduct wallet
                    // ==================================

                    wallet.availableBalance -=
                        currentWithdrawal.amount;


                    wallet.totalWithdrawn =
                        (wallet.totalWithdrawn || 0) +
                        currentWithdrawal.amount;


                    wallet.lastWithdrawalDate =
                        new Date();


                    wallet.lastTransactionDate =
                        new Date();


                    await wallet.save({

                        session

                    });


                    // ==================================
                    // Create financial transaction
                    // ==================================

                    const transaction =
                        await Transaction.create(

                            [{

                                user:
                                    currentWithdrawal.user,

                                wallet:
                                    wallet._id,

                                amount:
                                    currentWithdrawal.amount,

                                currency:
                                    currentWithdrawal.currency,

                                transactionType:
                                    "withdrawal",

                                transactionDirection:
                                    "debit",

                                paymentMethod:
                                    currentWithdrawal.withdrawalMethod,

                                paymentGateway:
                                    currentWithdrawal.paymentGateway,

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

                    currentWithdrawal.status =
                        "completed";


                    currentWithdrawal.completedBy =
                        req.user._id;


                    currentWithdrawal.completedAt =
                        new Date();


                    currentWithdrawal.processingFee =
                        processingFee;


                    currentWithdrawal.netAmount =
                        netAmount;


                    currentWithdrawal.transaction =
                        transaction[0]._id;


                    if (
                        currentWithdrawal.estimatedCompletion
                    ) {

                        currentWithdrawal.processingDuration =
                            Math.max(
                                new Date() -
                                currentWithdrawal.estimatedCompletion,
                                0
                            );

                    }


                    await currentWithdrawal.save({

                        session

                    });


                    // ==================================
                    // Audit
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
                            currentWithdrawal._id,

                        targetName:
                            currentWithdrawal.withdrawalId,

                        metadata: {

                            amount:
                                currentWithdrawal.amount,

                            processingFee,

                            netAmount

                        }

                    });


                    return {

                        withdrawal:
                            currentWithdrawal,

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

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// REJECT WITHDRAWAL
// ======================================================

exports.rejectWithdrawal = async (req, res) => {

    try {

        const withdrawal =
            await Withdrawal.findById(
                req.params.id
            );


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }


        if (withdrawal.status !== "pending") {

            return res.status(400).json({

                success: false,

                message:
                    "Only pending withdrawals can be rejected."

            });

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


        await withdrawal.save();


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

            }

        });


        return res.status(200).json({

            success: true,

            message:
                "Withdrawal rejected successfully.",

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
// CANCEL WITHDRAWAL
// ======================================================
//
// User cancellation.
// Only pending withdrawals can be cancelled.
// ======================================================

exports.cancelWithdrawal = async (req, res) => {

    try {

        const withdrawal =
            await Withdrawal.findById(
                req.params.id
            );


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }


        // ----------------------------------------------
        // Security: only owner can cancel
        // ----------------------------------------------

        if (
            withdrawal.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to cancel this withdrawal."

            });

        }


        if (withdrawal.status !== "pending") {

            return res.status(400).json({

                success: false,

                message:
                    "Only pending withdrawals can be cancelled."

            });

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


        await withdrawal.save();


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

            metadata: {

                cancellationReason:
                    withdrawal.cancellationReason

            }

        });


        return res.status(200).json({

            success: true,

            message:
                "Withdrawal cancelled successfully.",

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
// FAIL WITHDRAWAL
// ======================================================

exports.failWithdrawal = async (req, res) => {

    try {

        const withdrawal =
            await Withdrawal.findById(
                req.params.id
            );


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }


        if (withdrawal.status !== "processing") {

            return res.status(400).json({

                success: false,

                message:
                    "Only processing withdrawals can be marked as failed."

            });

        }


        const reason =
            req.body.failureReason ||
            "Withdrawal processing failed.";


        withdrawal.status =
            "failed";


        withdrawal.failureReason =
            reason;


        await withdrawal.save();


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

            }

        });


        return res.status(200).json({

            success: true,

            message:
                "Withdrawal marked as failed.",

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
// RETRY FAILED WITHDRAWAL
// ======================================================

exports.retryFailedWithdrawal = async (req, res) => {

    try {

        const withdrawal =
            await Withdrawal.findById(
                req.params.id
            );


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }


        if (withdrawal.status !== "failed") {

            return res.status(400).json({

                success: false,

                message:
                    "Only failed withdrawals can be retried."

            });

        }


        withdrawal.retryCount =
            (withdrawal.retryCount || 0) + 1;


        withdrawal.status =
            "processing";


        withdrawal.failureReason =
            "";


        withdrawal.estimatedCompletion =
            new Date(
                Date.now() +
                (30 * 60 * 1000)
            );


        await withdrawal.save();


        await createAuditLog({

            req,

            user: req.user,

            action:
                "RETRY_WITHDRAWAL",

            module:
                "withdrawal",

            description:
                "Failed withdrawal was retried.",

            targetModel:
                "Withdrawal",

            targetId:
                withdrawal._id,

            targetName:
                withdrawal.withdrawalId,

            metadata: {

                retryCount:
                    withdrawal.retryCount

            }

        });


        return res.status(200).json({

            success: true,

            message:
                "Withdrawal retry started successfully.",

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
