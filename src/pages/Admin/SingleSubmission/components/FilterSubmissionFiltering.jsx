import {
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";
import {
    EPROXY_LINK_RESULT,
    getEproxyLinkLabel,
    getSubmissionDisplayResult,
} from "../../../components/resultSentinels";

const normalizeSubmissionDate = (value) =>
    String(value ?? "")
        .split("T")[0]
        .trim();

// Selections are `null` for "everything" (the default) and an array for an
// explicit pick. Keeping "everything" as its own state, rather than an array
// of every option, means rows with no worker or date still show by default
// and options that appear after a refetch are included automatically.
const isAllSelected = (selected) => selected == null;

const isOptionChecked = (selected, option) =>
    isAllSelected(selected) || selected.includes(option);

// "Show All" toggles between everything and nothing; ticking the last missing
// option by hand folds back into "everything".
const getNextSelection = (value, selected, options) => {
    if (value.includes("all")) {
        return isAllSelected(selected) ? [] : null;
    }

    const hasEveryOption =
        options.length > 0 && options.every((option) => value.includes(option));

    return hasEveryOption ? null : value;
};

function FilterSubmissionFiltering({
    submission,
    workerSelect,
    setWorkerSelect,
    dateSelect,
    setDateSelect,
    resultSelect,
    setResultSelect,
    projectResults,
    showOnlyTheLastSubmission,
}) {
    const [workers, setWorkers] = useState([]);
    const [dates, setDates] = useState([]);
    const [results, setResults] = useState([]);

    const resultKeys = results.map((item) => item.key);

    const handleWorkerChange = (event) => {
        setWorkerSelect(
            getNextSelection(event.target.value, workerSelect, workers),
        );
    };

    const handleDateChange = (event) => {
        setDateSelect(getNextSelection(event.target.value, dateSelect, dates));
    };

    const handleResultChange = (event) => {
        setResultSelect(
            getNextSelection(event.target.value, resultSelect, resultKeys),
        );
    };

    const renderAllOr = (selected, getLabel) => (value) =>
        isAllSelected(selected)
            ? transl("Show All")
            : value.map(getLabel).join(", ");

    const getResultLabel = (key) =>
        results.find((item) => item.key === key)?.name ?? key;

    useEffect(() => {
        if (submission) {
            const temp_workers = submission.flatMap((item) => {
                if (
                    Array.isArray(item.worker_names) &&
                    item.worker_names.length
                ) {
                    return item.worker_names;
                }

                return item.user_name ? [item.user_name] : [];
            });
            const uniqueWorkers = [...new Set(temp_workers)];
            setWorkers(uniqueWorkers);

            const temp_dates = submission
                .map((item) => normalizeSubmissionDate(item.date))
                .filter(Boolean);
            const uniqueDates = [...new Set(temp_dates)];
            setDates(uniqueDates);

            const temp_results = submission.map((item) =>
                getSubmissionDisplayResult(item, showOnlyTheLastSubmission),
            );
            const uniqueResults = [...new Set(temp_results)];

            // The e-proxy sentinel has no entry in `projectResults`, so the
            // index lookup below drops it. Surface it as its own option, but
            // only when rows actually carry it.
            const eproxyOption = uniqueResults.includes(EPROXY_LINK_RESULT)
                ? [
                      {
                          name: getEproxyLinkLabel(),
                          color: "green",
                          key: EPROXY_LINK_RESULT,
                      },
                  ]
                : [];

            setResults([
                ...uniqueResults.sort().flatMap((item) => {
                    if (
                        typeof projectResults[item] !== "undefined" &&
                        projectResults[item] !== null
                    ) {
                        var resultLabel = JSON.parse(projectResults[item]);
                        return [
                            {
                                ...resultLabel,
                                key: item,
                            },
                        ];
                    }

                    return [];
                }),
                ...eproxyOption,
            ]);
        }
    }, [projectResults, showOnlyTheLastSubmission, submission]);

    return (
        <div className="border border-300-slate mb-3 rounded-xl grid grid-cols-4  divide-x bg-white overflow-hidden">
            <p className="uppercase tracking-widest text-sm text-slate-600 font-semibold bg-slate-200 w-full h-full flex items-center justify-center ">
                {transl("Filters")}
            </p>
            <div className="p-2">
                <FormControl fullWidth>
                    <InputLabel id="simple-select-worker">
                        {transl("Worker")}
                    </InputLabel>
                    <Select
                        labelId="simple-select-worker"
                        id="simple-select-worker"
                        value={workerSelect ?? workers}
                        label={transl("Worker")}
                        onChange={handleWorkerChange}
                        renderValue={renderAllOr(workerSelect, (item) => item)}
                        multiple
                    >
                        <MenuItem value="all">
                            <Checkbox checked={isAllSelected(workerSelect)} />
                            {transl("Show All")}
                        </MenuItem>
                        {workers.sort().map((item) => (
                            <MenuItem key={item} value={item}>
                                <Checkbox
                                    checked={isOptionChecked(workerSelect, item)}
                                />
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className="p-2">
                <FormControl fullWidth>
                    <InputLabel id="simple-select-date">
                        {transl("date")}
                    </InputLabel>
                    <Select
                        labelId="simple-select-date"
                        id="simple-select-date"
                        value={dateSelect ?? dates}
                        label={transl("date")}
                        onChange={handleDateChange}
                        renderValue={renderAllOr(dateSelect, (item) => item)}
                        multiple
                    >
                        <MenuItem value="all">
                            <Checkbox checked={isAllSelected(dateSelect)} />
                            {transl("Show All")}
                        </MenuItem>
                        {dates
                            .sort((a, b) => b.localeCompare(a))
                            .map((item) => (
                                <MenuItem key={item} value={item}>
                                    <Checkbox
                                        checked={isOptionChecked(
                                            dateSelect,
                                            item,
                                        )}
                                    />
                                    {item}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </div>
            <div className="p-2">
                <FormControl fullWidth>
                    <InputLabel id="simple-select-result">
                        {transl("result")}
                    </InputLabel>
                    <Select
                        labelId="simple-select-result"
                        id="simple-select-result"
                        value={resultSelect ?? resultKeys}
                        label={transl("result")}
                        onChange={handleResultChange}
                        renderValue={renderAllOr(resultSelect, getResultLabel)}
                        multiple
                    >
                        <MenuItem value="all">
                            <Checkbox checked={isAllSelected(resultSelect)} />
                            {transl("Show All")}
                        </MenuItem>
                        {results.map((item, key) => {
                            return (
                                <MenuItem key={item.key} value={item.key}>
                                    <Checkbox
                                        checked={isOptionChecked(
                                            resultSelect,
                                            item.key,
                                        )}
                                    />
                                    {item.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}

export default FilterSubmissionFiltering;
