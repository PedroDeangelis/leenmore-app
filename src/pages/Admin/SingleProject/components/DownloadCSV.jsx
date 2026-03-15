import { Button, CircularProgress } from "@mui/material";
import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import getDownloadCSV from "./getDownloadCSV";
import transl from "../../../components/translate";
import sanitizeFilename from "../../../components/sanitizeFilename";
import { useMissingShareholdersFromEsignon } from "../../../../hooks/useShareholder";

const MIME_XLSX =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const MAX_SHEET_NAME_LENGTH = 31;
const MISSING_SHAREHOLDERS_SHEET_NAME = "주주명부 누락";
const MISSING_SHAREHOLDERS_HEADERS = [
    "이름",
    "생년월일",
    "전자위임시간",
    "전자위임연락처",
];

const sanitizeWorksheetName = (name, fallback) => {
    const safeName = String(name || fallback || "Sheet")
        .replace(/[\[\]\:\*\?\/\\]/g, "")
        .trim();

    return (safeName || fallback || "Sheet").slice(0, MAX_SHEET_NAME_LENGTH);
};

const normalizeWorksheetCell = (value) => {
    if (value === null || value === undefined) {
        return "";
    }

    if (Array.isArray(value)) {
        const tempValue = value
            .map((v) => (typeof v === "string" ? v.trim() : v))
            .filter((v) => {
                if (v === null || v === undefined) {
                    return false;
                }

                if (typeof v === "string") {
                    const lowerValue = v.toLowerCase();
                    return (
                        lowerValue !== "" &&
                        lowerValue !== "null" &&
                        lowerValue !== "undefined"
                    );
                }

                return true;
            });

        if (tempValue === null || tempValue.length === 0) {
            return "";
        }

        const isPhoneLike = (input) => {
            if (typeof input !== "string") {
                return false;
            }

            const compactValue = input.replace(/\s+/g, "");
            if (!/^[+()\-\d]+$/.test(compactValue)) {
                return false;
            }

            const digitLength = compactValue.replace(/\D/g, "").length;
            return digitLength >= 7;
        };

        const hasPhoneNumber = tempValue.some(isPhoneLike);

        if (hasPhoneNumber) {
            // remove duplicates while preserving order
            const seen = new Set();
            const uniqueValues = tempValue.filter((item) => {
                if (seen.has(item)) {
                    return false;
                }
                seen.add(item);
                return true;
            });

            return uniqueValues.join(", ");
        }

        return tempValue.join(" / ");
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return value;
};

const addWorksheet = (workbook, title, headers, rows) => {
    const worksheet = workbook.addWorksheet(title);
    worksheet.columns = headers.map((header) => ({
        header,
        key: header,
        width: Math.max(String(header).length + 4, 18),
    }));

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };

    rows.forEach((row) => {
        worksheet.addRow(row.map(normalizeWorksheetCell));
    });

    return worksheet;
};

const formatMissingShareholderRow = (shareholder) => {
    if (Array.isArray(shareholder)) {
        return shareholder.slice(0, MISSING_SHAREHOLDERS_HEADERS.length);
    }

    return [
        shareholder?.name ?? "",
        shareholder?.identifier ?? "",
        shareholder?.contact ?? "",
        shareholder?.completed_date ?? "",
    ];
};

function DownloadCSV({ project, projectShareholders }) {
    const { isLoading, mutateAsync: fetchMissingShareholders } =
        useMissingShareholdersFromEsignon(project);
    const downloadData = project
        ? getDownloadCSV({ project, projectShareholders })
        : null;

    const handleDownload = async () => {
        if (!project || !downloadData) {
            return;
        }

        let missingShareholders = [];
        if (project.link_manage_id) {
            try {
                missingShareholders = await fetchMissingShareholders(project);
            } catch (error) {
                console.error("Failed to fetch missing shareholders:", error);
            }
        }

        const workbook = new ExcelJS.Workbook();

        addWorksheet(
            workbook,
            sanitizeWorksheetName(project.title, "Project"),
            downloadData.header,
            downloadData.body,
        );

        if (missingShareholders && missingShareholders.length > 0) {
            addWorksheet(
                workbook,
                sanitizeWorksheetName(
                    MISSING_SHAREHOLDERS_SHEET_NAME,
                    "Missing Shareholders",
                ),
                MISSING_SHAREHOLDERS_HEADERS,
                (missingShareholders || []).map(formatMissingShareholderRow),
            );
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const filename = sanitizeFilename(project.title || "project-data");

        saveAs(new Blob([buffer], { type: MIME_XLSX }), `${filename}.xlsx`);
    };

    return (
        <>
            {!downloadData || isLoading ? (
                <CircularProgress />
            ) : (
                <Button onClick={handleDownload}>
                    <FileDownloadIcon />
                    {transl("Download CSV Data")}
                </Button>
            )}
        </>
    );
}

export default DownloadCSV;
