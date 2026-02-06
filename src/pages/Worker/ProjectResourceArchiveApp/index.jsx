import React, { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import transl from "../../components/translate";
import AppContent from "../components/AppContent";
import { CircularProgress, Paper } from "@mui/material";
import { useProjectsSpecificUser } from "../../../hooks/useProject";
import { Link } from "react-router-dom";
import { useUser, useUserisLoggendIn } from "../../../hooks/useUser";

function ProjectResourceArchiveApp() {
    const { data: currentUser } = useUserisLoggendIn();
    const { data: usermeta } = useUser(currentUser?.id);
    const { data } = useProjectsSpecificUser(usermeta.first_name);

    const [projects, setProjects] = useState(null);

    useEffect(() => {
        if (data && data.length > 0) {
            setProjects(data);
        }
    }, [data]);

    return (
        <div>
            <AppHeader>
                <div>
                    <h1 className="text-3xl">{transl("project resources")}</h1>
                </div>
            </AppHeader>
            <AppContent>
                {!projects ? (
                    <CircularProgress />
                ) : (
                    projects?.length > 0 &&
                    projects.map((project) => (
                        <Link
                            to={`/app/resources/${project.id}`}
                            key={project.id}
                        >
                            <Paper className="p-4 mb-4 flex items-center">
                                <div>
                                    <h2 className="text-xl">{project.title}</h2>
                                    <p className="text-xs">
                                        {project.description}
                                    </p>
                                </div>
                            </Paper>
                        </Link>
                    ))
                )}
            </AppContent>
        </div>
    );
}

export default ProjectResourceArchiveApp;
