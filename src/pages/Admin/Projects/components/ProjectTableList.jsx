import { Card, CardContent } from "@mui/material";
import React from "react";
import {
    useAllProjectsSimpleList,
    useProjectsList,
} from "../../../../hooks/useProject";
import transl from "../../../components/translate";
import ProjectTableItem from "./ProjectTableItem";

function ProjectTableList({ projects }) {
    return (
        <>
            {projects ? (
                projects
                    .filter(
                        (value) =>
                            value.status !== "completed" &&
                            value.status !== "deleted"
                    )
                    .map((value) => (
                        <ProjectTableItem
                            key={value.id}
                            id={value.id}
                            title={value.title}
                            status={value.status}
                            created_at={value.created_at}
                            link={`/dashboard/project/${value.id}`}
                        />
                    ))
            ) : (
                <h2>{transl("No Working Projects available at the moment")}</h2>
            )}
        </>
    );
}

export default ProjectTableList;
