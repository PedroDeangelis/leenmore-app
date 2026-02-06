import React from "react";
import transl from "../../../components/translate";
import ProjectLoopItem from "./ProjectLoopItem";

function ProjectLoopListing({ projects }) {
    return (
        <>
            {projects?.length ? (
                projects?.filter(
                    (value) => value.status == "publish"
                ).map((value) => (
                    <ProjectLoopItem
                        key={value.id}
                        id={value.id}
                        title={value.title}
                        shareholders={value.shareholder.length}
                    />
                ))
            ) : (
                <h2>{transl("No projects signed to you at the moment")}.</h2>
            )}
        </>
    );
}

export default ProjectLoopListing;
