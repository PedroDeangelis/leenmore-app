import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { readString } from "react-papaparse";

const MIME_XLSX =
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const SHAREHOLDER_HEADERS = [
    "연번", // A
    "실명번호", // B
    "성별", // C
    "주주명", // D
    "주식수", // E
    "총소유주식수", // F
    "전자투표", // G
    "주소", // H
    "주소서치", // I
    "구연락처", // J
    "연락처", // K
    "활동가" // L
];

const REQUIRED_HEADER_INDEXES = [2, 4, 5, 6]; // 1-based indexes
// const API_HEADER_INDEXES = [7,8,9]; // 1-based indexes

export const downloadShareholderTemplate = async (
	filename = "shareholder-template.xlsx"
) => {
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("Shareholders");

	// sheet.columns = SHAREHOLDER_HEADERS.map(() => ({ width: 18 }));

	const headerRow = sheet.addRow(SHAREHOLDER_HEADERS);
	// headerRow.font = { bold: true };
	headerRow.alignment = { vertical: "middle", horizontal: "center" };

	REQUIRED_HEADER_INDEXES.forEach((colIndex) => {
		const cell = headerRow.getCell(colIndex);
		cell.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "FFFF00" },
		};
	});

    // API_HEADER_INDEXES.forEach((colIndex) => {
    //     const cell = headerRow.getCell(colIndex);
    //     cell.fill = {
    //         type: "pattern",
    //         pattern: "solid",
    //         fgColor: { argb: "DCE6F1" }, 
    //     };
    // });

	const buffer = await workbook.xlsx.writeBuffer();
	saveAs(new Blob([buffer], { type: MIME_XLSX }), filename);
};

export const downloadShareholderData = async (
	rows,
	filename = "shareholder-data.xlsx"
) => {
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("Shareholders");
	sheet.columns = [{ width: 36 }, ...SHAREHOLDER_HEADERS.map(() => ({ width: 18 }))];

	sheet.addRow(["uuid", ...SHAREHOLDER_HEADERS]);
	rows?.forEach((row) => {
		sheet.addRow(row);
	});

	const buffer = await workbook.xlsx.writeBuffer();
	saveAs(new Blob([buffer], { type: MIME_XLSX }), filename);
};

export const parseShareholderFile = async (file) => {
	if (!file) return [];
	const name = file?.name?.toLowerCase() || "";

	if (name.endsWith(".csv") || file.type.includes("csv")) {
		return await new Promise((resolve, reject) => {
			readString(file, {
				worker: true,
				skipEmptyLines: "greedy",
				complete: (results) => resolve(results.data),
				error: (error) => reject(error),
			});
		});
	}

	const buffer = await file.arrayBuffer();
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(buffer);
	const worksheet = workbook.worksheets[0];
	const rows = [];

	worksheet.eachRow({ includeEmpty: false }, (row) => {
		const values = row.values.slice(1).map((cell) => {
			if (cell && typeof cell === "object" && cell.text) {
				return cell.text;
			}
			return cell ?? "";
		});
		rows.push(values);
	});

	return rows;
};
