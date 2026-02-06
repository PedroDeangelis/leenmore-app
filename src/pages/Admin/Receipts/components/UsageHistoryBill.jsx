import React from "react";
import formatNumber from "../../../components/formatNumber";
import { Button } from "@mui/material";
import transl from "../../../components/translate";
import DownloadIcon from "@mui/icons-material/Download";
import JSZip from "jszip";

function UsageHistoryBill({
    receipts,
    usageHistory,
    totalAmount,
    numberOfWOrkers,
}) {
    const handleZipAttachmentsDownload = async () => {
        let attachments = [];

        receipts.forEach((receipt) => {
            if (receipt.attachments?.length > 0) {
                attachments.push(receipt.attachments);
            }
        });

        const zip = new JSZip();

        // Helper function to ensure folders are uniquely created
        const getFolder = (path) => {
            const folders = path.split("/").slice(0, -1); // Remove the filename

            folders.shift();
            folders.shift();

            let currentFolder = zip;
            folders.forEach((folderName) => {
                // Only create a new folder if it doesn't already exist
                currentFolder =
                    currentFolder.folder(folderName) || currentFolder;
            });
            return currentFolder;
        };

        try {
            const filePromises = attachments.flatMap((attachment) =>
                attachment.map(async (file) => {
                    const filename = file.split("/").pop();
                    const folderPath = file.split("/").slice(0, -1).join("/");
                    const folder = getFolder(folderPath);
                    const path = `${process.env.REACT_APP_STORAGE_PATH}${file}`;

                    const response = await fetch(path);
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    }
                    const blob = await response.blob();
                    folder.file(filename, blob);
                })
            );

            await Promise.all(filePromises);

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "receipts.zip");
        } catch (error) {
            console.error("Error downloading files:", error);
        }
    };

    const saveAs = (blob, filename) => {
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            const a = document.createElement("a");
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 0);
        }
    };

    return (
        <>
            <div className="text-slate-700 text-right">
                {usageHistory.map((bill) => (
                    <p
                        key={bill.usage_history}
                        className="flex gap-1 justify-end"
                    >
                        <span>{bill.usage_history}:</span>
                        <span className="w-48 pr-12 block">
                            총 {formatNumber(bill.amount)} 원
                        </span>
                    </p>
                ))}
                <hr className="my-4 border-slate-400 border-dashed" />
                <p className="  flex  gap-1 justify-end">
                    <span>합 계 :</span>
                    <span className="w-48 ">
                        <span>총 {formatNumber(totalAmount)} 원</span>
                        <strong className="w-12 inline-block text-slate-400">
                            (
                            {numberOfWOrkers ? (
                                <span>{numberOfWOrkers}명</span>
                            ) : (
                                <span>{receipts.length}개</span>
                            )}
                            )
                        </strong>
                    </span>
                </p>
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    handleZipAttachmentsDownload();
                }}
            >
                <DownloadIcon sx={{ mr: 1 }} />
                <span>{transl("Download attachments")}</span>
            </Button>
        </>
    );
}

export default UsageHistoryBill;
