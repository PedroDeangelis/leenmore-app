import React from "react";
import { useProject } from "../../../hooks/useProject";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import transl from "../../components/translate";
import { Button, CircularProgress } from "@mui/material";
import ResourcesUpload from "./components/ResourcesUpload";
import ResourcesList from "../../components/ResourcesList";
import ResourcesLinkCreate from "./components/ResourcesLinkCreate";

function SingleProjectResource() {
    const { project_id } = useParams();
    const { data: project, isLoading } = useProject(project_id);

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <Header title={`${transl("Project Resources")}: ${project.title}`}>
                <Button variant="text">
                    <Link to={`/dashboard/resources`}>{transl("Go Back")}</Link>
                </Button>
            </Header>
            <div className="grid grid-cols-2 gap-10 items-start">
                <div>
                    <ResourcesLinkCreate project={project} />
                    <ResourcesUpload project={project} />
                </div>
                <ResourcesList projectID={project.id} deleteOption={true} />
            </div>
        </div>
    );
}

export default SingleProjectResource;
