import React from "react";
import transl from "../../../components/translate";
import ProjectTableItem from "../../Projects/components/ProjectTableItem";

function SubmissionsProjectLoop({
    projects,
    urlPath = "/dashboard/submission/project",
}) {
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
                            showEndDate={true}
                            end_date={value.end_date}
                            link={`${urlPath}/${value.id}`}
                        />
                    ))
            ) : (
                <h2>{transl("No Working Projects available at the moment")}</h2>
            )}
        </>
    );
}

export default SubmissionsProjectLoop;
