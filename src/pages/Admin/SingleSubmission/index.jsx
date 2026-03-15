import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProject } from "../../../hooks/useProject";
import { useSubmissionsFilter } from "../../../hooks/useSubmission";
import transl from "../../components/translate";
import Header from "../components/Header";
import FilterSubmission from "./components/FilterSubmission";
import SubmissionLoop from "./components/SubmissionLoop";
import { useShareholderEproxyNoResult } from "../../../hooks/useShareholder";

function SingleSubmission() {
    const { type, id: project_id } = useParams();
    const { data, isLoading } = useProject(project_id);
    const { data: submission, isLoading: isSubmissionLoading } =
        useSubmissionsFilter(type, project_id);
    const [filteredSubmission, setFilteredSubmission] = useState([]);
    const { data: missingSubmission, isLoading: isMissingSubmissionLoading } =
        useShareholderEproxyNoResult(project_id);
    const [isEverythingLoaded, setIsEverythingLoaded] = useState(false);
    const isDataLoading =
        isLoading || isSubmissionLoading || isMissingSubmissionLoading;

    const submissionSource = useMemo(() => {
        const baseSubmission = Array.isArray(submission) ? submission : [];
        const missingSubmissionList = Array.isArray(missingSubmission)
            ? missingSubmission
            : [];

        if (!missingSubmissionList.length) {
            return baseSubmission;
        }

        const existingShareholderIds = new Set(
            baseSubmission
                .map((value) => value?.shareholder?.id ?? value?.shareholder_id)
                .filter((value) => value != null),
        );

        const mergedMissingSubmission = missingSubmissionList
            .filter((item) => !existingShareholderIds.has(item?.id))
            .map((item, index) => {
                const createdAt =
                    item?.api_recipient_completion_date ??
                    item?.updated_at ??
                    item?.created_at ??
                    null;

                return {
                    id: item?.id ? `missing-${item.id}` : `missing-${index}`,
                    shareholder_id: item?.id ?? null,
                    shareholder: { ...item },
                    is_missing: true,
                    project: {
                        title: data?.title ?? "",
                        results: data?.results ?? [],
                    },
                    user_name: "",
                    date: createdAt,
                    created_at: createdAt,
                    result: item?.result ?? null,
                    note: "",
                    files: [],
                    privacy_consent_file: [],
                };
            });

        return [...baseSubmission, ...mergedMissingSubmission];
    }, [submission, missingSubmission, data?.title, data?.results]);

    useEffect(() => {
        if (isDataLoading) {
            setIsEverythingLoaded(false);
            return;
        }

        setFilteredSubmission(submissionSource);
        setIsEverythingLoaded(true);
    }, [isDataLoading, submissionSource]);

    return (
        <>
            <Header title={data?.title}>
                <Link to={`/dashboard/project/${project_id}`}>
                    <Button variant="text">{transl("Go Back")}</Button>
                </Link>
            </Header>

            {!isEverythingLoaded ? (
                <CircularProgress />
            ) : (
                <>
                    <FilterSubmission
                        submission={submissionSource}
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
