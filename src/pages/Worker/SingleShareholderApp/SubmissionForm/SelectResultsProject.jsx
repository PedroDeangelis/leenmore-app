import {
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import React from "react";
import { useProject } from "../../../../hooks/useProject";
import transl from "../../../components/translate";

function SelectResultsProject({
    project_id,
    currentResult,
    handleResultChange,
}) {
    const { data, isLoading } = useProject(project_id);

    return (
        <>
            {isLoading ? (
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
                        // defaultValue={currentResult}
                    >
                        <option value="">{transl("Choose an option")}</option>
                        {data.results.map((element, key) => {
                            let result = JSON.parse(element);
                            return (
                                <option
                                    key={key}
                                    value={key}
                                    // selected={currentResult == key}
                                >
                                    {result.name}
                                </option>
                            );
                        })}
                    </select>
                </>
                // <FormControl fullWidth className="w-full " sx={{ mb: "20px" }}>
                //     <InputLabel id="result-select-label">
                //         {transl("Result")} *
                //     </InputLabel>
                //     <Select
                //         labelId="result-select-label"
                //         label="Result *"
                //         value={result}
                //         onChange={handleResultChange}
                //     >
                //         {data.results.map((element, key) => {
                //             let result = JSON.parse(element);

                //             return (
                //                 <MenuItem key={key} value={key}>
                //                     {result.name}
                //                 </MenuItem>
                //             );
                //         })}
                //     </Select>
                // </FormControl>
            )}
        </>
    );
}

export default SelectResultsProject;
