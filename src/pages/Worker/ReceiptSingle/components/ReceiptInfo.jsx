import React, { useState } from "react";
import transl from "../../../components/translate";
import { Button, CircularProgress } from "@mui/material";
import { useReceiptDeactivate } from "../../../../hooks/useReceipt";
import { useNavigate } from "react-router-dom";
import ReceiptSingleEditing from "./ReceiptSingleEditing";
import { useOption } from "../../../../hooks/useOptions";

function ReceiptInfo({
    date,
    amount,
    usageHistory,
    whereWereUsed,
    attachments,
    receipt_id,
    note,
}) {
    const deactivateReceipt = useReceiptDeactivate();
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    const {
        data: receiptSubmissionStatus,
        isLoading: isLoadingReceiptSubmissionStatus,
    } = useOption("receipt_submission_status", "value");

    const handleDeactivation = () => {
        // create aa alert to confirm deactivation
        if (window.confirm("Are you sure you want to delete this receipt?")) {
            deactivateReceipt.mutate(
                { receipt_id },
                {
                    onSuccess: () => {
                        navigate(`/app/my-receipts/`);
                    },
                }
            );
        }
    };

    return (
        <div>
            {isEditing ? (
                <ReceiptSingleEditing
                    date={date}
                    amount={amount}
                    usageHistory={usageHistory}
                    whereWereUsed={whereWereUsed}
                    attachments={attachments}
                    receipt_id={receipt_id}
                    note={note}
                    setIsEditing={setIsEditing}
                    isAdmin={false}
                />
            ) : (
                <>
                    <div className="flex items-center justify-end">
                        {isLoadingReceiptSubmissionStatus ? (
                            <CircularProgress />
                        ) : (
                            receiptSubmissionStatus && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            setIsEditing(true);
                                        }}
                                    >
                                        {transl("edit")}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleDeactivation}
                                    >
                                        {transl("Delete")}
                                    </Button>
                                </div>
                            )
                        )}
                    </div>
                    <div className="flex items-center justify-between  mt-8">
                        <p>
                            <span className="text-xs block text-slate-500">
                                {transl("date")}
                            </span>
                            {date}
                        </p>
                        <p className="text-center">
                            <span className="text-xs block text-slate-500">
                                {transl("amount")}
                            </span>
                            ₩ {amount}
                        </p>
                        <p className="text-right">
                            <span className="text-xs block text-slate-500">
                                {transl("usage history")}
                            </span>
                            {usageHistory}
                        </p>
                    </div>

                    <p className="mt-8">
                        <span className="text-xs block text-slate-500">
                            {transl("where were used")}
                        </span>
                        {whereWereUsed}
                    </p>

                    {note && (
                        <p className="mt-8">
                            <span className="text-xs block text-slate-500">
                                {transl("note")}
                            </span>
                            {note}
                        </p>
                    )}
                    <div className="mt-8">
                        <span className="text-xs block text-slate-500">
                            {transl("receipt")}
                        </span>
                        {attachments?.length > 0 ? (
                            attachments.map((attachment) => (
                                <img
                                    src={`${process.env.REACT_APP_STORAGE_PATH}${attachment}`}
                                    alt=""
                                    className="mt-2"
                                    key={attachment}
                                />
                            ))
                        ) : (
                            <p className="text-slate-500">
                                {transl("No attachments")}
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default ReceiptInfo;
