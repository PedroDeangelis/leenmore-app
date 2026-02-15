import React, { useEffect, useState } from "react";
import transl from "../../components/translate";
import Header from "../components/Header";
import { useAllProjectsSimpleList } from "../../../hooks/useProject";
import SearchProjectBar from "../components/SearchProjectBar";
import { Link } from "react-router-dom";

function EmailToWorker() {
    const [searchProject, setSearchProject] = useState("");
    const [searchProjectFilter, setSearchProjectFilter] = useState([]);
    const { data: projects, isLoading } = useAllProjectsSimpleList();

    useEffect(() => {
        if (projects) {
            setSearchProjectFilter(
                projects
                    .filter((project) =>
                        project.title
                            .toLowerCase()
                            .includes(searchProject.toLowerCase()),
                    )
                    .sort((projectA, projectB) => {
                        const now = new Date();

                        // If both projects have no end date, they are considered equal.
                        if (!projectA.end_date && !projectB.end_date) {
                            return 0;
                        }

                        // If projectA has no end date, it comes after projectB.
                        if (!projectA.end_date) {
                            return 1;
                        }

                        // If projectB has no end date, it comes after projectA.
                        if (!projectB.end_date) {
                            return -1;
                        }

                        const endDateA = new Date(projectA.end_date);
                        const endDateB = new Date(projectB.end_date);

                        // If both projects have expired end dates, sort by closest end date.
                        if (endDateA < now && endDateB < now) {
                            return endDateB - endDateA;
                        }

                        // If projectA has an expired end date, it comes after projectB.
                        if (endDateA < now) {
                            return 1;
                        }

                        // If projectB has an expired end date, it comes after projectA.
                        if (endDateB < now) {
                            return -1;
                        }

                        // Both projects have future end dates, sort by closest end date.
                        return endDateA - endDateB;
                    }),
            );
        }
    }, [searchProject, projects]);

    return (
        <div>
            <Header title={transl("Email To Worker")}></Header>

            <SearchProjectBar
                searchProject={searchProject}
                setSearchProject={setSearchProject}
            />
            <div className="grid grid-cols-1 gap-2">
                {isLoading ? (
                    <p>{transl("Loading")}</p>
                ) : (
                    (searchProjectFilter.length > 0 &&
                        searchProjectFilter.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white p-2 rounded-md p-4 shadow relative"
                            >
                                <p className="text-lg">{project.title}</p>
                                <Link
                                    to={`/dashboard/email-to-worker/${project.id}`}
                                    className="absolute inset-0"
                                ></Link>
                            </div>
                        ))) || <p>{transl("No projects found")}</p>
                )}
            </div>
        </div>
    );
}

export default EmailToWorker;
