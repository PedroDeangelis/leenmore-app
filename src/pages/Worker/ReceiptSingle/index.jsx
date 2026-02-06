import React, { useEffect } from "react";
import AppHeader from "../components/AppHeader";
import transl from "../../components/translate";
import AppContent from "../components/AppContent";
import { CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useProject } from "../../../hooks/useProject";
import { useReceipt } from "../../../hooks/useReceipt";
import ReceiptInfo from "./components/ReceiptInfo";
import moment from "moment";

function ReceiptSingle() {
    const { receipt_id } = useParams();

    const { data: receipt, isLoading: isLoadingReceipt } =
        useReceipt(receipt_id);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoadingReceipt && !receipt) {
            console.log("fiaaarst");
            navigate(`/app/my-receipts`);
        }
    }, [isLoadingReceipt, receipt]);

    return (
        <div>
            <AppHeader>
                <h1 className="text-3xl">{transl("Receipt")}</h1>
            </AppHeader>
            <AppContent>
                {!isLoadingReceipt && receipt ? (
                    <>
                        <ReceiptInfo
                            date={moment(receipt.date).format("YYYY-MM-DD")}
                            amount={receipt.amount}
                            usageHistory={receipt.usage_history}
                            whereWereUsed={receipt.where_used}
                            attachments={receipt.attachments}
                            receipt_id={receipt.id}
                            note={receipt.note}
                        />
                    </>
                ) : (
                    <CircularProgress />
                )}
            </AppContent>
        </div>
    );
}

export default ReceiptSingle;
