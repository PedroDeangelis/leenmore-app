import React from "react";
import transl from "../../../components/translate";
import ProjectWorkspaceLoopItem from "./ProjectWorkspaceLoopItem";

function ProjectWorkspaceLoop({ projects }) {
    // check if projects is an array
    if (!Array.isArray(projects)) {
        return <p>{transl("loading")}</p>;
    }

    // check if projects is empty
    if (projects.length === 0) {
        return <p>{transl("No projects found")}</p>;
    }

    return (
        <>
            {projects
                .filter((project) => project.status === "publish")
                .map((project) => (
                    <ProjectWorkspaceLoopItem
                        key={project.id}
                        project={project}
                    />
                ))}
        </>
    );
}

export default ProjectWorkspaceLoop;
