const mongoose = require("mongoose");

// ======================================================
// SmartBuy Enterprise Financial Transaction Engine
// ======================================================
//
// Purpose:
// Handles all financial operations safely.
//
// Used by:
// - Wallet
// - Withdrawal
// - Payment
// - Refund
// - Order payment
// - Transfers
//
// If anything fails:
// Everything is rolled back automatically.
// ======================================================


const executeFinancialTransaction = async (

    callback

) => {


    const session = await mongoose.startSession();


    try {


        session.startTransaction({

            readConcern: {

                level: "snapshot"

            },

            writeConcern: {

                w: "majority"

            }

        });



        const result = await callback(session);



        await session.commitTransaction();


        return result;



    } catch (error) {


        await session.abortTransaction();


        throw error;



    } finally {


        await session.endSession();


    }


};



module.exports = executeFinancialTransaction;
