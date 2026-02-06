import React from "react";
import transl from "../../components/translate";
import AppContent from "../components/AppContent";
import AppHeader from "../components/AppHeader";
import { useParams } from "react-router-dom";
import { useProject } from "../../../hooks/useProject";
import { CircularProgress } from "@mui/material";
import ResourcesList from "../../components/ResourcesList";

function SingleResourceApp() {
    const { project_id } = useParams();
    const { data: project, isLoading } = useProject(project_id);

    return (
        <div>
            <AppHeader>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <div className="flex items-center">
                        <div>
                            <p className="text-xs mb-3">
                                {transl("project resources")}
                            </p>
                            <h1 className="text-3xl">{project.title}</h1>
                        </div>
                    </div>
                )}
            </AppHeader>
            <AppContent>
                <ResourcesList projectID={project_id} />
            </AppContent>
        </div>
    );
}

export default SingleResourceApp;
