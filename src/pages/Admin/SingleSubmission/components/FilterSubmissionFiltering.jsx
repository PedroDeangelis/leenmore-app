import {
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";

function FilterSubmissionFiltering({
    submission,
    workerSelect,
    setWorkerSelect,
    dateSelect,
    setDateSelect,
    resultSelect,
    setResultSelect,
    projectResults,
}) {
    const [workers, setWorkers] = useState([]);
    const [dates, setDates] = useState([]);
    const [results, setResults] = useState([]);

    const handleWorkerChange = (event) => {
        const val = event.target.value;

        if (val.includes("all")) {
            setWorkerSelect([]);
        } else {
            setWorkerSelect(val);
        }
    };

    const handleDateChange = (event) => {
        const val = event.target.value;

        if (val.includes("all")) {
            setDateSelect([]);
        } else {
            setDateSelect(val);
        }
    };

    const handleResultChange = (event) => {
        const val = event.target.value;

        if (val.includes("all")) {
            setResultSelect([]);
        } else {
            setResultSelect(val);
        }
    };

    useEffect(() => {
        if (submission) {
            const temp_workers = submission.map((item) => item.user_name);
            const uniqueWorkers = [...new Set(temp_workers)];
            setWorkers(uniqueWorkers);

            const temp_dates = submission.map((item) => item.date);
            const uniqueDates = [...new Set(temp_dates)];
            setDates(uniqueDates.map((item) => item.split("T")[0]));

            const temp_results = submission.map((item) => item.result);
            const uniqueResults = [...new Set(temp_results)];

            setResults(
                uniqueResults
                    .sort()
                    .map((item) => {
                        if (
                            typeof projectResults[item] != "undefined" &&
                            projectResults[item] != null
                        ) {
                            var resultLabel = JSON.parse(projectResults[item]);
                            return {
                                ...resultLabel,
                                key: item,
                            };
                        }
                    })
                    .filter((item) => item !== undefined)
            );
        }
    }, [submission]);

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
                        value={workerSelect}
                        label={transl("Worker")}
                        onChange={handleWorkerChange}
                        multiple
                    >
                        <MenuItem value="all">{transl("Show All")}</MenuItem>
                        {workers.sort().map((item) => (
                            <MenuItem key={item} value={item}>
                                <Checkbox
                                    checked={workerSelect.indexOf(item) > -1}
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
                        value={dateSelect}
                        label={transl("date")}
                        onChange={handleDateChange}
                        multiple
                    >
                        <MenuItem value="all">{transl("Show All")}</MenuItem>
                        {dates
                            .sort((a, b) => b.localeCompare(a))
                            .map((item) => (
                                <MenuItem key={item} value={item}>
                                    <Checkbox
                                        checked={dateSelect.indexOf(item) > -1}
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
                        value={resultSelect}
                        label={transl("result")}
                        onChange={handleResultChange}
                        multiple
                    >
                        <MenuItem value="all">{transl("Show All")}</MenuItem>
                        {results.map((item, key) => {
                            return (
                                <MenuItem key={item.key} value={item.key}>
                                    <Checkbox
                                        checked={
                                            resultSelect.indexOf(item.key) > -1
                                        }
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
