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
import FilterReceiptsBar from "./components/FilterReceiptsBar";
import { isWithinKoreanDayRange } from "../../../utils/koreanDate";
import parseAmount from "../../components/parseAmount";

// Both bounds are inclusive and an empty bound means unbounded.
const isWithinAmountRange = (amount, amountMin, amountMax) => {
    if (amountMin === "" && amountMax === "") {
        return true;
    }

    const value = parseAmount(amount);

    if (amountMin !== "" && value < parseAmount(amountMin)) {
        return false;
    }

    if (amountMax !== "" && value > parseAmount(amountMax)) {
        return false;
    }

    return true;
};

function Receipts() {
    const { data: receipts, isLoading } = useReceiptsAdmin();
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [editingDeadline, setEditingDeadline] = useState(false);
    const [editingUsageHistory, setEditingUsageHistory] = useState(false);
    const [viewTotalAmount, setViewTotalAmount] = useState(false);
    const [bulkDeleteOn, setBulkDeleteOn] = useState(false);
    const [bulkDeleteList, setBulkDeleteList] = useState([]);
    const [search, setSearch] = useState("");
    const [usageFilter, setUsageFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [amountMin, setAmountMin] = useState("");
    const [amountMax, setAmountMax] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [sortDirection, setSortDirection] = useState("asc");

    useEffect(() => {
        // getReceiptsAdmin resolves to { data, error } rather than an array
        // when the query fails, so guard before filtering.
        if (Array.isArray(receipts)) {
            setFilteredReceipts(
                receipts
                    .filter((receipt) =>
                        String(receipt.user_name ?? "")
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                    )
                    .filter(
                        (receipt) =>
                            usageFilter === "all" ||
                            receipt.usage_history === usageFilter,
                    )
                    .filter((receipt) =>
                        isWithinKoreanDayRange(receipt.date, dateFrom, dateTo),
                    )
                    .filter((receipt) =>
                        isWithinAmountRange(
                            receipt.amount,
                            amountMin,
                            amountMax,
                        ),
                    ),
            );
        }
    }, [
        receipts,
        search,
        usageFilter,
        dateFrom,
        dateTo,
        amountMin,
        amountMax,
    ]);

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
                        <ReceiptSearch search={search} setSearch={setSearch} />
                        <FilterReceiptsBar
                            receipts={receipts}
                            usageFilter={usageFilter}
                            setUsageFilter={setUsageFilter}
                            dateFrom={dateFrom}
                            setDateFrom={setDateFrom}
                            dateTo={dateTo}
                            setDateTo={setDateTo}
                            amountMin={amountMin}
                            setAmountMin={setAmountMin}
                            amountMax={amountMax}
                            setAmountMax={setAmountMax}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            sortDirection={sortDirection}
                            setSortDirection={setSortDirection}
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
                            sortBy={sortBy}
                            sortDirection={sortDirection}
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
