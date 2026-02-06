import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProject } from "../../../hooks/useProject";
import { useSubmissionsFilter } from "../../../hooks/useSubmission";
import transl from "../../components/translate";
import Header from "../components/Header";
import FilterSubmission from "./components/FilterSubmission";
import SubmissionLoop from "./components/SubmissionLoop";
import { useQueryClient } from "react-query";

function SingleSubmission() {
    const { type, id: project_id } = useParams();
    const { data, isLoading } = useProject(project_id);
    const { data: submission, isLoading: isSubmissionLoading } =
        useSubmissionsFilter(type, project_id);
    const [filteredSubmission, setFilteredSubmission] = useState([]);

    useEffect(() => {
        if (data && filteredSubmission?.length === 0) {
            setFilteredSubmission(submission);
        }
    }, [isSubmissionLoading, isLoading]);

    return (
        <>
            <Header title={data?.title}>
                <Link to={`/dashboard/project/${project_id}`}>
                    <Button variant="text">{transl("Go Back")}</Button>
                </Link>
            </Header>

            {isSubmissionLoading || isLoading ? (
                <CircularProgress />
            ) : (
                <>
                    <FilterSubmission
                        submission={submission}
                        projectResults={data?.results}
                        setFilteredSubmission={setFilteredSubmission}
                    />

                    {!filteredSubmission?.length ? (
                        <p className="text-center text-gray-500">
                            {transl("No results found")}
                        </p>
                    ) : (
                        <SubmissionLoop
                            projectResults={data?.results}
                            data={filteredSubmission}
                        />
                    )}
                </>
            )}
        </>
    );
}

export default SingleSubmission;
