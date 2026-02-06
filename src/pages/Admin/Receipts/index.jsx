import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import transl from "../../components/translate";
import { useReceiptsAdmin } from "../../../hooks/useReceipt";
import { Button, CircularProgress } from "@mui/material";
import ReceiptFLoop from "./components/ReceiptFLoop";
import ReceiptSearch from "./components/ReceiptSearch";
import CampaignIcon from "@mui/icons-material/Campaign";
import SubmissionDeadlineSetup from "./components/SubmissionDeadlineSetup";
import UsageHistorySetup from "./components/UsageHistorySetup";
import ViewTotalAmountReceipts from "./components/ViewTotalAmountReceipts";
import ButtonLockReceiptSubmission from "./components/ButtonLockReceiptSubmission";
import ReceiptBulkDelete from "./components/ReceiptBulkDelete";
import DownloadIcon from "@mui/icons-material/Download";
import createExcelForReceipts from "./components/createExcelForReceipts";

function Receipts() {
    const { data: receipts, isLoading } = useReceiptsAdmin();
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [editingDeadline, setEditingDeadline] = useState(false);
    const [editingUsageHistory, setEditingUsageHistory] = useState(false);
    const [viewTotalAmount, setViewTotalAmount] = useState(false);
    const [bulkDeleteOn, setBulkDeleteOn] = useState(false);
    const [bulkDeleteList, setBulkDeleteList] = useState([]);

    useEffect(() => {
        if (receipts) {
            setFilteredReceipts(receipts);
        }
    }, [receipts]);

    const downloadExcelFile = () => {
        const excelFile = createExcelForReceipts(receipts);
    };

    return (
        <div>
            <Header title={transl("receipt details")}>
                <div className="flex items-center gap-3">
                    <ButtonLockReceiptSubmission />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => downloadExcelFile()}
                    >
                        <DownloadIcon sx={{ mr: 1 }} />
                        {transl("download excel file")}
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setViewTotalAmount(!viewTotalAmount)}
                    >
                        {transl("view total amount")}
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setEditingDeadline(!editingDeadline)}
                    >
                        <CampaignIcon sx={{ mr: 1 }} />
                        {transl("notice funtion")}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                            setEditingUsageHistory(!editingUsageHistory)
                        }
                    >
                        {transl("Edit usage history details")}
                    </Button>
                </div>
            </Header>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <div className="flex items-start">
                    <div className="w-full">
                        <ReceiptSearch
                            receipts={receipts}
                            setFilteredReceipts={setFilteredReceipts}
                        />
                        <ReceiptBulkDelete
                            bulkDeleteOn={bulkDeleteOn}
                            setBulkDeleteOn={setBulkDeleteOn}
                            bulkDeleteList={bulkDeleteList}
                            setBulkDeleteList={setBulkDeleteList}
                        />
                        <ReceiptFLoop
                            receipts={filteredReceipts}
                            bulkDeleteOn={bulkDeleteOn}
                            bulkDeleteList={bulkDeleteList}
                            setBulkDeleteList={setBulkDeleteList}
                        />
                    </div>
                    {editingDeadline ||
                    editingUsageHistory ||
                    viewTotalAmount ? (
                        <div className="w-96 ml-10 flex-shrink-0">
                            {editingDeadline && (
                                <SubmissionDeadlineSetup
                                    close={() => {
                                        setEditingDeadline(false);
                                    }}
                                />
                            )}
                            {editingUsageHistory && (
                                <UsageHistorySetup
                                    close={() => {
                                        setEditingUsageHistory();
                                    }}
                                />
                            )}
                            {viewTotalAmount && (
                                <ViewTotalAmountReceipts
                                    receipts={receipts}
                                    close={() => {
                                        setViewTotalAmount(false);
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            )}
        </div>
    );
}

export default Receipts;
