import { Button, TableCell, TableRow } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import transl from "../../../components/translate";
import { useReceiptDeactivate } from "../../../../hooks/useReceipt";
import { toast } from "react-toastify";

function ReceiptsTableRow({
    index,
    date,
    usage_history,
    where_used,
    amount,
    setAttachmentPreview,
    attachments,
    id,
    note,
    setIsEditing,
    isEditing,
    createdAt,
}) {
    const deactivateReceipt = useReceiptDeactivate();

    const handleImageDownload = async (image) => {
        try {
            // Fetch the image as a Blob
            const response = await fetch(
                `${process.env.REACT_APP_STORAGE_PATH}${image}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();

            // Create a local object URL
            const url = window.URL.createObjectURL(blob);

            // Create a new link element
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;

            // Set the download attribute to the filename
            link.download = image.split("/").pop();

            // Append the link to the body
            document.body.appendChild(link);

            // Programmatically click the link
            link.click();

            // Revoke the object URL and remove the link
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }, 100);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    const handleDeactivation = (receipt_id) => {
        // create aa alert to confirm deactivation
        if (window.confirm("Are you sure you want to delete this receipt?")) {
            deactivateReceipt.mutate(
                { receipt_id },
                {
                    onSuccess: () => {
                        toast.success(transl("deleted with success"), {
                            position: "top-right",
                            autoClose: 4000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    },
                }
            );
        }
    };

    return (
        <TableRow className={isEditing?.receipt_id == id ? "bg-red-50" : ""}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{moment(date).format("YYYY-MM-DD")}</TableCell>
            <TableCell>{moment(createdAt).format("YYYY-MM-DD")}</TableCell>
            <TableCell>{usage_history}</TableCell>
            <TableCell>{where_used}</TableCell>
            <TableCell>₩ {amount}</TableCell>
            <TableCell>{note}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2 justify-center">
                    <Button
                        variant="text"
                        size={"small"}
                        onClick={() => {
                            setAttachmentPreview(attachments[0]);
                        }}
                    >
                        {transl("preview")}
                    </Button>
                    <Button
                        variant="outlined"
                        size={"small"}
                        onClick={() => {
                            // download this image
                            handleImageDownload(attachments[0]);
                        }}
                    >
                        {transl("download")}
                    </Button>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2 justify-center">
                    {isEditing?.receipt_id == id ? (
                        <p>{transl("editing")}</p>
                    ) : (
                        <>
                            <Button
                                variant="text"
                                size={"small"}
                                onClick={() => {
                                    setIsEditing({
                                        date,
                                        usageHistory: usage_history,
                                        whereWereUsed: where_used,
                                        amount,
                                        note,
                                        attachments,
                                        receipt_id: id,
                                    });
                                }}
                            >
                                {transl("edit")}
                            </Button>
                            <Button
                                variant="contained"
                                size={"small"}
                                onClick={() => {
                                    handleDeactivation(id);
                                }}
                            >
                                {transl("Delete")}
                            </Button>
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

export default ReceiptsTableRow;
