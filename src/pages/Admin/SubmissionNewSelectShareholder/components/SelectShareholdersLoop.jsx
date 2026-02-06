import React, { useEffect, useState } from "react";
import SelectShareholdersLoopItem from "./SelectShareholdersLoopItem";
import { useProject } from "../../../../hooks/useProject";
import { CircularProgress } from "@mui/material";

function SelectShareholdersLoop({ project_id, shareholders }) {
    const [resultsList, setResultsList] = useState(null);
    const { data: project, isLoading } = useProject(project_id);

    useEffect(() => {
        if (project) {
            setResultsList(project.results);
        }
    }, [project]);

    if (isLoading && !resultsList) {
        return <CircularProgress />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-9">
            {shareholders?.map((shareholder) => (
                <SelectShareholdersLoopItem
                    key={shareholder.id}
                    project_id={project_id}
                    shareholder={shareholder}
                    resultsList={resultsList}
                />
            ))}
        </div>
    );
}

export default SelectShareholdersLoop;
