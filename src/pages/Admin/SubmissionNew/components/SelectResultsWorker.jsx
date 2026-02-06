import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import transl from "../../../components/translate";
import { useUserList } from "../../../../hooks/useUser";

function SelectResultsWorker({ worker, handleWorkerChange }) {
    const { data: users, isLoading } = useUserList();

    const handleChange = (e) => {
        const id = e.target.value;
        const user = users.find((user) => user.id === id);

        handleWorkerChange({
            id: user.id,
            first_name: user.first_name,
        });
    };

    return (
        <>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <div className="mb-2">
                    <label htmlFor="result-select-label" className="text-sm">
                        {transl("Worker")} *
                    </label>
                    <select
                        required
                        className="w-full py-4 px-2 border border-slate-400 rounded mb-4 bg-transparent"
                        onChange={(e) => handleChange(e)}
                        value={worker.id}
                        // defaultValue={currentResult}
                    >
                        {users.map((element, key) => {
                            return (
                                <option key={key} value={element.id}>
                                    {element.first_name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}
        </>
    );
}

export default SelectResultsWorker;
