// ======================================================
// SmartBuy Enterprise Export Service
// ======================================================

const { exportCSV } = require("../utils/csvExporter");
const { exportExcel } = require("../utils/excelExporter");
const { exportPDF } = require("../utils/pdfExporter");

// ======================================================
// Export CSV
// ======================================================

exports.generateCSV = (

    data,

    fields

) => {

    return exportCSV(

        data,

        fields

    );

};

// ======================================================
// Export Excel
// ======================================================

exports.generateExcel = async (

    sheetName,

    columns,

    rows

) => {

    return await exportExcel(

        sheetName,

        columns,

        rows

    );

};

// ======================================================
// Export PDF
// ======================================================

exports.generatePDF = (

    title,

    data

) => {

    return exportPDF(

        title,

        data

    );

};
