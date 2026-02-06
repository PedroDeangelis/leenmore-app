import sanitizeFilename from "../../../components/sanitizeFilename";
import transl from "../../../components/translate";
import getDaysWorked from "./getDaysWorked";
import { getLastSubmissions } from "./getSubmissionActivityData";

const ExcelJS = require("exceljs");

const downloadExcelActivityData = async (submissions, results, title) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(transl("Activity Data"));
    worksheet.font = { name: "Calibri", size: 12 };

    // Worker data
    const workerData = getSubmissionsByWorker(submissions);
    const daysWorked = getDaysWorked(submissions);
    const totalOfWorkers = Object.keys(workerData).length;

    //
    worksheet.addRow([
        "총 활동가:",
        "",
        "",
        "활동일수",
        "Target",
        "",
        "일 평균",
        "",
        "",
        "",
        "누 계",
        "",
        "",
        "",
        "담당 대비 위임률",
        "",
    ]);
    worksheet.addRow([
        "총 활동일수:",
        daysWorked.length,
        "",
        "",
        "주주 수",
        "주식 수",
        "접촉 횟수",
        "접촉 주식수",
        "위임 주주수",
        "위임 주식수",
        "접촉 횟수",
        "접촉 주식수",
        "위임 주주수",
        "위임 주식수",
        "담당주주수 대비 위임률(%)",
        "담당주식수 대비 위임률(%)",
    ]);
    worksheet.addRow(["활동가 목록"]);

    // Add Workers Data
    var lastCol = "Q";
    Object.keys(workerData).forEach((worker, index) => {
        const row = index + 3;
        worksheet.getCell(`B${row}`).value = worker;
        worksheet.getCell(`D${row}`).value = getTotalOfDaysWorked(
            workerData[worker]
        );
        worksheet.getCell(`E${row}`).value = getTotalOfShareholders(
            workerData[worker]
        );
        worksheet.getCell(`F${row}`).value = getTotalOfShares(
            workerData[worker]
        );

        daysWorked.forEach((date, key) => {
            var dayWorkedData = workerData[worker].filter(
                (submission) => submission.date.split("T")[0] == date
            );

            const colLetter = getColumLetter(lastCol, key * 4);

            if (dayWorkedData.length) {
                const data = getDataOfWorkerDay(dayWorkedData, results);

                worksheet.getCell(`${colLetter}${row}`).value =
                    data.totalReports;

                var endCol = nextCol(colLetter);
                worksheet.getCell(`${endCol}${row}`).value =
                    data.totalSharesContacted;

                endCol = nextCol(endCol);
                worksheet.getCell(`${endCol}${row}`).value =
                    data.proxyShareholders;

                endCol = nextCol(endCol);
                worksheet.getCell(`${endCol}${row}`).value =
                    data.ownedSharesByProxy;
            }
        });
    });

    const rangeEndRow = totalOfWorkers + 2;
    worksheet.getCell("B1").value = {
        formula: `COUNTA(B3:B${rangeEndRow})`,
    };

    // Add Dates Col
    var lastCol = "Q";
    const paint = {
        even: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFF2CC" },
        },
        odd: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD9EAD3" },
        },
    };
    daysWorked.forEach((date, index) => {
        worksheet.getCell(`${lastCol}2`).value = "접촉 횟수";
        worksheet.getCell(`${lastCol}2`).alignment = { horizontal: "center" };
        worksheet.getCell(`${lastCol}2`).fill =
            paint[index % 2 ? "even" : "odd"];
        // paint

        var endCol = nextCol(lastCol);
        worksheet.getCell(`${endCol}2`).value = "접촉 주식수";
        worksheet.getCell(`${endCol}2`).alignment = { horizontal: "center" };
        worksheet.getCell(`${endCol}2`).fill =
            paint[index % 2 ? "even" : "odd"];

        endCol = nextCol(endCol);
        worksheet.getCell(`${endCol}2`).value = "위임 주주수";
        worksheet.getCell(`${endCol}2`).alignment = { horizontal: "center" };
        worksheet.getCell(`${endCol}2`).fill =
            paint[index % 2 ? "even" : "odd"];

        endCol = nextCol(endCol);
        worksheet.getCell(`${endCol}2`).value = "위임 주식수";
        worksheet.getCell(`${endCol}2`).alignment = { horizontal: "center" };
        worksheet.getCell(`${endCol}2`).fill =
            paint[index % 2 ? "even" : "odd"];

        const range = `${lastCol}1:${endCol}1`;
        worksheet.mergeCells(range);
        worksheet.getCell(`${lastCol}1`).value = new Date(date);
        worksheet.getCell(`${lastCol}1`).numFmt = 'MM"월" DD"일"';
        worksheet.getCell(`${lastCol}1`).alignment = { horizontal: "center" };
        worksheet.getCell(`${lastCol}1`).fill =
            paint[index % 2 ? "even" : "odd"];

        applyThickBorder(worksheet, lastCol, totalOfWorkers + 4, endCol);

        lastCol = nextCol(endCol);
    });

    // Add SUMS
    setTotalForDaysWorked(
        worksheet,
        "Q",
        totalOfWorkers,
        daysWorked.length * 4
    );

    // set Totals
    // setTargetTotal(worksheet, "D", totalOfWorkers);
    setTargetTotal(worksheet, "E", totalOfWorkers, true);
    setTargetTotal(worksheet, "F", totalOfWorkers, true);

    // Set Average
    // setTargetAvarage(worksheet, "D", totalOfWorkers);
    setTargetAvarage(worksheet, "E", totalOfWorkers, true);
    setTargetAvarage(worksheet, "F", totalOfWorkers, true);

    // Create Daily Average Cols
    createDailyAverageCols(worksheet, totalOfWorkers, daysWorked.length);
    createSharesAlocatedCols(worksheet, totalOfWorkers, daysWorked.length);
    createDelegationRate(worksheet, totalOfWorkers, daysWorked.length);

    // Merges
    worksheet.mergeCells("D1:D2");
    worksheet.mergeCells("E1:F1");
    worksheet.mergeCells(`A3:A${totalOfWorkers + 2}`);
    worksheet.mergeCells("G1:J1");
    worksheet.mergeCells("K1:N1");
    worksheet.mergeCells("O1:P1");

    // Styles
    const cellCenterStyle = {
        horizontal: "center",
        vertical: "middle",
    };

    const cellsToAlign = getCellsToCenterAlign();

    cellsToAlign.forEach((cellAddress) => {
        worksheet.getCell(cellAddress).alignment = cellCenterStyle;
    });

    worksheet.getColumn("B").alignment = cellCenterStyle;

    // Apply Borders
    applyThickBorder(worksheet, "D", totalOfWorkers + 4);
    applyThickBorder(worksheet, "E", totalOfWorkers + 4, "F");
    applyThickBorder(worksheet, "G", totalOfWorkers + 4, "J");
    applyThickBorder(worksheet, "K", totalOfWorkers + 4, "N");
    applyThickBorder(worksheet, "O", totalOfWorkers + 4, "P");

    // Download
    await forceDownload(workbook, title);
};

