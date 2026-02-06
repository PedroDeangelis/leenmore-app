import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import transl from "../../components/translate";
import SearchResourcesBar from "../ProjectResources/components/SearchResourcesBar";
import { useAllProjectsSimpleList } from "../../../hooks/useProject";
import { CircularProgress } from "@mui/material";
import ActivityDataProjectLoopItem from "./components/ActivityDataProjectLoopItem";

function ActivityData() {
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
            <Header title={transl("Activity Report")}></Header>
            {!isLoading ? (
                <>
                    <SearchResourcesBar
                        searching={searching}
                        handleSearching={(e) => setSearching(e.target.value)}
                    />

                    {filterdProjects?.length > 0 &&
                        filterdProjects.map((project) => (
                            <ActivityDataProjectLoopItem
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

export default ActivityData;
