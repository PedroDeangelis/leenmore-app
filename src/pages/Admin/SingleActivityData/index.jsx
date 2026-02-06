import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import transl from "../../components/translate";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useProject } from "../../../hooks/useProject";
import ActivityDataProjectInfo from "./components/ActivityDataProjectInfo";
import { useSubmissionsFilter } from "../../../hooks/useSubmission";
import getDaysWorked from "./components/getDaysWorked";
import DaysDropdown from "./components/DaysDropdown";
import ActivityDataTable from "./components/ActivityDataTable";
import ActivitySummaryTable from "./components/ActivitySummaryTable";
import downloadExcelActivityData from "./components/downloadExcelActivityData";
import supabase from "../../../utils/supabaseClient";
import { useQueryClient } from "react-query";

function SingleActivityData() {
    const { project_id } = useParams();
    const { data: project, isLoading } = useProject(project_id);
    const [submissions, setSubmissions] = useState([]);
    const [daysWorked, setDaysWorked] = useState([]);
    const [daysSelected, setDaysSelected] = useState([]);
    const [sortFilter, setSortFilter] = useState({
        sortBy: "worker",
        sortDirection: "asc",
    });
    const queryClient = useQueryClient();

    const { data: submissionsData, isLoading: isSubmissionLoading } =
        useSubmissionsFilter("project", project_id);

    useEffect(() => {
        if (submissionsData) {
            setSubmissions(submissionsData);

            const _daysWorked = getDaysWorked(submissionsData);

            setDaysWorked(_daysWorked);
        }
    }, [isSubmissionLoading, isLoading]);

    useEffect(() => {
        if (submissionsData && daysSelected?.length) {
            var _submissions = submissionsData.filter((submission) => {
                const date = submission.date.split("T")[0];

                return daysSelected.includes(date);
            });

            setSubmissions(_submissions);
        } else if (!daysSelected?.length) {
            setSubmissions(submissionsData);
        }
    }, [daysSelected]);

    const handleDownload = () => {
        downloadExcelActivityData(submissions, project.results, project.title);
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <Header
                title={`${transl("Activity Report")}: ${project.title}`}
            ></Header>
            <div className="grid grid-cols-2 gap-4 items-start mb-8">
                <DaysDropdown
                    daysWorked={daysWorked}
                    daysSelected={daysSelected}
                    setDaysSelected={setDaysSelected}
                />
                <ActivityDataProjectInfo
                    totalDaysWorked={daysWorked?.length}
                    handleDownload={handleDownload}
                />
            </div>
            <div className="flex items-start">
                {submissions?.length ? (
                    <>
                        <ActivityDataTable
                            submissions={submissions}
                            results={project.results}
                            sortFilter={sortFilter}
                            setSortFilter={setSortFilter}
                        />
                        <ActivitySummaryTable
                            submissions={submissions}
                            results={project.results}
                        />
                    </>
                ) : (
                    <CircularProgress />
                )}
            </div>
        </div>
    );
}

export default SingleActivityData;
