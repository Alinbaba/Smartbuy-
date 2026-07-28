const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ====================================
// Create Wallet
// ====================================

exports.createWallet = async (req, res) => {

    try {

        const { userId } = req.body;

        // Check if user exists

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        // Check if wallet already exists

        const existingWallet = await Wallet.findOne({

            user: userId

        });

        if (existingWallet) {

            return res.status(400).json({

                success: false,

                message: "This user already has a wallet."

            });

        }

        // Determine wallet type automatically from user role

        let walletType = "customer";

        switch (user.role) {

            case "seller":
                walletType = "seller";
                break;

            case "affiliate":
                walletType = "affiliate";
                break;

            case "manufacturer":
                walletType = "manufacturer";
                break;

            case "wholesaler":
                walletType = "wholesaler";
                break;

            case "admin":
            case "super-admin":
            case "finance-admin":
            case "customer-care":
            case "logistics-admin":
            case "advertising-admin":
            case "security-admin":
            case "ai-admin":

                walletType = "admin";
                break;

            default:
                walletType = "customer";

        }

        // Create wallet

        const wallet = await Wallet.create({

            user: userId,

            walletType

        });

        res.status(201).json({

            success: true,

            message: "Wallet created successfully.",

            wallet

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ====================================
// Get Wallet By Wallet ID
// ====================================

exports.getWallet = async (req, res) => {

    try {

        const wallet = await Wallet.findById(req.params.id)
            .populate(
                "user",
                "userId fullName username email phone role avatar country state city isVerified isActive"
            );

        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Wallet retrieved successfully.",

            wallet

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ====================================
// Get My Wallet
// ====================================

exports.getMyWallet = async (req, res) => {

    try {

        const wallet = await Wallet.findOne({

            user: req.user.id

        }).populate(

            "user",

            "userId fullName username email phone role avatar"

        );

        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Wallet retrieved successfully.",

            wallet

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
    
};
// =====================================
// Credit Wallet
// =====================================

exports.creditWallet = async (req, res) => {

    try {

        const {

            amount,
            description
        } = req.body;

if (!amount || amount <= 0) {
    return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero."
    });
}

        const wallet = await Wallet.findById(req.params.id);


        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }

if (!wallet.isActive) {
    return res.status(403).json({
        success: false,
        message: "Wallet is inactive."
    });
}

if (wallet.isLocked) {
    return res.status(403).json({
        success: false,
        message: "Wallet is locked."
    });
}

        const balanceBefore = wallet.availableBalance;


        wallet.availableBalance += amount;

        wallet.totalEarned += amount;

        wallet.lastTransactionDate = new Date();


        await wallet.save();


        const transaction = await Transaction.create({

            user: wallet.user,

            wallet: wallet._id,

            transactionType: "deposit",

            transactionDirection: "credit",

            amount,

            currency: wallet.currency,

            paymentMethod: "wallet",

            paymentGateway: "none",

            description,

            balanceBefore,

            balanceAfter: wallet.availableBalance,

            performedBy: req.user.id

        });


        res.status(200).json({

            success: true,

            message: "Wallet credited successfully.",

            wallet,

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
// Debit Wallet
// =====================================

exports.debitWallet = async (req, res) => {

    try {

        const {

            amount,
            description,
            pin
        } = req.body;
        
if (!amount || amount <= 0) {
  const bcrypt = require("bcryptjs");
    return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero."
    });
}

        const wallet = await Wallet.findById(req.params.id);


        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }
      if (!wallet.isActive) {
    return res.status(403).json({
        success: false,
        message: "Wallet is inactive."
    });
}

if (wallet.isLocked) {
    return res.status(403).json({
        success: false,
        message: "Wallet is locked."
    });
}
// =====================================
// Verify Wallet PIN
// =====================================

if (!pin) {

    return res.status(400).json({

        success: false,
        message: "Wallet PIN is required."

    });

}

const isCorrectPin = await bcrypt.compare(

    pin,

    wallet.walletPin

);

if (!isCorrectPin) {

    return res.status(401).json({

        success: false,
        message: "Invalid Wallet PIN."

    });

}

        // Check available balance

        if (wallet.availableBalance < amount) {

            return res.status(400).json({

                success: false,

                message: "Insufficient wallet balance."

            });

        }


        const balanceBefore = wallet.availableBalance;


        wallet.availableBalance -= amount;

        wallet.totalSpent += amount;

        wallet.lastTransactionDate = new Date();
        
wallet.lastWithdrawalDate = new Date();

        await wallet.save();


        // Create Transaction Record

        const transaction = await Transaction.create({

            user: wallet.user,

            wallet: wallet._id,

            transactionType: "purchase",

            transactionDirection: "debit",

            amount,

            currency: wallet.currency,

            paymentMethod: "wallet",

            paymentGateway: "none",

            description,

            balanceBefore,

            balanceAfter: wallet.availableBalance,

            performedBy: req.user.id

        });


        res.status(200).json({

            success: true,

            message: "Wallet debited successfully.",

            wallet,

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
// Freeze Wallet
// =====================================

exports.freezeWallet = async (req, res) => {

    try {

        const {

            lockReason

        } = req.body;


        const wallet = await Wallet.findById(req.params.id);


        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }


        wallet.isLocked = true;

        wallet.lockReason = lockReason || "Security review";


        await wallet.save();


        res.status(200).json({

            success: true,

            message: "Wallet frozen successfully.",

            wallet

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Unfreeze Wallet
// =====================================

exports.unfreezeWallet = async (req, res) => {

    try {

        const wallet = await Wallet.findById(req.params.id);


        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }


        wallet.isLocked = false;

        wallet.lockReason = "";


        await wallet.save();


        res.status(200).json({

            success: true,

            message: "Wallet unfrozen successfully.",

            wallet

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Update Wallet Bank Account
// =====================================

exports.updateBankAccount = async (req, res) => {

    try {

        const {

            accountName,

            accountNumber,

            bankName

        } = req.body;


        const wallet = await Wallet.findById(req.params.id);


        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }


        wallet.bankAccount = {

            accountName,

            accountNumber,

            bankName

        };


        await wallet.save();


        res.status(200).json({

            success: true,

            message: "Bank account updated successfully.",

            bankAccount: wallet.bankAccount

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Wallet Summary
// =====================================

exports.getWalletSummary = async (req, res) => {

    try {

        const wallet = await Wallet.findById(req.params.id);


        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }


        res.status(200).json({

            success: true,

            summary: {

                availableBalance: wallet.availableBalance,

                pendingBalance: wallet.pendingBalance,

                frozenBalance: wallet.frozenBalance,

                totalEarned: wallet.totalEarned,

                totalSpent: wallet.totalSpent,

                totalWithdrawn: wallet.totalWithdrawn,

                rewardPoints: wallet.rewardPoints,

                cashbackBalance: wallet.cashbackBalance,

                loyaltyLevel: wallet.loyaltyLevel

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
// Wallet Transaction History
// =====================================

exports.getWalletHistory = async (req, res) => {

    try {

        const wallet = await Wallet.findById(req.params.id);


        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }


        const transactions = await Transaction.find({

            wallet: wallet._id,

            isDeleted: false

        })

        .sort({ createdAt: -1 });


        res.status(200).json({

            success: true,

            walletId: wallet.walletId,

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
// Set / Change Wallet PIN
// =====================================

exports.setWalletPin = async (req, res) => {

    try {

        const { pin } = req.body;

        if (!/^\d{4}$/.test(pin)) {

            return res.status(400).json({
                success: false,
                message: "Wallet PIN must be exactly 4 digits."
            });

        }

        const wallet = await Wallet.findOne({
            user: req.user.id
        });

        if (!wallet) {

            return res.status(404).json({
                success: false,
                message: "Wallet not found."
            });

        }

        wallet.walletPin = await bcrypt.hash(pin, 10);

        await wallet.save();

        res.status(200).json({
            success: true,
            message: "Wallet PIN saved successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// =====================================
// Change Wallet PIN
// =====================================

exports.changeWalletPin = async (req, res) => {

    try {

        const {
            oldPin,
            newPin,
            confirmPin
        } = req.body;

        if (!oldPin || !newPin || !confirmPin) {

            return res.status(400).json({
                success: false,
                message: "All PIN fields are required."
            });

        }

        if (newPin !== confirmPin) {

            return res.status(400).json({
                success: false,
                message: "New PINs do not match."
            });

        }

        if (!/^\d{4}$/.test(newPin)) {

            return res.status(400).json({
                success: false,
                message: "Wallet PIN must be exactly 4 digits."
            });

        }

        const wallet = await Wallet.findOne({
            user: req.user.id
        });

        if (!wallet) {

            return res.status(404).json({
                success: false,
                message: "Wallet not found."
            });

        }

        const isMatch = await bcrypt.compare(oldPin, wallet.walletPin);

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Old Wallet PIN is incorrect."
            });

        }

        const salt = await bcrypt.genSalt(10);

        wallet.walletPin = await bcrypt.hash(newPin, salt);

        await wallet.save();

        res.status(200).json({
            success: true,
            message: "Wallet PIN changed successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// =====================================
// Reset Wallet PIN
// Admin / Verified Recovery
// =====================================

exports.resetWalletPin = async (req, res) => {

    try {

        const {
            newPin,
            confirmPin
        } = req.body;

        if (!newPin || !confirmPin) {

            return res.status(400).json({
                success: false,
                message: "New PIN and confirmation are required."
            });

        }

        if (newPin !== confirmPin) {

            return res.status(400).json({
                success: false,
                message: "PINs do not match."
            });

        }

        if (!/^\d{4}$/.test(newPin)) {

            return res.status(400).json({
                success: false,
                message: "Wallet PIN must be exactly 4 digits."
            });

        }

        const wallet = await Wallet.findById(req.params.id);

        if (!wallet) {

            return res.status(404).json({
                success: false,
                message: "Wallet not found."
            });

        }

        const salt = await bcrypt.genSalt(10);

        wallet.walletPin = await bcrypt.hash(newPin, salt);

        await wallet.save();

        res.status(200).json({
            success: true,
            message: "Wallet PIN reset successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};