// ======================================================
// SmartBuy PDF Export Utility
// ======================================================

const PDFDocument = require("pdfkit");

// ======================================================
// Export Data to PDF
// ======================================================

exports.exportPDF = (title, data) => {

    const doc = new PDFDocument({

        margin: 40,

        size: "A4"

    });

    // ==================================================
    // Title
    // ==================================================

    doc

        .fontSize(20)

        .text(title, {

            align: "center"

        });

    doc.moveDown();

    // ==================================================
    // Export Date
    // ==================================================

    doc

        .fontSize(10)

        .text(

            `Generated: ${new Date().toLocaleString()}`

        );

    doc.moveDown();

    // ==================================================
    // Data
    // ==================================================

    data.forEach((item, index) => {

        doc

            .fontSize(12)

            .text(`${index + 1}.`);

        Object.entries(item).forEach(([key, value]) => {

            doc.text(`${key}: ${value}`);

        });

        doc.moveDown();

    });

    return doc;

};
