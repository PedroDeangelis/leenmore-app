import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ExcelJS from "exceljs";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import getDownloadCSV from "./getDownloadCSV";
import transl from "../../../components/translate";
import sanitizeFilename from "../../../components/sanitizeFilename";
import { useMissingShareholdersFromEsignon } from "../../../../hooks/useShareholder";

const MIME_XLSX =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const MAX_SHEET_NAME_LENGTH = 31;
const LARGE_EXPORT_ROW_THRESHOLD = 50000;
const LARGE_EXPORT_CELL_THRESHOLD = 2500000;
const MISSING_SHAREHOLDERS_SHEET_NAME = "\uC8FC\uC8FC\uBA85\uBD80 \uB204\uB77D";
const MISSING_SHAREHOLDERS_HEADERS = [
    "\uC774\uB984",
    "\uC0DD\uB144\uC6D4\uC77C",
    "\uC804\uC790\uC704\uC784\uC2DC\uAC04",
    "\uC804\uC790\uC704\uC784\uC5F0\uB77D\uCC98",
];

const sanitizeWorksheetName = (name, fallback) => {
    const safeName = String(name || fallback || "Sheet")
        .replace(/[\\/:*?]/g, "")
        .replace(/\[/g, "")
        .replace(/\]/g, "")
        .trim();

    return (safeName || fallback || "Sheet").slice(0, MAX_SHEET_NAME_LENGTH);
};