export default downloadExcelActivityData;

function getSubmissionsByWorker(submissions) {
    var workers = {};

    submissions.forEach((submission) => {
        const worker = submission.user_name;

        if (!workers[worker]) {
            workers[worker] = [];
        }

        workers[worker].push(submission);
    });

    // sort by key
    var sorted = {};
    Object.keys(workers)
        .sort()
        .forEach(function (key) {
            sorted[key] = workers[key];
        });

    // var first = Object.keys(sorted)[0];
    // first = sorted[first];

    // return {
    //     Cypi: first,
    // };

    return sorted;
}

function getCellsToCenterAlign() {
    return [
        "D1",
        "E1",
        "G1",
        "K1",
        "O1",
        "G2",
        "E2",
        "F2",
        "H2",
        "I2",
        "J2",
        "K2",
        "L2",
        "M2",
        "N2",
        "O2",
        "P2",
        "A3",
    ];
}

async function forceDownload(workbook, title) {
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
}

function nextCol(col) {
    let column = col.split("");
    for (let i = column.length - 1; i >= 0; i--) {
        if (column[i] === "Z") {
            column[i] = "A";
        } else {
            column[i] = String.fromCharCode(column[i].charCodeAt(0) + 1);
            break;
        }
        if (i === 0) {
            column.unshift("A");
        }
    }
    return column.join("");
}

function getTotalOfDaysWorked(sybmissions) {
    // get submission no repeat date
    const submissionsNoRepeatDate = [];
    sybmissions.forEach((submission) => {
        if (!submissionsNoRepeatDate.includes(submission.date)) {
            submissionsNoRepeatDate.push(submission.date);
        }
    });

    return submissionsNoRepeatDate.length;
}

function getDataOfWorkerDay(dayWorkedData, results) {
    const greensResults = results.reduce((acc, itemString, index) => {
        const item = JSON.parse(itemString);

        if (item.color === "green") {
            acc.push({ ...item, pos: index });
        }
        return acc;
    }, []);

    const lastSubmissionPerShareholder = getLastSubmissions(dayWorkedData);

    const data = {
        totalReports: 0,
        totalSharesContacted: 0,
        proxyShareholders: 0,
        ownedSharesByProxy: 0,
    };

    lastSubmissionPerShareholder.forEach((submission) => {
        var shares = submission.shareholder.shares;
        shares = shares.replace(",", "");
        shares = shares.replace(".", "");
        shares = parseInt(shares);

        data.totalReports += 1;
        data.totalSharesContacted += shares;

        // check if its a green result
        if (greensResults.some((item) => item.pos == submission.result)) {
            data.proxyShareholders += 1;
            data.ownedSharesByProxy += shares;
        }
    });

    return data;
}

