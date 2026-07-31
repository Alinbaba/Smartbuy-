// ======================================================
// SmartBuy CSV Export Utility
// ======================================================

const { Parser } = require("json2csv");

// ======================================================
// Export Data to CSV
// ======================================================

exports.exportCSV = (data, fields) => {

    const parser = new Parser({

        fields

    });

    return parser.parse(data);

};
