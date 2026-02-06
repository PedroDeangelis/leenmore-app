import {
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";
import SearchIcon from "@mui/icons-material/Search";
import FilterSubmissionFiltering from "./FilterSubmissionFiltering";
import FilterSubmissionSorting from "./FilterSubmissionSorting";
import moment from "moment";

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
    }, []);

    const handleSearchChange = (event) => {
        setSearchField(event.target.value);
    };

    const updateFilterSubmission = () => {
        var submissionCopy = [...submission];

        submissionCopy = submissionCopy
            .filter(
                (value) =>
                    value.shareholder.name
                        .toLowerCase()
                        .includes(searchField.toLowerCase()) ||
                    value.shareholder.registration
                        .toLowerCase()
                        .includes(searchField.toLowerCase())
            )
            .filter(
                (value) =>
                    !workerSelect?.length ||
                    workerSelect.includes(value.user_name)
            )
            .filter((value) => {
                return (
                    !dateSelect?.length ||
                    dateSelect.includes(value.date.split("T")[0])
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
                                .replaceAll(".", "")
                        ) -
                        parseInt(
                            a.shareholder.shares_total
                                .replaceAll(",", "")
                                .replaceAll(".", "")
                        )
                    );
                } else {
                    return (
                        parseInt(
                            a.shareholder.shares_total
                                .replaceAll(",", "")
                                .replaceAll(".", "")
                        ) -
                        parseInt(
                            b.shareholder.shares_total
                                .replaceAll(",", "")
                                .replaceAll(".", "")
                        )
                    );
                }
            });
        }

        if (dateSort) {
            submissionCopy.sort((a, b) => {
                var dateA = moment(a.date);
                var created_at_A = moment(a.created_at);
                dateA
                    .add(created_at_A.get("hour"), "hours")
                    .add(created_at_A.get("minute"), "minutes");

                var dateB = moment(b.date);
                var created_at_B = moment(b.created_at);
                dateB
                    .add(created_at_B.get("hour"), "hours")
                    .add(created_at_B.get("minute"), "minutes");

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
                    value.result != value.shareholder.result
                ) {
                    return false;
                }

                shareholders.push(value.shareholder.id);
                return true;
            });
        }

        setFilteredSubmission([...submissionCopy]);
    };

    useEffect(() => {
        updateFilterSubmission();
    }, [
        searchField,
        workerSelect,
        dateSelect,
        resultSelect,
        sharesTotalSort,
        dateSort,
        showOnlyTheLastSubmission,
    ]);

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
