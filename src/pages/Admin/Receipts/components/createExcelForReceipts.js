import sanitizeFilename from "../../../components/sanitizeFilename";

const ExcelJS = require("exceljs");

const createExcelForReceipts = async (receipts) => {
    const workbook = new ExcelJS.Workbook();

    const receiptsByUsername = receipts.reduce((acc, receipt) => {
        const { user_name } = receipt;

        if (acc[user_name]) {
            acc[user_name].push(receipt);
        } else {
            acc[user_name] = [receipt];
        }
        return acc;
    }, {});

    Object.entries(receiptsByUsername).forEach((entry) => {
        const username = entry[0];
        const receipts = entry[1];

        const worksheet = workbook.addWorksheet(username);

        const header = worksheet.getCell("A1");
        header.value = "개인지출내역";
        header.font = { size: 18, bold: true };
        header.alignment = { vertical: "middle", horizontal: "center" };
        worksheet.mergeCells("A1:G1");

        worksheet.getRow(1).height = 42;

        // Head
        worksheet.addRow([
            "연번",
            "날짜",
            "제출 날짜",
            "사용내역",
            "사용처",
            "금액",
            "승인번호",
            "특이사항",
        ]);

        worksheet.getColumn("A").width = 9;
        worksheet.getColumn("B").width = 14;
        worksheet.getColumn("C").width = 14;
        worksheet.getColumn("D").width = 30;
        worksheet.getColumn("E").width = 16;
        worksheet.getColumn("F").width = 17;
        worksheet.getColumn("G").width = 12;
        worksheet.getColumn("H").width = 32;

        // Define the fill style for yellow color
        const yellowFill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE598" },
        };

        const blackBorder = {
            top: { style: "medium", color: { argb: "FF000000" } },
            left: { style: "medium", color: { argb: "FF000000" } },
            bottom: { style: "medium", color: { argb: "FF000000" } },
            right: { style: "medium", color: { argb: "FF000000" } },
        };

        const alignment = {
            vertical: "middle",
            horizontal: "center",
        };

        // Loop through each cell from A2 to G2 and apply the fill style
        for (let col = 1; col <= 7; col++) {
            const cell = worksheet.getRow(2).getCell(col);
            cell.fill = yellowFill;
            cell.border = blackBorder;
            cell.alignment = alignment;
        }
        worksheet.getRow(2).height = 22;

        receipts.forEach((receipt, index) => {
            const { id, date, usage_history, where_used, amount, note } =
                receipt;

            worksheet.getCell(`A${index + 3}`).value = index + 1;

            worksheet.getCell(`B${index + 3}`).value = new Date(date);
            worksheet.getCell(`B${index + 3}`).numFmt = 'MM"월" DD"일"';

            worksheet.getCell(`C${index + 3}`).value = new Date(receipt.created_at);
            worksheet.getCell(`C${index + 3}`).numFmt = 'MM"월" DD"일"';

            worksheet.getCell(`D${index + 3}`).value = usage_history;
            worksheet.getCell(`E${index + 3}`).value = where_used;
            worksheet.getCell(`F${index + 3}`).value = "";

            var cleanAmount = amount.replace(",", "");
            cleanAmount = cleanAmount.replace(".", "");
            cleanAmount = parseInt(cleanAmount);
            worksheet.getCell(`G${index + 3}`).value = cleanAmount;
            worksheet.getCell(`G${index + 3}`).numFmt =
                '"₩"#,##0;[Red]-"₩"#,##0';

            worksheet.getCell(`H${index + 3}`).value = note;
        });

        // Style to body cells
        ["A", "B", "C", "D", "E", "F", "G", "H"].forEach((col) => {
            // from row 2 to receipts.length + 2
            for (let row = 2; row <= receipts.length + 2; row++) {
                const cell = worksheet.getRow(row).getCell(col);
                cell.border = blackBorder;
                cell.alignment = alignment;
            }
        });
    });

    // Download
    await forceDownload(workbook, "영수증_엑셀다운_업데이트");

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
        link.download = sanitizeFilename(`${title}`);
        link.click();

        // Release the Object URL after the download has started.
        URL.revokeObjectURL(url);
    }
};

export default createExcelForReceipts;
