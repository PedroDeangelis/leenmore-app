import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useReceiptBulkDelete, useReceipts } from "../../../hooks/useReceipt";
import { Button, CircularProgress } from "@mui/material";
import Header from "../components/Header";
import transl from "../../components/translate";
import ReceiptsTable from "./components/ReceiptsTable";
import ReceiptAttachmentPreview from "./components/ReceiptAttachmentPreview";
import ReceiptEditingByAdmin from "./components/ReceiptEditingByAdmin";
import { toast } from "react-toastify";

function ReceiptsByProjectAndUser() {
    const { user_id } = useParams();
    const { data: receipts, isLoading } = useReceipts(user_id);

    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(null);
    const bulkDelete = useReceiptBulkDelete();
    const navigate = useNavigate();

    const handleDeleteReceipt = () => {
        if (
            window.confirm(
                `${transl("do you really want to delete these items?")}}`
            )
        ) {
            bulkDelete.mutate(
                {
                    userIds: [user_id],
                },
                {
                    onSuccess: async (data) => {
                        toast.success(transl("deleted with success"), {
                            position: "top-right",
                            autoClose: 4000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });

                        navigate(`/dashboard/receipt`);
                    },
                }
            );
        }
    };

    return (
        <div>
            <Header title={`${transl("view receipt details")} `}>
                <Link to={`/dashboard/receipt`}>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleDeleteReceipt();
                            }}
                        >
                            {transl("Delete Receipt")}
                        </Button>
                        <Button variant="text">{transl("Go Back")}</Button>
                    </div>
                </Link>
            </Header>
            {!isLoading ? (
                <div className="flex items-stretch gap-10">
                    <ReceiptsTable
                        setAttachmentPreview={setAttachmentPreview}
                        receipts={receipts}
                        setIsEditing={setIsEditing}
                        isEditing={isEditing}
                    />
                    <div className="relative">
                        <div className="sticky top-2">
                            <ReceiptAttachmentPreview
                                isEditing={isEditing}
                                attachmentPreview={attachmentPreview}
                                setAttachmentPreview={setAttachmentPreview}
                            />
                            <ReceiptEditingByAdmin
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                setAttachmentPreview={setAttachmentPreview}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <CircularProgress />
            )}
        </div>
    );
}

export default ReceiptsByProjectAndUser;
