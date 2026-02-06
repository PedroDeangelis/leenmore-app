import moment from "moment";
import transl from "../../../components/translate";
import sanitizeFilename from "../../../components/sanitizeFilename";

const ExcelJS = require("exceljs");

const rgbToHex = (rgb) => {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r, g, b)" into [r, g, b]
    rgb = rgb.substr(4).split(")")[0].split(sep);

    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);

    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "FF" + r + g + b;
};

const cleanN = (value) => {
    return parseInt(value.replace(/[,\.]/g, ""));
};

const downloadExcelNotes = async (
    shares_issued,
    shares_target,
    resultsRate,
    title,
    deadline
) => {
    if (resultsRate?.results?.length == 0) {
        alert("No results to download");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("My Sheet");
    // font calibri
    worksheet.font = { name: "Calibri", size: 12 };

    // TITLE
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { size: 16, bold: true };
    worksheet.mergeCells(`A1:E1`);
    titleRow.alignment = { horizontal: "center", vertical: "middle" };
    titleRow.height = 32;

    // Subtitle
    const subtitleRow = worksheet.addRow(["위임 권유 활동 현황 보고"]);
    subtitleRow.font = { size: 16, bold: true };
    worksheet.mergeCells(`A2:E2`);
    subtitleRow.alignment = { horizontal: "center", vertical: "middle" };

    // Add a blank row
    worksheet.addRow([]);

    // Add header row
    const headerTodayRow = worksheet.addRow([
        "",
        "",
        "",
        "작성 일:",
        { formula: "=TODAY()", result: new Date() },
    ]);
    headerTodayRow.font = { bold: true };
    headerTodayRow.getCell(4).alignment = { horizontal: "right" };

    const year = moment(deadline).format("YYYY");
    const month = moment(deadline).format("MM");
    const day = moment(deadline).format("DD");

    const headerDeadlineRow = worksheet.addRow([
        "",
        "",
        "",
        "주주총회 일:",
        { formula: `=DATE(${year}, ${month}, ${day})`, result: new Date() },
    ]);
    headerDeadlineRow.font = { bold: true };
    headerDeadlineRow.getCell(4).alignment = { horizontal: "right" };

    const headerDaysLeftRow = worksheet.addRow([
        "",
        "",
        "",
        "잔여 일:",
        { formula: `=E5-E4`, result: 0 },
    ]);
    headerDaysLeftRow.font = { bold: true };
    headerDaysLeftRow.getCell(4).alignment = { horizontal: "right" };

    // Add a blank row
    worksheet.addRow([]);

    // Define some data.
    const data = [
        [
            transl("total number of shares issued"),
            "",
            "",
            "",
            transl("target number of shares"),
        ],
        [cleanN(shares_issued), "", "", "", cleanN(shares_target)],
        ["", "", "", "", ""],
        [
            transl("result"),
            transl("number of shares"),
            transl("percentage"),
            transl("type total"),
            transl("type percentage"),
        ],
    ];

    // Add data to worksheet.
    data.forEach((cell, index) => {
        const row = worksheet.addRow(cell);

        if (index == 0) {
            row.getCell(1).font = { bold: true };
            row.getCell(1).alignment = {
                horizontal: "center",
            };
            row.getCell(5).font = { bold: true };
            row.getCell(5).alignment = {
                horizontal: "center",
            };
        }

        if (index == 1) {
            row.getCell(1).numFmt = "#,##0";
            row.getCell(5).numFmt = "#,##0";
        }

        if (index == 3) {
            row.height = 20;

            for (let i = 1; i <= 5; i++) {
                row.getCell(i).border = {
                    top: { style: "medium" },
                    bottom: { style: "double" },
                    right: { style: "thin" },
                };

                if (i == 5) {
                    row.getCell(i).border = {
                        top: { style: "medium" },
                        bottom: { style: "double" },
                        right: { style: "medium" },
                    };
                }

                row.getCell(i).font = { bold: true };
                row.getCell(i).alignment = {
                    horizontal: "center",
                    vertical: "middle",
                };
            }
        }
    });

    worksheet.columns[0].width = 30;
    worksheet.columns[1].width = 18;
    worksheet.columns[2].width = 25;
    worksheet.columns[3].width = 18;
    worksheet.columns[4].width = 25;

    // how many rows in colorTotal

    var resultsRateRowsCount = [];

    resultsRate.results.forEach((result, index) => {
        if (!resultsRateRowsCount.hasOwnProperty(result.color)) {
            resultsRateRowsCount[result.color] = 0;
        }

        resultsRateRowsCount[result.color]++;
    });

    console.log("resultsRate", resultsRate);

    resultsRate.results.forEach((result, index) => {
        let rowValues = [
            result.name,
            cleanN(result.total),
            {
                formula: `=B${index + 12}/E9`,
                result: 0,
            },
            "",
            "",
        ];

        if (
            resultsRate.colorTotal.hasOwnProperty(result.color) &&
            resultsRate.colorTotal[result.color]["result"] == result.result
        ) {
            rowValues[3] = {
                formula: `=SUM(B${index + 12}:B${
                    index + 12 + ((resultsRateRowsCount[result.color] ?? 1) - 1)
                })`,
                result: 0,
                numFmt: "#,##0",
            };
            rowValues[4] = {
                formula: `=D${index + 12}/E9`,
                result: 0,
            };
        }

        const row = worksheet.addRow(rowValues);

        row.getCell(2).numFmt = "#,##0";
        row.getCell(3).numFmt = "0.00%";
        row.getCell(4).numFmt = "#,##0";
        row.getCell(5).numFmt = "0.00%";

        row.eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: rgbToHex(result.colorHex) },
            };

            cell.border = {
                right: { style: "thin" },
                bottom: { style: "thin" },
            };

            if (cell.col == 5) {
                cell.border = {
                    right: { style: "medium" },
                    bottom: { style: "thin" },
                };
            }
        });
    });

    // last row border bottom medium
    const lastRow = worksheet.lastRow;
    lastRow.eachCell((cell) => {
        cell.border = { right: { style: "thin" }, bottom: { style: "medium" } };

        if (cell.col == 5) {
            cell.border = {
                right: { style: "medium" },
                bottom: { style: "medium" },
            };
        }
    });

    worksheet.addConditionalFormatting({
        ref: "E6",
        rules: [
            {
                type: "expression",
                formulae: ["E6<0"],
                style: { font: { color: { argb: "FFFF0000" } } },
            },
        ],
    });

    // Write to buffer.
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer and create an Object URL for it.
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    // Create a link element, set the href to the Object URL, and click it to start the download.
    const link = document.createElement("a");
    link.href = url;
    link.download = sanitizeFilename(`${title}.xlsx`);
    link.click();

    // Release the Object URL after the download has started.
    URL.revokeObjectURL(url);
};

export default downloadExcelNotes;
