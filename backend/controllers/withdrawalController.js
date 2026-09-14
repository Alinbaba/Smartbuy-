// ======================================================
// SmartBuy Enterprise Withdrawal Controller
// ======================================================
//
// Responsibilities:
// - Create withdrawal requests
// - Retrieve user withdrawals
// - Retrieve withdrawal by ID
// - Retrieve all withdrawals (Admin)
// - Approve withdrawal
// - Process withdrawal
// - Complete withdrawal
// - Reject withdrawal
// - Cancel withdrawal
// - Mark withdrawal as failed
// - Retry failed withdrawal
// - Generate withdrawal summary
//
// IMPORTANT:
// Wallet balance adjustments are executed ONLY upon
// successful completion of a withdrawal within the
// financial transaction engine.
//
// Comprehensive audit logging is enforced across all
// operations in this controller.
// ======================================================


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
        // Validate wallet
        // --------------------------------------------------

        if (!wallet) {

            return res.status(400).json({

                success: false,

                message: "Wallet is required."

            });

        }


        // --------------------------------------------------
        // Validate amount
        // --------------------------------------------------

        const withdrawalAmount = Number(amount);


        if (
            !Number.isFinite(withdrawalAmount) ||
            withdrawalAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Withdrawal amount must be greater than zero."

            });

        }


        // --------------------------------------------------
        // Validate withdrawal method
        // --------------------------------------------------

        const allowedMethods = [

            "bank-transfer",
            "paypal",
            "payoneer",
            "stripe",
            "flutterwave",
            "paystack",
            "manual"

        ];


        if (
            !allowedMethods.includes(
                withdrawalMethod
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid withdrawal method."

            });

        }


        // --------------------------------------------------
        // Retrieve wallet
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
        // SECURITY: Ensure wallet ownership
        // --------------------------------------------------

        if (
            !walletData.user ||
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
        // Validate available balance
        // --------------------------------------------------

        if (
            Number(walletData.availableBalance || 0) <
            withdrawalAmount
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Insufficient wallet balance."

            });

        }


        // --------------------------------------------------
        // Determine currency
        // --------------------------------------------------

        const withdrawalCurrency =
            String(
                currency ||
                walletData.currency ||
                "NGN"
            ).toUpperCase();


        // --------------------------------------------------
        // Create withdrawal record
        // --------------------------------------------------

        const withdrawal =
            await Withdrawal.create({

                user: walletData.user,

                wallet: walletData._id,

                amount: withdrawalAmount,

                currency:
                    withdrawalCurrency,

                withdrawalMethod,

                paymentGateway:
                    paymentGateway || "none",

                bankAccount:
                    bankAccount || {},

                description:
                    description || "",

                requestedBy:
                    req.user._id,

                status:
                    "pending"

            });


        // --------------------------------------------------
        // Audit log
        // --------------------------------------------------

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
                withdrawal._id,

            targetName:
                withdrawal.withdrawalId,

            newValues: {

                amount:
                    withdrawal.amount,

                currency:
                    withdrawal.currency,

                withdrawalMethod:
                    withdrawal.withdrawalMethod,

                status:
                    withdrawal.status

            }

        });


        // --------------------------------------------------
        // Response
        // --------------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Withdrawal request created successfully.",

            withdrawal

        });


    } catch (error) {

        console.error(
            "Create Withdrawal Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

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

                user:
                    req.user._id

            })

            .populate(
                "wallet",
                "walletId walletType currency"
            )

            .populate(
                "transaction"
            )

            .sort({

                createdAt:
                    -1

            });


        return res.status(200).json({

            success: true,

            totalWithdrawals:
                withdrawals.length,

            withdrawals

        });


    } catch (error) {

        console.error(
            "Get My Withdrawals Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

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
                "walletId walletType currency"
            )

            .populate(
                "transaction"
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
            );


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message:
                    "Withdrawal not found."

            });

        }


        // --------------------------------------------------
        // SECURITY: Access control
        // --------------------------------------------------

        const withdrawalOwner =
            withdrawal.user?._id ||
            withdrawal.user;


        const isOwner =
            withdrawalOwner &&
            withdrawalOwner.toString() ===
            req.user._id.toString();


        const isAdmin =
            req.user.role === "admin" ||
            req.user.role === "superadmin";


        if (
            !isOwner &&
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

        console.error(
            "Get Withdrawal By ID Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// GET ALL WITHDRAWALS (ADMIN)
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
                "walletId walletType currency"
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

                createdAt:
                    -1

            });


        return res.status(200).json({

            success: true,

            totalWithdrawals:
                withdrawals.length,

            withdrawals

        });


    } catch (error) {

        console.error(
            "Get All Withdrawals Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// APPROVE WITHDRAWAL
// ======================================================
//
// pending → approved
//
// NOTE:
// No financial deduction occurs at this stage.
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

                message:
                    "Withdrawal not found."

            });

        }


        if (
            withdrawal.status !==
            "pending"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only pending withdrawals can be approved."

            });

        }


        const oldValues = {

            status:
                withdrawal.status,

            approvedBy:
                withdrawal.approvedBy,

            approvedAt:
                withdrawal.approvedAt

        };


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


        await withdrawal.save();


        await createAuditLog({

            req,

            user:
                req.user,

            action:
                "APPROVE_WITHDRAWAL",

            module:
                "withdrawal",

            description:
                "Withdrawal approved and queued for processing.",

            targetModel:
                "Withdrawal",

            targetId:
                withdrawal._id,

            targetName:
                withdrawal.withdrawalId,

            oldValues,

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
                "approvedAt",
                "estimatedCompletion"

            ]

        });


        return res.status(200).json({

            success: true,

            message:
                "Withdrawal approved successfully.",

            withdrawal

        });


    } catch (error) {

        console.error(
            "Approve Withdrawal Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// PROCESS WITHDRAWAL
// ======================================================
//
// approved → processing
//
// NOTE:
// No wallet deduction occurs here.
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

                message:
                    "Withdrawal not found."

            });

        }


        if (
            withdrawal.status !==
            "approved"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only approved withdrawals can be processed."

            });

        }


        const oldStatus =
            withdrawal.status;


        withdrawal.status =
            "processing";


        withdrawal.estimatedCompletion =
            new Date(
                Date.now() +
                (30 * 60 * 1000)
            );


        await withdrawal.save();


        await createAuditLog({

            req,

            user:
                req.user,

            action:
                "PROCESS_WITHDRAWAL",

            module:
                "withdrawal",

            description:
                "Withdrawal moved to processing state.",

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

                estimatedCompletion:
                    withdrawal.estimatedCompletion

            },

            changes: [

                "status",
                "estimatedCompletion"

            ]

        });


        return res.status(200).json({

            success: true,

            message:
                "Withdrawal is now processing.",

            withdrawal

        });


    } catch (error) {

        console.error(
            "Process Withdrawal Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// COMPLETE WITHDRAWAL
// ======================================================
//
// processing → completed
//
// FINANCIAL FLOW:
// Executed within a secure transaction:
// - Wallet validation
// - Balance deduction
// - Transaction creation
// - Withdrawal finalization
// - Audit logging
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

                message:
                    "Withdrawal not found."

            });

        }


        if (
            withdrawal.status !==
            "processing"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only processing withdrawals can be completed."

            });

        }


        const result =
            await executeFinancialTransaction(

                async (session) => {


                    const currentWithdrawal =
                        await Withdrawal.findById(
                            withdrawal._id
                        )
                        .session(session);


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
                            "Withdrawal is no longer in processing state."
                        );

                    }


                    const wallet =
                        await Wallet.findById(
                            currentWithdrawal.wallet
                        )
                        .session(session);


                    if (!wallet) {

                        throw new Error(
                            "Wallet not found."
                        );

                    }


                    if (
                        wallet.user.toString() !==
                        currentWithdrawal.user.toString()
                    ) {

                        throw new Error(
                            "Wallet ownership mismatch."
                        );

                    }


                    if (
                        Number(wallet.availableBalance || 0) <
                        Number(currentWithdrawal.amount)
                    ) {

                        throw new Error(
                            "Insufficient wallet balance."
                        );

                    }


                    const balanceBefore =
                        Number(wallet.availableBalance);


                    const processingFee =
                        Number(currentWithdrawal.processingFee || 0);


                    if (
                        !Number.isFinite(processingFee) ||
                        processingFee < 0
                    ) {

                        throw new Error(
                            "Invalid processing fee."
                        );

                    }


                    const netAmount =
                        Math.max(
                            Number(currentWithdrawal.amount) -
                            processingFee,
                            0
                        );


                    wallet.availableBalance =
                        balanceBefore -
                        Number(currentWithdrawal.amount);


                    wallet.totalWithdrawn =
                        Number(wallet.totalWithdrawn || 0) +
                        Number(currentWithdrawal.amount);


                    wallet.lastWithdrawalDate =
                        new Date();

                    wallet.lastTransactionDate =
                        new Date();


                    await wallet.save({ session });


                    const transactionRecords =
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

                                description:
                                    "Withdrawal completed successfully.",

                                balanceBefore,

                                balanceAfter:
                                    wallet.availableBalance,

                                status:
                                    "successful",

                                performedBy:
                                    req.user._id

                            }],

                            { session }

                        );


                    const transaction =
                        transactionRecords[0];


                    const completedAt =
                        new Date();


                    currentWithdrawal.status =
                        "completed";

                    currentWithdrawal.completedBy =
                        req.user._id;

                    currentWithdrawal.completedAt =
                        completedAt;

                    currentWithdrawal.processingFee =
                        processingFee;

                    currentWithdrawal.netAmount =
                        netAmount;

                    currentWithdrawal.transaction =
                        transaction._id;


                    const processingStart =
                        currentWithdrawal.updatedAt ||
                        currentWithdrawal.createdAt;


                    if (processingStart) {

                        currentWithdrawal.processingDuration =
                            Math.max(
                                completedAt - processingStart,
                                0
                            );

                    }


                    await currentWithdrawal.save({ session });


                    await createAuditLog({

                        req,

                        user:
                            req.user,

                        action:
                            "COMPLETE_WITHDRAWAL",

                        module:
                            "withdrawal",

                        description:
                            "Withdrawal completed and wallet updated.",

                        targetModel:
                            "Withdrawal",

                        targetId:
                            currentWithdrawal._id,

                        targetName:
                            currentWithdrawal.withdrawalId,

                        oldValues: {

                            status:
                                "processing",

                            walletBalance:
                                balanceBefore

                        },

                        newValues: {

                            status:
                                currentWithdrawal.status,

                            walletBalance:
                                wallet.availableBalance,

                            processingFee,

                            netAmount

                        },

                        changes: [

                            "status",
                            "completedBy",
                            "completedAt",
                            "processingFee",
                            "netAmount",
                            "transaction"

                        ],

                        metadata: {

                            amount:
                                currentWithdrawal.amount,

                            balanceBefore,

                            balanceAfter:
                                wallet.availableBalance,

                            transactionId:
                                transaction._id

                        },

                        session

                    });


                    return {

                        withdrawal:
                            currentWithdrawal,

                        transaction

                    };

                }

            );


        return res.status(200).json({

            success: true,

            message:
                "Withdrawal completed successfully.",

            data:
                result

        });


    } catch (error) {

        console.error(
            "Complete Withdrawal Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

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

        const withdrawal =
            await Withdrawal.findById(
                req.params.id
            );


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message:
                    "Withdrawal not found."

            });

        }


        if (
            withdrawal.status !==
            "pending"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only pending withdrawals can be rejected."

            });

        }


        const reason =
            String(
                req.body.rejectionReason ||
                "Rejected by administrator."
            ).trim();


        const oldStatus =
            withdrawal.status;


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

            user:
                req.user,

            action:
                "REJECT_WITHDRAWAL",

            module:
                "withdrawal",

            description:
                "Withdrawal rejected.",

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

                rejectedBy:
                    withdrawal.rejectedBy,

                rejectedAt:
                    withdrawal.rejectedAt,

                rejectionReason:
                    withdrawal.rejectionReason

            },

            changes: [

                "status",
                "rejectedBy",
                "rejectedAt",
                "rejectionReason"

            ]

        });


        return res.status(200).json({

            success: true,

            message:
                "Withdrawal rejected successfully.",

            withdrawal

        });


    } catch (error) {

        console.error(
            "Reject Withdrawal Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};