const normalizeWorksheetCell = (value) => {
    if (value === null || value === undefined) {
        return "";
    }

    if (Array.isArray(value)) {
        const tempValue = value
            .map((item) => (typeof item === "string" ? item.trim() : item))
            .filter((item) => {
                if (item === null || item === undefined) {
                    return false;
                }

                if (typeof item === "string") {
                    const lowerValue = item.toLowerCase();
                    return (
                        lowerValue !== "" &&
                        lowerValue !== "null" &&
                        lowerValue !== "undefined"
                    );
                }

                return true;
            });

        if (tempValue.length === 0) {
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

const buildWorksheetColumns = (headers) =>
    headers.map((header, index) => ({
        header,
        key: `column_${index + 1}`,
        width: Math.max(String(header).length + 4, 18),
    }));

const addWorksheet = (
    workbook,
    title,
    headers,
    forEachRow,
    { optimizeForLargeExport = false } = {},
) => {
    const worksheet = workbook.addWorksheet(title);

    if (optimizeForLargeExport) {
        worksheet.addRow(headers.map(normalizeWorksheetCell));
    } else {
        worksheet.columns = buildWorksheetColumns(headers);

        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: "center", vertical: "middle" };
    }

    forEachRow((row) => {
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

const createMissingShareholderIterator =
    (missingShareholders) => (callback) => {
        (missingShareholders || []).forEach((shareholder) => {
            callback(formatMissingShareholderRow(shareholder));
        });
    };

const formatCSVCell = (value) => {
    const normalizedValue = String(normalizeWorksheetCell(value) ?? "");

    if (/[",\r\n]/.test(normalizedValue)) {
        return `"${normalizedValue.replace(/"/g, '""')}"`;
    }

    return normalizedValue;
};

const createCSVContent = (headers, forEachRow) => {
    const lines = [headers.map(formatCSVCell).join(",")];

    forEachRow((row) => {
        lines.push(row.map(formatCSVCell).join(","));
    });

    return `\uFEFF${lines.join("\r\n")}`;
};

const shouldOptimizeWorkbook = (downloadData) =>
    downloadData.rowCount >= LARGE_EXPORT_ROW_THRESHOLD ||
    downloadData.estimatedCellCount >= LARGE_EXPORT_CELL_THRESHOLD;

const saveWorkbookExport = async ({
    project,
    downloadData,
    missingShareholders,
    optimizeForLargeExport,
}) => {
    const workbook = new ExcelJS.Workbook();
    const projectSheetTitle = sanitizeWorksheetName(project?.title, "Project");
    const missingSheetTitle = sanitizeWorksheetName(
        MISSING_SHAREHOLDERS_SHEET_NAME,
        "Missing Shareholders",
    );

    addWorksheet(
        workbook,
        projectSheetTitle,
        downloadData.header,
        downloadData.forEachRow,
        { optimizeForLargeExport },
    );

    if (missingShareholders.length > 0) {
        addWorksheet(
            workbook,
            missingSheetTitle,
            MISSING_SHAREHOLDERS_HEADERS,
            createMissingShareholderIterator(missingShareholders),
            { optimizeForLargeExport },
        );
    }

    const buffer = await workbook.xlsx.writeBuffer(
        optimizeForLargeExport
            ? {
                  useSharedStrings: false,
                  useStyles: false,
              }
            : undefined,
    );
    const filename = sanitizeFilename(project?.title || "project-data");

    saveAs(new Blob([buffer], { type: MIME_XLSX }), `${filename}.xlsx`);
};

const saveZipFallback = async ({
    project,
    downloadData,
    missingShareholders,
}) => {
    const zip = new JSZip();
    const filename = sanitizeFilename(project?.title || "project-data");
    const projectSheetTitle = sanitizeFilename(
        sanitizeWorksheetName(project?.title, "Project"),
    );
    const missingSheetTitle = sanitizeFilename(
        sanitizeWorksheetName(
            MISSING_SHAREHOLDERS_SHEET_NAME,
            "Missing Shareholders",
        ),
    );

    zip.file(
        `${projectSheetTitle || "project"}.csv`,
        createCSVContent(downloadData.header, downloadData.forEachRow),
    );

    if (missingShareholders.length > 0) {
        zip.file(
            `${missingSheetTitle || "missing-shareholders"}.csv`,
            createCSVContent(
                MISSING_SHAREHOLDERS_HEADERS,
                createMissingShareholderIterator(missingShareholders),
            ),
        );
    }

    const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
    });

    saveAs(zipBlob, `${filename}.zip`);
};

function DownloadCSV({ project, projectShareholders }) {
    const [isExporting, setIsExporting] = useState(false);
    const {
        isLoading: isMissingShareholdersLoading,
        mutateAsync: fetchMissingShareholders,
    } = useMissingShareholdersFromEsignon(project);

    const handleDownload = async () => {
        if (!project) {
            return;
        }

        setIsExporting(true);

        try {
            let missingShareholders = [];

            if (project.link_manage_id) {
                try {
                    missingShareholders =
                        await fetchMissingShareholders(project);
                } catch (error) {
                    console.error(
                        "Failed to fetch missing shareholders:",
                        error,
                    );
                }
            }

            const downloadData = getDownloadCSV({
                project,
                projectShareholders,
            });
            const optimizeForLargeExport = shouldOptimizeWorkbook(downloadData);

            try {
                await saveWorkbookExport({
                    project,
                    downloadData,
                    missingShareholders,
                    optimizeForLargeExport,
                });
            } catch (error) {
                console.error("Failed to create xlsx project export:", error);

                await saveZipFallback({
                    project,
                    downloadData,
                    missingShareholders,
                });

                toast.warn(
                    "Excel export was too large for the browser, so the data was downloaded as a ZIP.",
                );
            }
        } catch (error) {
            console.error("Failed to download project data:", error);
            toast.error("Project export failed.");
        } finally {
            setIsExporting(false);
        }
    };

    if (!project) {
        return null;
    }

    if (isMissingShareholdersLoading || isExporting) {
        return <CircularProgress />;
    }

    return (
        <Button
            onClick={handleDownload}
            disabled={isMissingShareholdersLoading}
        >
            <FileDownloadIcon />
            {transl("Download CSV Data")}
        </Button>
    );
}

export default DownloadCSV;
