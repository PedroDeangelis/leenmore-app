import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProjectWithShareholdersByUser } from "../../../hooks/useProject";
import { useUser, useUserisLoggendIn } from "../../../hooks/useUser";
import transl from "../../components/translate";
import AppContent from "../components/AppContent";
import AppHeader from "../components/AppHeader";
import ProjectLoop from "./components/ProjectLoop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FiltersShareholder from "../../components/FiltersShareholder";
import { useAtom } from "jotai";
import { listOfShareholdersAtom } from "../../../helpers/atom";
import ProjectMessage from "../components/ProjectMessage";

function SingleProjectApp() {
    const { id } = useParams();
    const { data: currentUser } = useUserisLoggendIn();
    const { data: usermeta } = useUser(currentUser?.id);
    const { data: project, isLoading } = useProjectWithShareholdersByUser(
        id,
        usermeta.first_name
    );

    const [listOfShareholders, setListOfShareholders] = useAtom(
        listOfShareholdersAtom
    );

    useEffect(() => {
        if (project) {
            setListOfShareholders([...project.shareholder]);
        }
    }, [project]);

    return (
        <div>
            <AppHeader projectID={id}>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <div className="flex items-center">
                        <Link to="/app" className="mr-4">
                            <ArrowBackIcon />
                        </Link>
                        <div>
                            <p className="text-xs mb-3">{transl("project")}</p>
                            <h1 className="text-3xl">{project.title}</h1>
                        </div>
                    </div>
                )}
            </AppHeader>
            <AppContent>
                {!listOfShareholders || isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <ProjectMessage message={project.message} />
                        <FiltersShareholder
                            originalShareholdesList={project.shareholder}
                            listOfResults={project.results}
                        />
                        <ProjectLoop listOfResults={project?.results} />
                    </>
                )}
            </AppContent>
        </div>
    );
}

export default SingleProjectApp;
