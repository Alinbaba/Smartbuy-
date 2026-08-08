const mongoose = require("mongoose");

// ======================================================
// SmartBuy Enterprise Financial Transaction Engine
// ======================================================
//
// Purpose:
// Provides a central MongoDB transaction wrapper for ALL
// SmartBuy financial operations.
//
// Used by:
// - Wallet
// - Withdrawal
// - Payment
// - Refund
// - Order payment
// - Transfers
// - Deposits
// - Commissions
// - Cashback
// - Rewards
//
// IMPORTANT:
//
// Financial operations should use this engine whenever
// multiple database records must succeed or fail together.
//
// Example:
//
// Wallet update
//      ↓
// Transaction record
//      ↓
// Withdrawal update
//      ↓
// Audit log
//
// If any operation fails:
//
// EVERYTHING IS ROLLED BACK.
//
// ======================================================


// ======================================================
// EXECUTE FINANCIAL TRANSACTION
// ======================================================

const executeFinancialTransaction = async (callback) => {

    // --------------------------------------------------
    // Validate callback
    // --------------------------------------------------

    if (typeof callback !== "function") {

        throw new TypeError(
            "Financial transaction callback must be a function."
        );

    }


    // --------------------------------------------------
    // Start MongoDB session
    // --------------------------------------------------

    const session =
        await mongoose.startSession();


    try {

        // ==================================================
        // Execute transaction
        // ==================================================
        //
        // withTransaction() automatically:
        //
        // 1. Starts the transaction
        // 2. Executes the callback
        // 3. Commits if successful
        // 4. Aborts if an error occurs
        // 5. Handles appropriate transient transaction
        //    retry behavior
        //
        // ==================================================

        const result =
            await session.withTransaction(

                async () => {

                    return await callback(session);

                },

                {

                    // --------------------------------------
                    // Read concern
                    // --------------------------------------
                    //
                    // All reads inside the transaction see
                    // a consistent snapshot.
                    //
                    // --------------------------------------

                    readConcern: {

                        level: "snapshot"

                    },


                    // --------------------------------------
                    // Write concern
                    // --------------------------------------
                    //
                    // Require majority acknowledgement
                    // before considering writes committed.
                    //
                    // --------------------------------------

                    writeConcern: {

                        w: "majority"

                    }

                }

            );


        // ==================================================
        // Return transaction result
        // ==================================================

        return result;


    } catch (error) {

        // ==================================================
        // Transaction failure
        // ==================================================
        //
        // withTransaction() handles the transaction abort.
        //
        // We simply pass the original error upward so the
        // controller can return an appropriate response.
        //
        // ==================================================

        throw error;


    } finally {

        // ==================================================
        // Always close MongoDB session
        // ==================================================

        await session.endSession();

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports =
    executeFinancialTransaction;
