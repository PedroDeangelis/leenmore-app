import { Card, CardContent } from "@mui/material";
import React from "react";
import SubmissionHistoric from "../../../Worker/SingleShareholderApp/components/SubmissionHistoric";

function SNHistoric({ submissions, handleDeleteSubmission }) {
    if (submissions?.length === 0) {
        return <div>No submissions</div>;
    }

    return (
        <div>
            <Card>
                <CardContent>
                    <SubmissionHistoric
                        handleDeleteSubmission={handleDeleteSubmission}
                        submissions={submissions}
                        resultsList={submissions[0].project.results}
                        isAdmin={true}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default SNHistoric;
