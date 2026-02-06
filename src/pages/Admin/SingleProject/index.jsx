import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useProjectWithShareholders,
    useProjecUpdate,
} from "../../../hooks/useProject";
import transl from "../../components/translate";
import Header from "../components/Header";
import getAllResultsFromSubmission from "./components/getAllResultsFromSubmission";
import SingleProjectInfo from "./components/SingleProjectInfo";
import SingleProjectResults from "./components/SingleProjectResults";
import SingleProjectShareholders from "./components/SingleProjectShareholders";
import ProjectTitle from "./components/projectTitle";

function SingleProject() {
    const { id } = useParams();
    const updateProjectMutation = useProjecUpdate();
    const { data: project, isLoading: isProjectsLoading } =
        useProjectWithShareholders(id);

    const handlePusblishProject = (status) => {
        //create a alert to confirm the action
        if (
            window.confirm(`Are you sure you want to ${status} this project?`)
        ) {
            updateProjectMutation.mutate(
                {
                    project_id: id,
                    meta: { status: status },
                },
                {
                    onSuccess: () => {
                        toast.success(
                            transl("Status Updated to the current project"),
                            {
                                position: "top-right",
                                autoClose: 4000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            }
                        );
                    },
                }
            );
        }
    };

    const Title = () => {
        return (
            <>
                {project.title}
                <span className="ml-2 text-sm">({transl(project.status)})</span>
            </>
        );
    };

    return (
        <>
            {isProjectsLoading && !project ? (
                <p>{transl("Loading")}</p>
            ) : (
                <div>
                    <Header
                        title={
                            <ProjectTitle
                                title={project.title}
                                status={project.status}
                                project_id={project.id}
                            />
                        }
                    >
                        <Button sx={{ marginRight: "20px" }}>
                            <Link to={`/dashboard/resources/${project.id}`}>
                                {transl("Project resources")}
                            </Link>
                        </Button>
                        {project.status == "draft" && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    handlePusblishProject("publish");
                                }}
                            >
                                {transl("Publish Project")}
                            </Button>
                        )}
                        {project.status == "publish" && (
                            <>
                                <Button
                                    sx={{ marginRight: "20px" }}
                                    variant="outlined"
                                    onClick={() => {
                                        handlePusblishProject("deleted");
                                    }}
                                >
                                    {transl("Delete Project")}
                                </Button>
                                <Button
                                    sx={{ marginRight: "20px" }}
                                    variant="contained"
                                    onClick={() => {
                                        handlePusblishProject("draft");
                                    }}
                                >
                                    {transl("pause project")}
                                </Button>
                            </>
                        )}
                        <Button>
                            <Link
                                to={`/dashboard/activity-report/new/${project.id}`}
                            >
                                {transl("Add New Submission")}
                            </Link>
                        </Button>
                    </Header>
                    <SingleProjectInfo
                        title={project.title}
                        startDate={project?.start_date}
                        endDate={project?.end_date}
                        status={project.status}
                        project={project}
                        hasSubmission={project?.submission?.length}
                    />
                    <SingleProjectResults
                        project={project}
                        results={project.results}
                        shareholderResults={getAllResultsFromSubmission(
                            project?.shareholder
                        )}
                        shareholdersCount={project?.shareholder?.length}
                    />
                    <SingleProjectShareholders project={project} />
                </div>
            )}
        </>
    );
}

export default SingleProject;
