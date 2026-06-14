import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProject } from "../../../hooks/useProject";
import { useSubmissionsFilter } from "../../../hooks/useSubmission";
import transl from "../../components/translate";
import Header from "../components/Header";
import FilterSubmission from "./components/FilterSubmission";
import SubmissionLoop from "./components/SubmissionLoop";
import { useShareholderEproxy } from "../../../hooks/useShareholder";
import moment from "moment";

function SingleSubmission() {
    const { type, id: project_id } = useParams();
    const { data, isLoading } = useProject(project_id);
    const { data: submission, isLoading: isSubmissionLoading } =
        useSubmissionsFilter(type, project_id);
    const [allSubmission, setAllSubmission] = useState([]);
    const [filteredSubmission, setFilteredSubmission] = useState([]);
    const {
        data: shareholderWithEproxy,
        isLoading: isShareholderEproxyLoading,
    } = useShareholderEproxy(project_id);

    useEffect(() => {
        if (isSubmissionLoading || isShareholderEproxyLoading) {
            return;
        }

        let customerSubmissionFromEproxy = [];

        if (shareholderWithEproxy?.length) {
            customerSubmissionFromEproxy = shareholderWithEproxy.map(
                (shareholder) => {
                    const workerNames = Array.isArray(shareholder.user)
                        ? shareholder.user.filter(Boolean)
                        : shareholder.user
                          ? [shareholder.user]
                          : [];

                    let date = shareholder.api_recipient_completion_date;

                    // remove time from date
                    if (date) {
                        // example date 2026-03-18 12:45:25
                        date = moment(date).format("YYYY-MM-DD");
                    }

                    return {
                        id: shareholder.id + "_eproxy",
                        shareholder: shareholder,
                        result: "eproxy_link",
                        shareholder_id: shareholder.id,
                        contact_worker: shareholder.api_recipient_contact,
                        created_at: date,
                        date: date,
                        project: {
                            title: data?.title || "",
                        },
                        project_id: project_id,
                        source: "esignon",
                        user_name: workerNames[0] || "",
                        worker_names: workerNames,
                    };
                },
            );
        }

        const submissionList = Array.isArray(submission)
            ? submission.map((item) => {
                  const sh = item?.shareholder;
                  const hasCompletedEproxy =
                      !!sh?.api_recipient_contact &&
                      !!sh?.api_recipient_completion_date;
                  return hasCompletedEproxy
                      ? { ...item, result: "eproxy_link" }
                      : item;
              })
            : [];
        const combinedSubmission = [
            ...submissionList,
            ...customerSubmissionFromEproxy,
        ];

        setAllSubmission(combinedSubmission);
        setFilteredSubmission(combinedSubmission);
    }, [
        data?.title,
        isShareholderEproxyLoading,
        isSubmissionLoading,
        project_id,
        shareholderWithEproxy,
        submission,
    ]);

    return (
        <>
            <Header title={data?.title}>
                <Link to={`/dashboard/project/${project_id}`}>
                    <Button variant="text">{transl("Go Back")}</Button>
                </Link>
            </Header>

            {isSubmissionLoading || isLoading || isShareholderEproxyLoading ? (
                <CircularProgress />
            ) : (
                <>
                    <FilterSubmission
                        submission={allSubmission}
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
