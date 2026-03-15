import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useProjectAndSubmissions,
    useProjecUpdate,
} from "../../../hooks/useProject";
import { useShareholdersFromProject } from "../../../hooks/useShareholder";
import transl from "../../components/translate";
import Header from "../components/Header";
import getAllResultsFromSubmission from "./components/getAllResultsFromSubmission";
import SingleProjectInfo from "./components/SingleProjectInfo";
import SingleProjectResults from "./components/SingleProjectResults";
import SingleProjectShareholders from "./components/SingleProjectShareholders";
import ProjectTitle from "./components/projectTitle";

function SingleProjectIndex() {
    const { id } = useParams();
    const updateProjectMutation = useProjecUpdate();
    const [shareholderProjectId, setShareholderProjectId] = useState(false);
    const { data: project, isLoading: isProjectsLoading } =
        useProjectAndSubmissions(id);
    const {
        data: projectShareholders = [],
        isLoading: isShareholdersLoading,
        isFetching: isShareholdersFetching,
    } = useShareholdersFromProject(shareholderProjectId, { columns: "*" });

    useEffect(() => {
        if (project?.id) {
            setShareholderProjectId(project.id);
        }
    }, [project?.id]);

    const projectWithShareholders = project
        ? {
              ...project,
              shareholder: projectShareholders,
          }
        : false;

    const isShareholdersPending =
        !!project?.id &&
        (!shareholderProjectId ||
            isShareholdersLoading ||
            isShareholdersFetching);

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
                            },
                        );
                    },
                },
            );
        }
    };

    return (
        <>
            {isProjectsLoading ? (
                <p>{transl("Loading")}</p>
            ) : !project ? (
                <p>{transl("Project Unavailable")}</p>
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
                        isShareholdersPending={isShareholdersPending}
                        projectShareholders={projectShareholders}
                    />
                    <SingleProjectResults
                        project={projectWithShareholders}
                        results={project.results}
                        isShareholdersPending={isShareholdersPending}
                        projectShareholders={projectShareholders}
                        // shareholderResults={getAllResultsFromSubmission(
                        //     projectShareholders,
                        // )}
                        // shareholdersCount={projectShareholders.length}
                    />
                    {isShareholdersPending ? (
                        <div className="py-8 text-center">
                            <CircularProgress />
                        </div>
                    ) : (
                        <SingleProjectShareholders
                            project={projectWithShareholders}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default SingleProjectIndex;
