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
import React from "react";
import transl from "../../../components/translate";

// Only publish and draft are ever fetched by useAllProjectsSimpleList,
// so those are the only statuses this filter can offer.
const STATUS_OPTIONS = ["publish", "draft"];

const SORT_OPTIONS = [
    { value: "created_at", label: "Created At" },
    { value: "title", label: "Title" },
    { value: "end_date", label: "End Date" },
];

function FilterActivityDataBar({
    statusFilter,
    setStatusFilter,
    createdFrom,
    setCreatedFrom,
    createdTo,
    setCreatedTo,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
}) {
    return (
        <div className="max-w-2xl mx-auto mb-8 p-3 border border-slate-300 rounded-xl bg-white grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormControl fullWidth size="small">
                <InputLabel id="simple-select-activity-status">
                    {transl("Status")}
                </InputLabel>
                <Select
                    labelId="simple-select-activity-status"
                    id="simple-select-activity-status"
                    value={statusFilter}
                    label={transl("Status")}
                    onChange={(event) => setStatusFilter(event.target.value)}
                >
                    <MenuItem value="all">{transl("Show All")}</MenuItem>
                    {STATUS_OPTIONS.map((item) => (
                        <MenuItem key={item} value={item}>
                            {transl(item)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div className="flex items-center gap-1">
                <FormControl fullWidth size="small">
                    <InputLabel id="simple-select-activity-sort">
                        {transl("Sort By")}
                    </InputLabel>
                    <Select
                        labelId="simple-select-activity-sort"
                        id="simple-select-activity-sort"
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
                <InputLabel shrink htmlFor="activity-created-from">
                    {transl("Created From")}
                </InputLabel>
                <OutlinedInput
                    id="activity-created-from"
                    type="date"
                    notched
                    label={transl("Created From")}
                    value={createdFrom}
                    onChange={(event) => setCreatedFrom(event.target.value)}
                />
            </FormControl>

            <FormControl variant="outlined" fullWidth size="small">
                <InputLabel shrink htmlFor="activity-created-to">
                    {transl("Created To")}
                </InputLabel>
                <OutlinedInput
                    id="activity-created-to"
                    type="date"
                    notched
                    label={transl("Created To")}
                    value={createdTo}
                    onChange={(event) => setCreatedTo(event.target.value)}
                />
            </FormControl>
        </div>
    );
}

export default FilterActivityDataBar;
