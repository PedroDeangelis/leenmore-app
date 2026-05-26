import {
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import transl from "../../../components/translate";
import SearchIcon from "@mui/icons-material/Search";
import FilterSubmissionFiltering from "./FilterSubmissionFiltering";
import FilterSubmissionSorting from "./FilterSubmissionSorting";
import moment from "moment";

const getSubmissionDateOnly = (value) => {
    const normalizedDate = String(value ?? "")
        .split("T")[0]
        .trim();

    if (!normalizedDate) {
        return moment.invalid();
    }

    const strictDate = moment(normalizedDate, "YYYY-MM-DD", true);

    return strictDate.isValid() ? strictDate : moment(value).startOf("day");
};

const normalizeSubmissionDate = (value) =>
    String(value ?? "")
        .split("T")[0]
        .trim();

function FilterSubmission({
    submission,
    setFilteredSubmission,
    projectResults,
}) {
    const [searchField, setSearchField] = useState("");
    const [workerSelect, setWorkerSelect] = useState([]);
    const [dateSelect, setDateSelect] = useState([]);
    const [resultSelect, setResultSelect] = useState([]);
    const [sharesTotalSort, setSharesTotalSort] = useState(false);
    const [dateSort, setDateSort] = useState("desc");
    const [showOnlyTheLastSubmission, setShowOnlyTheLastSubmission] =
        useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const result = urlParams.get("result");

    useEffect(() => {
        if (result) {
            setResultSelect([result]);
        }
    }, [result]);

    const handleSearchChange = (event) => {
        setSearchField(event.target.value);
    };

    const updateFilterSubmission = useCallback(() => {
        var submissionCopy = Array.isArray(submission) ? [...submission] : [];

        submissionCopy = submissionCopy
            .filter(
                (value) =>
                    value.shareholder.name
                        .toLowerCase()
                        .includes(searchField.toLowerCase()) ||
                    value.shareholder.registration
                        .toLowerCase()
                        .includes(searchField.toLowerCase()),
            )
            .filter((value) => {
                const workerNames =
                    Array.isArray(value.worker_names) &&
                    value.worker_names.length
                        ? value.worker_names
                        : value.user_name
                          ? [value.user_name]
                          : [];

                return (
                    !workerSelect?.length ||
                    workerNames.some((worker) => workerSelect.includes(worker))
                );
            })
            .filter((value) => {
                return (
                    !dateSelect?.length ||
                    dateSelect.includes(normalizeSubmissionDate(value.date))
                );
            })
            .filter((value) => {
                return (
                    !resultSelect?.length || resultSelect.includes(value.result)
                );
            });

        if (sharesTotalSort) {
            submissionCopy = submissionCopy.sort((a, b) => {
                if (sharesTotalSort === "asc") {
                    return (
                        parseInt(
                            b.shareholder.shares_total
                                .replaceAll(",", "")
                                .replaceAll(".", ""),
                        ) -
                        parseInt(
                            a.shareholder.shares_total
                                .replaceAll(",", "")
                                .replaceAll(".", ""),
                        )
                    );
                } else {
                    return (
                        parseInt(
                            a.shareholder.shares_total
                                .replaceAll(",", "")
                                .replaceAll(".", ""),
                        ) -
                        parseInt(
                            b.shareholder.shares_total
                                .replaceAll(",", "")
                                .replaceAll(".", ""),
                        )
                    );
                }
            });
        }

        if (dateSort) {
            submissionCopy.sort((a, b) => {
                var dateA = getSubmissionDateOnly(a.date);
                var dateB = getSubmissionDateOnly(b.date);

                if (dateSort === "asc") {
                    return dateA.diff(dateB); // For ascending order
                } else {
                    return dateB.diff(dateA); // For descending order
                }
            });
        }

        if (showOnlyTheLastSubmission) {
            var shareholders = [];
            submissionCopy = submissionCopy.filter((value) => {
                if (
                    shareholders.includes(value.shareholder.id) ||
                    value.result !== value.shareholder.result
                ) {
                    return false;
                }

                shareholders.push(value.shareholder.id);
                return true;
            });
        }

        setFilteredSubmission([...submissionCopy]);
    }, [
        dateSelect,
        dateSort,
        resultSelect,
        searchField,
        setFilteredSubmission,
        sharesTotalSort,
        showOnlyTheLastSubmission,
        submission,
        workerSelect,
    ]);

    useEffect(() => {
        updateFilterSubmission();
    }, [updateFilterSubmission]);

    return (
        <div className="max-w-5xl mx-auto">
            <FilterSubmissionFiltering
                submission={submission}
                workerSelect={workerSelect}
                setWorkerSelect={setWorkerSelect}
                dateSelect={dateSelect}
                setDateSelect={setDateSelect}
                resultSelect={resultSelect}
                setResultSelect={setResultSelect}
                projectResults={projectResults}
            />
            <FilterSubmissionSorting
                sharesTotalSort={sharesTotalSort}
                setSharesTotalSort={setSharesTotalSort}
                dateSort={dateSort}
                setDateSort={setDateSort}
                showOnlyTheLastSubmission={showOnlyTheLastSubmission}
                setShowOnlyTheLastSubmission={setShowOnlyTheLastSubmission}
            />
            <Paper className="p-2 mb-6" elevation={0}>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-adornment-seacrh">
                        {transl("Search for shareholders")}...
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-seacrh"
                        endAdornment={
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        aria-describedby="outlined-seacrh-helper-text"
                        label={`${transl("Search for shareholders")}...`}
                        value={searchField}
                        onChange={handleSearchChange}
                    />
                </FormControl>
            </Paper>
        </div>
    );
}

export default FilterSubmission;
