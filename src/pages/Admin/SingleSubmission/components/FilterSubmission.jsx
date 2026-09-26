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
import { getSubmissionDisplayResult } from "../../../components/resultSentinels";

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

const isEsignonRow = (value) => value?.source === "esignon";

// Guarded because moment(undefined) is "now", which would make a row with no
// date look like the newest one.
const getSubmissionTimestamp = (value) =>
    value ? moment(value) : moment.invalid();

// Whether `candidate` is a later submission than `current`, in the same order
// the `update_shareholder_results` trigger uses to set `shareholder.result`
// (`date DESC, id DESC`). Matching it is what keeps the "latest only" view in
// step with the per-result totals on the project page.
const isLaterSubmission = (candidate, current) => {
    const candidateDate = getSubmissionTimestamp(candidate.date);
    const currentDate = getSubmissionTimestamp(current.date);

    // An unparseable date must never win, or one bad row hides the
    // shareholder's real latest submission.
    if (!candidateDate.isValid()) return false;
    if (!currentDate.isValid()) return true;

    const diff = candidateDate.diff(currentDate);
    if (diff !== 0) return diff > 0;

    // Same timestamp: prefer the real submission over the synthetic e-proxy
    // row, which carries no note, attachment or worker.
    if (isEsignonRow(candidate) !== isEsignonRow(current)) {
        return isEsignonRow(current);
    }

    // E-proxy ids are "<id>_eproxy" and compare as NaN (never later), which
    // is fine: a shareholder has at most one e-proxy row.
    return Number(candidate.id) > Number(current.id);
};

function FilterSubmission({
    submission,
    setFilteredSubmission,
    projectResults,
    showOnlyTheLastSubmission,
    setShowOnlyTheLastSubmission,
}) {
    const [searchField, setSearchField] = useState("");
    // `null` = every option selected (the default); an array is an explicit
    // pick, which may be empty. See FilterSubmissionFiltering.
    const [workerSelect, setWorkerSelect] = useState(null);
    const [dateSelect, setDateSelect] = useState(null);
    const [resultSelect, setResultSelect] = useState(null);
    const [sharesTotalSort, setSharesTotalSort] = useState(false);
    const [dateSort, setDateSort] = useState("desc");

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

        if (showOnlyTheLastSubmission) {
            // Keep each shareholder's actual latest row. This runs BEFORE the
            // other filters on purpose: running it after the result filter
            // picked the latest row *with that result*, so a shareholder who
            // was 유보 once and later moved to 거부 still showed (and was
            // totalled) under 유보.
            //
            // This used to additionally require
            // `value.result === value.shareholder.result`, relying on
            // `shareholder.result` being a denormalized copy of the latest
            // submission's result. That dropped every e-proxy row: those carry
            // the synthetic `EPROXY_LINK_RESULT` sentinel while
            // `shareholder.result` holds a physical index (or null), so the two
            // could never be equal and the list came back empty.
            const latestByShareholder = new Map();

            submissionCopy.forEach((value) => {
                const shareholderId = value?.shareholder?.id;
                if (shareholderId == null) return;

                const current = latestByShareholder.get(shareholderId);
                if (!current || isLaterSubmission(value, current)) {
                    latestByShareholder.set(shareholderId, value);
                }
            });

            const kept = new Set(
                [...latestByShareholder.values()].map((value) => value.id),
            );

            submissionCopy = submissionCopy.filter((value) =>
                kept.has(value.id),
            );
        }

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
                    workerSelect == null ||
                    workerNames.some((worker) => workerSelect.includes(worker))
                );
            })
            .filter((value) => {
                return (
                    dateSelect == null ||
                    dateSelect.includes(normalizeSubmissionDate(value.date))
                );
            })
            .filter((value) => {
                // Filter on the result the row is shown with, so a filtered
                // list never holds a row with a different result chip.
                return (
                    resultSelect == null ||
                    resultSelect.includes(
                        getSubmissionDisplayResult(
                            value,
                            showOnlyTheLastSubmission,
                        ),
                    )
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
                showOnlyTheLastSubmission={showOnlyTheLastSubmission}
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
