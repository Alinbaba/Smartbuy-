const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");

// =====================================
// Create Transaction
// =====================================

exports.createTransaction = async (req, res) => {

    try {

        const {

            wallet,
            transactionType,
            transactionDirection,
            amount,
            currency,
            paymentMethod,
            paymentGateway,
            description

        } = req.body;

        // Check if wallet exists

        const walletData = await Wallet.findById(wallet);

        if (!walletData) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }

        // Create transaction

        const transaction = await Transaction.create({

            user: walletData.user,

            wallet,

            transactionType,

            transactionDirection,

            amount,

            currency,

            paymentMethod,

            paymentGateway,

            description,

            balanceBefore: walletData.availableBalance,

            balanceAfter: walletData.availableBalance,

            performedBy: req.user.id

        });

        res.status(201).json({

            success: true,

            message: "Transaction created successfully.",

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
// Get Transaction By ID
// =====================================

exports.getTransaction = async (req, res) => {

    try {

        const transaction = await Transaction.findById(req.params.id)

            .populate("user", "fullName username email phone")

            .populate("wallet", "walletId walletType")

            .populate("sender", "fullName username")

            .populate("receiver", "fullName username");

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message: "Transaction not found."

            });

        }

        res.status(200).json({

            success: true,

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
// Get My Transactions
// =====================================

exports.getMyTransactions = async (req, res) => {

    try {

        const transactions = await Transaction.find({

            user: req.user.id,

            isDeleted: false

        })

        .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            totalTransactions: transactions.length,

            transactions

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Get All Transactions (Admin)
// =====================================

exports.getAllTransactions = async (req, res) => {

    try {

        const transactions = await Transaction.find({

            isDeleted: false

        })

        .populate("user", "fullName username email")

        .populate("wallet", "walletId walletType")

        .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            totalTransactions: transactions.length,

            transactions

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Update Transaction Status
// =====================================

exports.updateTransactionStatus = async (req, res) => {

    try {

        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message: "Transaction not found."

            });

        }

        transaction.status = req.body.status || transaction.status;

        transaction.failureReason =
            req.body.failureReason || transaction.failureReason;

        transaction.remarks =
            req.body.remarks || transaction.remarks;

        transaction.isVerified =
            req.body.isVerified ?? transaction.isVerified;

        if (req.body.isVerified === true) {

            transaction.verifiedBy = req.user.id;

            transaction.verifiedAt = new Date();

        }

        await transaction.save();

        res.status(200).json({

            success: true,

            message: "Transaction status updated successfully.",

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
// Soft Delete Transaction
// =====================================

exports.deleteTransaction = async (req, res) => {

    try {

        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message: "Transaction not found."

            });

        }

        transaction.isDeleted = true;

        transaction.deletedAt = new Date();

        await transaction.save();

        res.status(200).json({

            success: true,

            message: "Transaction deleted successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Transaction Summary
// =====================================

exports.getTransactionSummary = async (req, res) => {

    try {

        const transactions = await Transaction.find({

            user: req.user.id,

            isDeleted: false,

            status: "successful"

        });

        let totalCredit = 0;

        let totalDebit = 0;

        transactions.forEach(transaction => {

            if (transaction.transactionDirection === "credit") {

                totalCredit += transaction.amount;

            } else if (transaction.transactionDirection === "debit") {

                totalDebit += transaction.amount;

            }

        });

        res.status(200).json({

            success: true,

            summary: {

                totalTransactions: transactions.length,

                totalCredit,

                totalDebit,

                netBalance: totalCredit - totalDebit

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
// Transaction Reports
// =====================================

exports.getTransactionReport = async (req, res) => {

    try {

        const report = await Transaction.aggregate([

            {
                $match: {
                    isDeleted: false
                }
            },

            {
                $group: {

                    _id: "$transactionType",

                    totalTransactions: {
                        $sum: 1
                    },

                    totalAmount: {
                        $sum: "$amount"
                    }

                }

            },

            {
                $sort: {
                    totalAmount: -1
                }
            }

        ]);

        res.status(200).json({

            success: true,

            report

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};