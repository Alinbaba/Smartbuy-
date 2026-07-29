const Withdrawal = require("../models/Withdrawal");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
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
// =====================================
// Approve Withdrawal
// =====================================

exports.approveWithdrawal = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id);


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }

        if (withdrawal.status !== "processing") {

    return res.status(400).json({

        success: false,
        message: "Withdrawal must be approved before completion."

    });

        }


        withdrawal.status = "processing";

        withdrawal.approvedBy = req.user.id;

        withdrawal.approvedAt = new Date();


        await withdrawal.save();


        res.status(200).json({

            success: true,

            message: "Withdrawal approved and processing.",

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
// Reject Withdrawal
// =====================================

exports.rejectWithdrawal = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {

            return res.status(404).json({
                success: false,
                message: "Withdrawal not found."
            });

        }

        withdrawal.status = "rejected";
        withdrawal.rejectedBy = req.user.id;
        withdrawal.rejectedAt = new Date();

        await withdrawal.save();

        res.status(200).json({
            success: true,
            message: "Withdrawal rejected successfully.",
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
// Complete Withdrawal
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


        const wallet = await Wallet.findById(withdrawal.wallet);


        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }


        const balanceBefore = wallet.availableBalance;


        // Deduct wallet balance

        wallet.availableBalance -= withdrawal.amount;

        wallet.totalWithdrawn += withdrawal.amount;

        wallet.lastWithdrawalDate = new Date();

        wallet.lastTransactionDate = new Date();


        await wallet.save();


        // Create transaction record

        const transaction = await Transaction.create({

            user: withdrawal.user,

            wallet: wallet._id,

            transactionType: "withdrawal",

            transactionDirection: "debit",

            amount: withdrawal.amount,

            currency: withdrawal.currency,

            paymentMethod: withdrawal.withdrawalMethod,

            paymentGateway: withdrawal.paymentGateway,

            description: "Wallet withdrawal",

            balanceBefore,

            balanceAfter: wallet.availableBalance,

            performedBy: req.user.id

        });


        withdrawal.status = "completed";
        withdrawal.completedAt = new Date();
        withdrawal.completedBy = req.user.id;


        await withdrawal.save();


        res.status(200).json({

            success: true,

            message: "Withdrawal completed successfully.",

            withdrawal,

            transaction

        });


    } catch (error) {

        res.status(500).json({

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
