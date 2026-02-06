import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import transl from "../../components/translate";
import SearchResourcesBar from "./components/SearchResourcesBar";
import { useAllProjectsSimpleList } from "../../../hooks/useProject";
import { CircularProgress } from "@mui/material";
import ResourcesProjectLoopItem from "./components/ResourcesProjectLoopItem";

function ProjectResources() {
    const { data: projects, isLoading } = useAllProjectsSimpleList();
    const [searching, setSearching] = useState("");
    const [filterdProjects, setFilterdProjects] = useState([]);

    useEffect(() => {
        if (projects) {
            setFilterdProjects(
                projects.filter((project) =>
                    project.title
                        .toLowerCase()
                        .includes(searching.toLowerCase())
                )
            );
        }
    }, [searching, projects]);

    return (
        <div>
            <Header title={transl("Project Resources")}></Header>
            {!isLoading ? (
                <>
                    <SearchResourcesBar
                        searching={searching}
                        handleSearching={(e) => setSearching(e.target.value)}
                    />

                    {filterdProjects?.length > 0 &&
                        filterdProjects.map((project) => (
                            <ResourcesProjectLoopItem
                                key={project.id}
                                project={project}
                            />
                        ))}
                </>
            ) : (
                <CircularProgress />
            )}
        </div>
    );
}

export default ProjectResources;
