import React from "react";
import transl from "../../components/translate";
import Header from "../components/Header";
import { Link, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import {
    useShareholder,
    useShareholderLastResultUpdate,
} from "../../../hooks/useShareholder";
import {
    useSubmissionDelete,
    useSubmissionsByProjectAndShareholder,
} from "../../../hooks/useSubmission";
import SNHistoric from "./components/SNHistoric";
import SNINfo from "./components/SNINfo";
import SNForm from "./components/SNForm";
import { toast } from "react-toastify";

function SubmissionNew() {
    const { project_id, shareholder_id } = useParams();
    const { data: shareholder, isLoading } = useShareholder(shareholder_id);

    const { data: submissions, isLoading: isLoadingSubmissions } =
        useSubmissionsByProjectAndShareholder(project_id, shareholder_id);

    const updateShareholderLastResultMutation =
        useShareholderLastResultUpdate();

    const deleteSubmissionMutation = useSubmissionDelete();

    // const handleUpdateShareholderLastResult = (
    //     lastSubmissionUpdateID,
    //     lastSubmissionUpdateResult
    // ) => {
    //     // loop submissions to get the last submission
    //     const lastSubmission = submissions.reduce((prev, current) => {
    //         return prev.date > current.date ? prev : current;
    //     });

    //     // update shareholder last result
    //     let result = lastSubmission.result;

    //     if (lastSubmissionUpdateID === lastSubmission.id) {
    //         result = lastSubmissionUpdateResult;
    //     }

    //     updateShareholderLastResultMutation.mutate({
    //         shareholderID: shareholder_id,
    //         result: result,
    //     });
    // };

    const handleDeleteSubmission = (submissionID, submissions, projectID) => {
        if (
            window.confirm(
                transl("Are you sure you want to delete this submission?")
            )
        ) {
            // remove the submissionID from the submissions array
            const submissionsFiltered = submissions.filter(
                (submission) => submission.id !== submissionID
            );

            // get the last submission
            var lastSubmissionFilteredResult = null;

            if (submissionsFiltered.length > 0) {
                lastSubmissionFilteredResult = submissionsFiltered?.reduce(
                    (prev, current) => {
                        return prev.date > current.date ? prev : current;
                    }
                );

                lastSubmissionFilteredResult =
                    lastSubmissionFilteredResult?.result;
            }

            deleteSubmissionMutation.mutate(
                {
                    submissionID,
                    result: lastSubmissionFilteredResult,
                    projectID,
                },
                {
                    onSuccess: (data) => {
                        toast.success(
                            transl("Submission deleted successfully"),
                            {
                                position: "top-right",
                                autoClose: 4000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            }
                        );
                    },
                }
            );
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Header title={`${transl("Add New Submission")}`}>
                <Button>
                    <Link to={`/dashboard/activity-report/new/${project_id}`}>
                        {transl("Go Back")}
                    </Link>
                </Button>
            </Header>

            <div className="grid-cols-1 lg:grid-cols-2 grid gap-10">
                <div>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <SNINfo shareholder={shareholder} />
                    )}
                    {isLoadingSubmissions ? (
                        <CircularProgress />
                    ) : (
                        <SNHistoric
                            handleDeleteSubmission={handleDeleteSubmission}
                            submissions={submissions}
                        />
                    )}
                </div>
                <div>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <SNForm shareholder={shareholder} />
                    )}
                </div>
            </div>
        </>
    );
}

export default SubmissionNew;
