import React, { useEffect, useState } from "react";
import moment from "moment";
import Header from "../components/Header";
import transl from "../../components/translate";
import SearchResourcesBar from "../ProjectResources/components/SearchResourcesBar";
import { useAllProjectsSimpleList } from "../../../hooks/useProject";
import { CircularProgress } from "@mui/material";
import ActivityDataProjectLoopItem from "./components/ActivityDataProjectLoopItem";
import FilterActivityDataBar from "./components/FilterActivityDataBar";
import { isWithinKoreanDayRange } from "../../../utils/koreanDate";

// Supabase hands back timestamps like "2026-03-01T10:00:00+00", which
// new Date() cannot parse. A NaN comparison silently disables the sort
// instead of erroring, so parse with moment like the rest of the project.
const dateValue = (value) => {
    if (!value) {
        return null;
    }

    const parsed = moment(value);

    return parsed.isValid() ? parsed.valueOf() : null;
};

const compareProjects = (projectA, projectB, sortBy, sortDirection) => {
    const flip = (comparison) =>
        sortDirection === "asc" ? comparison : -comparison;

    if (sortBy === "title") {
        return flip(
            String(projectA.title ?? "").localeCompare(
                String(projectB.title ?? ""),
            ),
        );
    }

    const valueA = dateValue(projectA[sortBy]);
    const valueB = dateValue(projectB[sortBy]);

    // Projects with no usable date sort last in both directions, so this
    // has to sit outside the ascending/descending flip.
    if (valueA === null && valueB === null) {
        return 0;
    }

    if (valueA === null) {
        return 1;
    }

    if (valueB === null) {
        return -1;
    }

    return flip(valueA - valueB);
};

function ActivityData() {
    const { data: projects, isLoading } = useAllProjectsSimpleList();
    const [searching, setSearching] = useState("");
    const [filterdProjects, setFilterdProjects] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [createdFrom, setCreatedFrom] = useState("");
    const [createdTo, setCreatedTo] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortDirection, setSortDirection] = useState("desc");

    useEffect(() => {
        if (projects) {
            setFilterdProjects(
                projects
                    .filter((project) =>
                        String(project.title ?? "")
                            .toLowerCase()
                            .includes(searching.toLowerCase()),
                    )
                    .filter(
                        (project) =>
                            statusFilter === "all" ||
                            project.status === statusFilter,
                    )
                    .filter((project) =>
                        isWithinKoreanDayRange(
                            project.created_at,
                            createdFrom,
                            createdTo,
                        ),
                    )
                    .sort((projectA, projectB) =>
                        compareProjects(
                            projectA,
                            projectB,
                            sortBy,
                            sortDirection,
                        ),
                    ),
            );
        }
    }, [
        searching,
        projects,
        statusFilter,
        createdFrom,
        createdTo,
        sortBy,
        sortDirection,
    ]);

    return (
        <div>
            <Header title={transl("Activity Report")}></Header>
            {!isLoading ? (
                <>
                    <SearchResourcesBar
                        searching={searching}
                        handleSearching={(e) => setSearching(e.target.value)}
                    />

                    <FilterActivityDataBar
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        createdFrom={createdFrom}
                        setCreatedFrom={setCreatedFrom}
                        createdTo={createdTo}
                        setCreatedTo={setCreatedTo}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortDirection={sortDirection}
                        setSortDirection={setSortDirection}
                    />

                    {filterdProjects?.length > 0 ? (
                        filterdProjects.map((project) => (
                            <ActivityDataProjectLoopItem
                                key={project.id}
                                project={project}
                            />
                        ))
                    ) : (
                        <p className="text-slate-500">
                            {transl("No projects found")}
                        </p>
                    )}
                </>
            ) : (
                <CircularProgress />
            )}
        </div>
    );
}

export default ActivityData;
