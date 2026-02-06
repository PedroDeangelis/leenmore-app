import React from "react";
import transl from "../../../components/translate";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Checkbox, IconButton } from "@mui/material";

function FilterSubmissionSorting({
    setSharesTotalSort,
    sharesTotalSort,
    dateSort,
    setDateSort,
    showOnlyTheLastSubmission,
    setShowOnlyTheLastSubmission,
}) {
    const handleCleanDate = (date) => {
        setDateSort(false);
    };

    const handleCleanSharesTotal = () => {
        setSharesTotalSort(false);
    };

    return (
        <div className="border border-300-slate mb-3 rounded-xl grid grid-cols-4  divide-x bg-white overflow-hidden">
            <p className="uppercase tracking-widest text-sm text-slate-600 font-semibold bg-slate-200 w-full h-full flex items-center justify-center ">
                {transl("Sort")}
            </p>
            <div className="p-2 flex justify-between items-center">
                <p>{transl("Total of Shares")}</p>
                <div className="flex items-center">
                    {sharesTotalSort != "asc" && (
                        <IconButton
                            color="primary"
                            onClick={() => {
                                setSharesTotalSort("asc");
                                handleCleanDate();
                            }}
                        >
                            <ArrowUpwardIcon />
                        </IconButton>
                    )}
                    {sharesTotalSort != "desc" && (
                        <IconButton
                            color="primary"
                            onClick={() => {
                                setSharesTotalSort("desc");
                                handleCleanDate();
                            }}
                        >
                            <ArrowDownwardIcon />
                        </IconButton>
                    )}
                </div>
            </div>
            <div className="p-2 flex justify-between items-center">
                <p>{transl("Date")}</p>
                <div className="flex items-center">
                    {dateSort != "asc" && (
                        <IconButton
                            color="primary"
                            onClick={() => {
                                setDateSort("asc");
                                handleCleanSharesTotal();
                            }}
                        >
                            <ArrowUpwardIcon />
                        </IconButton>
                    )}
                    {dateSort != "desc" && (
                        <IconButton
                            color="primary"
                            onClick={() => {
                                setDateSort("desc");
                                handleCleanSharesTotal();
                            }}
                        >
                            <ArrowDownwardIcon />
                        </IconButton>
                    )}
                </div>
            </div>
            <div className="p-2 flex items-start">
                <Checkbox
                    checked={showOnlyTheLastSubmission}
                    onChange={(event) => {
                        setShowOnlyTheLastSubmission(event.target.checked);
                    }}
                />
                <p>{transl("Show only last submission per shareholder")}</p>
            </div>
        </div>
    );
}

export default FilterSubmissionSorting;
