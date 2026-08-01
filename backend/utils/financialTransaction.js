const mongoose = require("mongoose");

// ======================================================
// Execute Financial Transaction
// ======================================================

const executeFinancialTransaction = async (callback) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const result = await callback(session);

        await session.commitTransaction();

        session.endSession();

        return result;

    } catch (error) {

        await session.abortTransaction();

        session.endSession();

        throw error;

    }

};

module.exports = executeFinancialTransaction;
