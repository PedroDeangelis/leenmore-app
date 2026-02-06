import React from "react";
import DeadlineWarning from "../../../Worker/ReceiptSubmit/components/DeadlineWarning";
import ReceiptSubmitForm from "../../../Worker/ReceiptSubmit/components/ReceiptSubmitForm";
import { Button } from "@mui/material";
import transl from "../../../components/translate";

function ReceiptEditingByAdmin({
    isEditing,
    setIsEditing,
    setAttachmentPreview,
}) {
    const handleCloseViews = () => {
        setIsEditing(null);
        setAttachmentPreview(null);
    };

    return isEditing ? (
        <div className="w-96 flex-shrink-0">
            <div className="flex justify-end mb-5">
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCloseViews(null)}
                >
                    {transl("Cancel")}
                </Button>
            </div>
            <DeadlineWarning />
            <ReceiptSubmitForm
                savedNote={isEditing.note}
                savedAttachments={isEditing.attachments}
                savedAmount={isEditing.amount}
                savedDate={isEditing.date}
                savedUsageHistory={isEditing.usageHistory}
                savedWhereWereUsed={isEditing.whereWereUsed}
                savedReceiptId={isEditing.receipt_id}
                setIsEditing={handleCloseViews}
                isAdmin={true}
            />
        </div>
    ) : null;
}

export default ReceiptEditingByAdmin;
