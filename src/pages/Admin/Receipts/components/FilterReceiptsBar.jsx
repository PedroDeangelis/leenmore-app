import {
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";

// Sorting reorders the per-user cards, not the individual receipts, so the
// options are the aggregates each card displays.
const SORT_OPTIONS = [
    { value: "default", label: "Default Order" },
    { value: "user_name", label: "User Name" },
    { value: "total_amount", label: "Total Amount" },
    { value: "total_submissions", label: "Number of submissions" },
];

function FilterReceiptsBar({
    receipts,
    usageFilter,
    setUsageFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    amountMin,
    setAmountMin,
    amountMax,
    setAmountMax,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
}) {
    const [usageOptions, setUsageOptions] = useState([]);

    // Derived from the receipts rather than the admin-editable
    // usage_history_schema option, so receipts keeping a retired category
    // are still reachable.
    useEffect(() => {
        if (Array.isArray(receipts)) {
            setUsageOptions(
                [
                    ...new Set(
                        receipts
                            .map((receipt) => receipt.usage_history)
                            .filter(Boolean),
                    ),
                ].sort(),
            );
        }
    }, [receipts]);

    return (
        <div className="max-w-2xl mx-auto mb-8 p-3 border border-slate-300 rounded-xl bg-white grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormControl fullWidth size="small">
                <InputLabel id="simple-select-receipt-usage">
                    {transl("Usage history")}
                </InputLabel>
                <Select
                    labelId="simple-select-receipt-usage"
                    id="simple-select-receipt-usage"
                    value={usageFilter}
                    label={transl("Usage history")}
                    onChange={(event) => setUsageFilter(event.target.value)}
                >
                    <MenuItem value="all">{transl("Show All")}</MenuItem>
                    {usageOptions.map((item) => (
                        <MenuItem key={item} value={item}>
                            {transl(item)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div className="flex items-center gap-1">
                <FormControl fullWidth size="small">
                    <InputLabel id="simple-select-receipt-sort">
                        {transl("Sort By")}
                    </InputLabel>
                    <Select
                        labelId="simple-select-receipt-sort"
                        id="simple-select-receipt-sort"
                        value={sortBy}
                        label={transl("Sort By")}
                        onChange={(event) => setSortBy(event.target.value)}
                    >
                        {SORT_OPTIONS.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                                {transl(item.label)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <IconButton
                    color="primary"
                    aria-label={transl("Sort direction")}
                    disabled={sortBy === "default"}
                    onClick={() =>
                        setSortDirection(
                            sortDirection === "asc" ? "desc" : "asc",
                        )
                    }
                >
                    {sortDirection === "asc" ? (
                        <ArrowUpwardIcon />
                    ) : (
                        <ArrowDownwardIcon />
                    )}
                </IconButton>
            </div>

            {/* Empty until the admin picks a day, so the label has to stay
                notched or it overlaps the browser's date placeholder. */}
            <FormControl variant="outlined" fullWidth size="small">
                <InputLabel shrink htmlFor="receipt-date-from">
                    {transl("Date From")}
                </InputLabel>
                <OutlinedInput
                    id="receipt-date-from"
                    type="date"
                    notched
                    label={transl("Date From")}
                    value={dateFrom}
                    onChange={(event) => setDateFrom(event.target.value)}
                />
            </FormControl>

            <FormControl variant="outlined" fullWidth size="small">
                <InputLabel shrink htmlFor="receipt-date-to">
                    {transl("Date To")}
                </InputLabel>
                <OutlinedInput
                    id="receipt-date-to"
                    type="date"
                    notched
                    label={transl("Date To")}
                    value={dateTo}
                    onChange={(event) => setDateTo(event.target.value)}
                />
            </FormControl>

            <FormControl variant="outlined" fullWidth size="small">
                <InputLabel htmlFor="receipt-amount-min">
                    {transl("Min Amount")}
                </InputLabel>
                <OutlinedInput
                    id="receipt-amount-min"
                    type="number"
                    inputProps={{ min: 0 }}
                    label={transl("Min Amount")}
                    value={amountMin}
                    onChange={(event) => setAmountMin(event.target.value)}
                />
            </FormControl>

            <FormControl variant="outlined" fullWidth size="small">
                <InputLabel htmlFor="receipt-amount-max">
                    {transl("Max Amount")}
                </InputLabel>
                <OutlinedInput
                    id="receipt-amount-max"
                    type="number"
                    inputProps={{ min: 0 }}
                    label={transl("Max Amount")}
                    value={amountMax}
                    onChange={(event) => setAmountMax(event.target.value)}
                />
            </FormControl>
        </div>
    );
}

export default FilterReceiptsBar;
