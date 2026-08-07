const Withdrawal = require("../models/Withdrawal");
const Wallet = require("../models/Wallet");
const executeFinancialTransaction = require("../utils/financialTransaction");
const Transaction = require("../models/Transaction");
const createAuditLog = require("../utils/auditLog");
// =====================================
// Create Withdrawal Request
// =====================================

exports.createWithdrawal = async (req, res) => {

    try {

        const {

            wallet,
            amount,
            currency,
            withdrawalMethod,
            description

        } = req.body;


        // Find Wallet

        const walletData = await Wallet.findById(wallet);


        if (!walletData) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }


        // Check Balance

        if (walletData.availableBalance < amount) {

            return res.status(400).json({

                success: false,

                message: "Insufficient wallet balance."

            });

        }


        // Create Withdrawal

        const withdrawal = await Withdrawal.create({

            user: walletData.user,

            wallet: walletData._id,

            amount,

            currency,

            withdrawalMethod,

            description,

            requestedBy: req.user.id

        });


        res.status(201).json({

            success: true,

            message: "Withdrawal request created successfully.",

            withdrawal

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Get My Withdrawals
// =====================================

exports.getMyWithdrawals = async (req, res) => {

    try {

        const withdrawals = await Withdrawal.find({

            user: req.user.id

        })

        .sort({ createdAt: -1 });


        res.status(200).json({

            success: true,

            totalWithdrawals: withdrawals.length,

            withdrawals

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Get All Withdrawals (Admin)
// =====================================

exports.getAllWithdrawals = async (req, res) => {

    try {

        const withdrawals = await Withdrawal.find()

            .populate("user", "fullName username email")

            .populate("wallet", "walletId walletType")

            .sort({ createdAt: -1 });


        res.status(200).json({

            success: true,

            totalWithdrawals: withdrawals.length,

            withdrawals

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Approve Withdrawal (Enterprise Version)
// ======================================================

exports.approveWithdrawal = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id);


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }


        if (withdrawal.status !== "pending") {

            return res.status(400).json({

                success: false,

                message: "Only pending withdrawals can be approved."

            });

        }


        const result = await executeFinancialTransaction(

            async (session) => {


                const wallet = await Wallet.findById(

                    withdrawal.wallet

                ).session(session);



                if (!wallet) {

                    throw new Error(
                        "Wallet not found."
                    );

                }


                if (wallet.availableBalance < withdrawal.amount) {

                    throw new Error(
                        "Insufficient wallet balance."
                    );

                }

// ==========================
// Approve Withdrawal
// ==========================

withdrawal.status = "approved";

withdrawal.approvedBy = req.user._id;

withdrawal.approvedAt = new Date();

await withdrawal.save({

    session

});


                // ==========================
                // Audit Log
                // ==========================

                await createAuditLog({

                    req,

                    user: req.user,

                    action: "APPROVE_WITHDRAWAL",

                    module: "withdrawal",

                    description:
                        "Withdrawal approved and ready for processing",
                    targetModel: "Withdrawal",

                    targetId: withdrawal._id,

                    targetName: withdrawal.withdrawalId

                });



                return withdrawal;


            }

        );



        return res.status(200).json({

            success: true,

            message:
            "Withdrawal approved successfully.",

            data: result


        });



    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });


    }

};


// =====================================
// Process Withdrawal (Enterprise)
// =====================================

exports.processWithdrawal = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }

        // Only approved withdrawals can be processed

        if (withdrawal.status !== "approved") {

            return res.status(400).json({

                success: false,

                message: "Only approved withdrawals can be processed."

            });

        }

        withdrawal.status = "processing";

        await withdrawal.save();

        // Audit Log

        await createAuditLog({

            req,

            user: req.user,

            action: "PROCESS_WITHDRAWAL",

            module: "withdrawal",

            description: "Withdrawal is now being processed.",

            targetModel: "Withdrawal",

            targetId: withdrawal._id,

            targetName: withdrawal.withdrawalId

        });

        return res.status(200).json({

            success: true,

            message: "Withdrawal moved to processing.",

            withdrawal

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Reject Withdrawal (Enterprise)
// =====================================

exports.rejectWithdrawal = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id);

        // =====================================
        // Check Withdrawal
        // =====================================

        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }

        // =====================================
        // Only Pending Withdrawals Can Be Rejected
        // =====================================

        if (withdrawal.status !== "pending") {

            return res.status(400).json({

                success: false,

                message:
                    "Only pending withdrawals can be rejected."

            });

        }

        // =====================================
        // Rejection Reason
        // =====================================

        const reason =
            req.body.rejectionReason ||
            "Withdrawal rejected by administrator.";

        // =====================================
        // Update Withdrawal
        // =====================================

        withdrawal.status = "rejected";

        withdrawal.rejectedBy = req.user._id;

        withdrawal.rejectedAt = new Date();

        withdrawal.rejectionReason = reason;

        await withdrawal.save();

        // =====================================
        // Audit Log
        // =====================================

        await createAuditLog({

            req,

            user: req.user,

            action: "REJECT_WITHDRAWAL",

            module: "withdrawal",

            description:
                "Withdrawal request rejected.",

            targetModel: "Withdrawal",

            targetId: withdrawal._id,

            targetName: withdrawal.withdrawalId,

            metadata: {

                rejectionReason: reason

            }

        });

        // =====================================
        // Response
        // =====================================

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

// =====================================
// Complete Withdrawal (Enterprise)
// =====================================

exports.completeWithdrawal = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }

       

        const result = await executeFinancialTransaction(

            async (session) => {

                // =====================================
                // Get Wallet
                // =====================================

                const wallet = await Wallet.findById(

                    withdrawal.wallet

                ).session(session);

                if (!wallet) {

                    throw new Error("Wallet not found.");

   // Only processing withdrawals can be completed

if (withdrawal.status !== "processing") {

    return res.status(400).json({

        success: false,

        message: "Only processing withdrawals can be completed."

    });

}             }

                if (wallet.availableBalance < withdrawal.amount) {

                    throw new Error("Insufficient wallet balance.");

                }

                // =====================================
                // Mark as Processing
                // =====================================

                withdrawal.status = "processing";

                await withdrawal.save({ session });

                // =====================================
                // Wallet Balance
                // =====================================

                const balanceBefore = wallet.availableBalance;

                wallet.availableBalance -= withdrawal.amount;

                wallet.totalWithdrawn += withdrawal.amount;

                wallet.lastWithdrawalDate = new Date();

                wallet.lastTransactionDate = new Date();

                await wallet.save({ session });

                // =====================================
                // Create Transaction
                // =====================================

                const transaction = await Transaction.create([{

                    user: withdrawal.user,

                    wallet: wallet._id,

                    transactionType: "withdrawal",

                    transactionDirection: "debit",

                    amount: withdrawal.amount,

                    currency: withdrawal.currency,

                    paymentMethod: withdrawal.withdrawalMethod,

                    paymentGateway: withdrawal.paymentGateway,

                    description: "Wallet withdrawal completed",

                    balanceBefore,

                    balanceAfter: wallet.availableBalance,

                    status: "successful",

                    performedBy: req.user._id

                }], {

                    session

                });

                // =====================================
                // Complete Withdrawal
                // =====================================

                withdrawal.status = "completed";

                withdrawal.completedBy = req.user._id;

                withdrawal.completedAt = new Date();

                withdrawal.transaction = transaction[0]._id;

                await withdrawal.save({ session });

                // =====================================
                // Audit Log
                // =====================================

                await createAuditLog({

                    req,

                    user: req.user,

                    action: "COMPLETE_WITHDRAWAL",

                    module: "withdrawal",

                    description: "Withdrawal completed successfully.",

                    targetModel: "Withdrawal",

                    targetId: withdrawal._id,

                    targetName: withdrawal.withdrawalId

                });

                return {

                    withdrawal,

                    transaction: transaction[0]

                };

            }

        );

        return res.status(200).json({

            success: true,

            message: "Withdrawal completed successfully.",

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Withdrawal Summary
// =====================================

exports.getWithdrawalSummary = async (req, res) => {

    try {

        const withdrawals = await Withdrawal.find({

            user: req.user.id

        });


        let totalAmount = 0;

        let completedAmount = 0;

        let pendingAmount = 0;


        withdrawals.forEach(withdrawal => {

            totalAmount += withdrawal.amount;


            if (withdrawal.status === "completed") {

                completedAmount += withdrawal.amount;

            }


            if (withdrawal.status === "pending" ||
                withdrawal.status === "processing") {

                pendingAmount += withdrawal.amount;

            }

        });


        res.status(200).json({

            success: true,

            summary: {

                totalWithdrawals: withdrawals.length,

                totalAmount,

                completedAmount,

                pendingAmount

            }

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Controller Export Check
// =====================================

exports.getWithdrawalById = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id)

            .populate("user", "fullName username email")

            .populate("wallet", "walletId walletType");


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."
            
            });

        }


        res.status(200).json({

            success: true,

            withdrawal

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
