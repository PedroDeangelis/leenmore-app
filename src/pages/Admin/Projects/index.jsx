import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import transl from "../../components/translate";
import Header from "../components/Header";
import ProjectTableList from "./components/ProjectTableList";
import SearchProjectBar from "../components/SearchProjectBar";
import { useAllProjectsSimpleList } from "../../../hooks/useProject";

function Projects() {
    const [searchProject, setSearchProject] = useState("");
    const [searchProjectFilter, setSearchProjectFilter] = useState([]);
    const { data: projects, isLoading } = useAllProjectsSimpleList();

    useEffect(() => {
        if (projects) {
            setSearchProjectFilter(
                projects.filter((project) =>
                    project.title
                        .toLowerCase()
                        .includes(searchProject.toLowerCase())
                )
            );
        }
    }, [searchProject, projects]);

    return (
        <div>
            <Header title={transl("Projects")}>
                <Link to={"/dashboard/project/add-new"}>
                    <Button variant="contained">
                        {transl("Add New Project")}
                    </Button>
                </Link>
            </Header>

            <SearchProjectBar
                searchProject={searchProject}
                setSearchProject={setSearchProject}
            />
            {isLoading ? (
                <p>{transl("Loading")}</p>
            ) : (
                <ProjectTableList projects={searchProjectFilter} />
            )}
        </div>
    );
}

export default Projects;
