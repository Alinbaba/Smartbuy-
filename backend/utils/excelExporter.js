// ======================================================
// SmartBuy Excel Export Utility
// ======================================================

const ExcelJS = require("exceljs");

// ======================================================
// Export Data to Excel
// ======================================================

exports.exportExcel = async (

    sheetName,

    columns,

    rows

) => {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "SmartBuy";

    workbook.company = "SmartBuy Enterprise";

    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(sheetName);

    // ==================================================
    // Worksheet Columns
    // ==================================================

    worksheet.columns = columns;

    // ==================================================
    // Add Rows
    // ==================================================

    worksheet.addRows(rows);

    // ==================================================
    // Header Style
    // ==================================================

    worksheet.getRow(1).font = {

        bold: true,

        color: {

            argb: "FFFFFFFF"

        }

    };

    worksheet.getRow(1).fill = {

        type: "pattern",

        pattern: "solid",

        fgColor: {

            argb: "1F4E78"

        }

    };

    worksheet.getRow(1).alignment = {

        horizontal: "center",

        vertical: "middle"

    };

    // ==================================================
    // Auto Width
    // ==================================================

    worksheet.columns.forEach(column => {

        let maxLength = 15;

        column.eachCell?.({

            includeEmpty: true

        }, cell => {

            const length = cell.value

                ? cell.value.toString().length

                : 10;

            if (length > maxLength) {

                maxLength = length;

            }

        });

        column.width = maxLength + 5;

    });

    return workbook;

};
