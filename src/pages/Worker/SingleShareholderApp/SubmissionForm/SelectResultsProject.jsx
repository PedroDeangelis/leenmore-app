import {
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useProject } from "../../../../hooks/useProject";
import transl from "../../../components/translate";

function SelectResultsProject({
    project_id,
    currentResult,
    handleResultChange,
}) {
    const { data, isLoading } = useProject(project_id);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (data && data.results) {
            let resultToJson = data.results.map((element) =>
                JSON.parse(element),
            );

            // id is the key
            resultToJson = resultToJson.map((element, index) => {
                return { ...element, id: index };
            });

            resultToJson.sort((a, b) => a.order - b.order);

            setResults(resultToJson);
        }
    }, [data]);

    return (
        <>
            {results.length === 0 ? (
                <CircularProgress />
            ) : (
                <>
                    <label htmlFor="result-select-label" className="text-sm">
                        {transl("Result")} *
                    </label>
                    <select
                        required
                        className="w-full py-4 px-2 border border-slate-400 rounded mb-4 bg-transparent"
                        onChange={handleResultChange}
                        value={currentResult}
                    >
                        <option value="">{transl("Choose an option")}</option>
                        {results.map((element) => {
                            return (
                                <option key={element.id} value={element.id}>
                                    {element.name}
                                </option>
                            );
                        })}
                    </select>
                </>
            )}
        </>
    );
}

export default SelectResultsProject;