function getColumLetter(init, end) {
    var lastCol = init;
    if (end > 0) {
        for (let i = 0; i < end; i++) {
            lastCol = nextCol(lastCol);
        }
    }

    return lastCol;
}

function applyThickBorder(worksheet, startCol, numRows, endCol = null) {
    endCol = endCol || startCol;

    // Define the thick and thin border styles
    const thickBorderStyle = { style: "thick" };
    const thinBorderStyle = { style: "thin" };

    let currentCol = startCol;

    // Apply the border to each cell in the specified range
    while (true) {
        for (let row = 1; row <= numRows; row++) {
            let cell = worksheet.getCell(`${currentCol}${row}`);
            let border = {};

            if (row === 1) border.top = thickBorderStyle;
            if (row === numRows) border.bottom = thickBorderStyle;
            if (currentCol === startCol) border.left = thickBorderStyle;
            if (currentCol === endCol) border.right = thickBorderStyle;

            if (row > 1 && row < numRows) {
                border.top = border.bottom = thinBorderStyle;
            }
            if (currentCol !== startCol && currentCol !== endCol) {
                border.left = border.right = thinBorderStyle;
            }

            cell.border = border;
        }

        if (currentCol === endCol) break;
        currentCol = nextCol(currentCol);
    }
}

function setTotalForDaysWorked(worksheet, startCol, numRows, numDays) {
    for (let i = 0; i < numDays; i++) {
        const colLetter = getColumLetter(startCol, i);
        const totalCell = worksheet.getCell(`${colLetter}${numRows + 3}`);
        const averageCell = worksheet.getCell(`${colLetter}${numRows + 4}`);

        totalCell.value = {
            formula: `SUM(${colLetter}3:${colLetter}${numRows + 2})`,
        };

        // check if I is even
        if (i % 2 === 0) {
            averageCell.value = {
                formula: `ROUND(${colLetter}${
                    numRows + 3
                }/COUNTA(${colLetter}3:${colLetter}${numRows + 2}), 1)`,
            };
        } else {
            averageCell.value = {
                formula: `ROUND(${colLetter}${
                    numRows + 3
                }/COUNTA(${colLetter}3:${colLetter}${numRows + 2}), 0)`,
            };
        }

        totalCell.style.border.top = { style: "thick" };

        totalCell.font = {
            color: { argb: "FF0000FF" },
        };

        averageCell.font = {
            color: { argb: "FFFF0000" },
        };
    }
}

function getTotalOfShareholders(submissions) {
    const shareholders = [];

    submissions.forEach((submission) => {
        if (!shareholders.includes(submission.shareholder.id)) {
            shareholders.push(submission.shareholder.id);
        }
    });

    return shareholders.length;
}

function getTotalOfShares(submissions) {
    var total = 0;
    const shareholders = [];

    submissions.forEach((submission) => {
        if (!shareholders.includes(submission.shareholder.id)) {
            shareholders.push(submission.shareholder.id);

            var shares = submission.shareholder.shares;
            shares = shares.replace(",", "");
            shares = shares.replace(".", "");
            shares = parseInt(shares);

            total += shares;
        }
    });

    return total;
}

function setTargetTotal(worksheet, col, numRows, round = false) {
    const fontColorBlue = { argb: "FF0000FF" };

    var cell = worksheet.getCell(`${col}${numRows + 3}`);

    if (round) {
        cell.value = { formula: `ROUND(SUM(${col}3:${col}${numRows + 2}), 0)` };
    } else {
        cell.value = { formula: `ROUND(SUM(${col}3:${col}${numRows + 2}), 1)` };
    }
    cell.font = { color: fontColorBlue };
    cell.style = cell.style || { border: {} };
    // cell.style.border.top = { style: "thick" };
}

function setTargetAvarage(worksheet, col, numRows, round) {
    const fontColorRed = { argb: "FFFF0000" };

    var cell = worksheet.getCell(`${col}${numRows + 4}`);
    if (round) {
        cell.value = {
            formula: `ROUND(${col}${numRows + 3}/${numRows}, 0)`,
        };
    } else {
        cell.value = {
            formula: `ROUND(${col}${numRows + 3}/${numRows}, 1)`,
        };
    }
    cell.font = { color: fontColorRed };
}

function createDailyAverageCols(worksheet, numRows, numDays) {
    var cols = ["G", "H", "I", "J"];

    for (let i = 0; i < numRows; i++) {
        let row = i + 3;

        cols.forEach((element) => {
            let next = getColumLetter(element, 4);
            worksheet.getCell(`${element}${row}`).value = {
                formula: `${next}${row}/D${row}`,
            };
        });
    }

    // setTargetTotal(worksheet, "G", numRows);
    // setTargetTotal(worksheet, "H", numRows);
    // setTargetTotal(worksheet, "I", numRows);
    // setTargetTotal(worksheet, "J", numRows);

    setTargetAvarage(worksheet, "G", numRows);
    // setTargetAvarage(worksheet, "H", numRows);
    setTargetAvarage(worksheet, "I", numRows);
    setTargetAvarage(worksheet, "J", numRows, true);

    setCellBackgroundColor(worksheet, "G1", "FF808080");
    setCellBackgroundColor(worksheet, "G2", "FF808080");
    setCellBackgroundColor(worksheet, "H2", "FF808080");
    setCellBackgroundColor(worksheet, "I2", "FF808080");
    setCellBackgroundColor(worksheet, "J2", "FF808080");

    setCellFontColor(worksheet, "G1", "FFFFFFFF");
    setCellFontColor(worksheet, "G2", "FFFFFFFF");
    setCellFontColor(worksheet, "H2", "FFFFFFFF");
    setCellFontColor(worksheet, "I2", "FFFFFFFF");
    setCellFontColor(worksheet, "J2", "FFFFFFFF");
}

function createSharesAlocatedCols(worksheet, numRows, numDays) {
    for (let i = 0; i < numRows; i++) {
        let row = i + 3;
        let cell = worksheet.getCell(`K${row}`);
        let value = selectAllCellsInRange(worksheet, "Q", 4, row, numDays);

        cell.value = value;
    }
    for (let i = 0; i < numRows; i++) {
        let row = i + 3;
        let cell = worksheet.getCell(`L${row}`);
        let value = selectAllCellsInRange(worksheet, "R", 4, row, numDays);

        cell.value = value;
    }
    for (let i = 0; i < numRows; i++) {
        let row = i + 3;
        let cell = worksheet.getCell(`M${row}`);
        let value = selectAllCellsInRange(worksheet, "S", 4, row, numDays);

        cell.value = value;
    }
    for (let i = 0; i < numRows; i++) {
        let row = i + 3;
        let cell = worksheet.getCell(`N${row}`);
        let value = selectAllCellsInRange(worksheet, "T", 4, row, numDays);

        cell.value = value;
    }

    setTargetTotal(worksheet, "K", numRows, true);
    setTargetTotal(worksheet, "L", numRows, true);
    setTargetTotal(worksheet, "M", numRows, true);
    setTargetTotal(worksheet, "N", numRows, true);

    setTargetAvarage(worksheet, "K", numRows);
    setTargetAvarage(worksheet, "L", numRows, true);
    setTargetAvarage(worksheet, "M", numRows);
    setTargetAvarage(worksheet, "N", numRows, true);

    setCellBackgroundColor(worksheet, "K1", "FFD0CECE");
    setCellBackgroundColor(worksheet, "K2", "FFD0CECE");
    setCellBackgroundColor(worksheet, "L2", "FFD0CECE");
    setCellBackgroundColor(worksheet, "M2", "FFD0CECE");
    setCellBackgroundColor(worksheet, "N2", "FFD0CECE");
}

function createDelegationRate(worksheet, numRows) {
    // D6DCE4
    setCellBackgroundColor(worksheet, "O1", "FFD6DCE4");
    setCellBackgroundColor(worksheet, "O2", "FFD6DCE4");
    setCellBackgroundColor(worksheet, "P2", "FFD6DCE4");

    for (let i = 0; i < numRows; i++) {
        let row = i + 3;
        let cell = worksheet.getCell(`O${row}`);
        cell.value = {
            formula: `(M${row}/E${row})*100`,
        };
        cell = worksheet.getCell(`P${row}`);
        cell.value = {
            formula: `(N${row}/F${row})*100`,
        };
    }

    // setTargetTotal(worksheet, "O", numRows);
    // setTargetTotal(worksheet, "P", numRows);

    setTargetAvarage(worksheet, "O", numRows);
    setTargetAvarage(worksheet, "P", numRows);
}

function selectAllCellsInRange(worksheet, initCell, gap, row, numDays) {
    let cells = [];

    for (let i = 0; i < numDays; i++) {
        const colLetter = getColumLetter(initCell, i * gap);
        cells.push(`${colLetter}${row}`);
    }

    return {
        formula: `SUM(${cells.join(",")})`,
    };
}

function setCellBackgroundColor(worksheet, cellAddress, color) {
    worksheet.getCell(cellAddress).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color },
    };
}

function setCellFontColor(worksheet, cellAddress, color) {
    worksheet.getCell(cellAddress).font = {
        color: { argb: color },
    };
}
