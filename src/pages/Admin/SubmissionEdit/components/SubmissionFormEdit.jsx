import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    InputLabel,
    OutlinedInput,
    TextField,
} from "@mui/material";
import moment from "moment";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSubmissionUpdate } from "../../../../hooks/useSubmission";
import transl from "../../../components/translate";
import SelectResultsProject from "../../../Worker/SingleShareholderApp/SubmissionForm/SelectResultsProject";
import { useNavigate } from "react-router-dom";

function SubmissionFormEdit({ project, submission }) {
    const [fResult, setFResult] = useState(submission.result);
    const [submitingForm, setSubmitingForm] = useState(false);
    const [fNote, setFNote] = useState(submission.note);
    const [fContact, setFContact] = useState(submission.contact_worker);
    const [fDate, setFDate] = useState(
        moment(submission.date).format("Y-MM-DD")
    );
    const submissionUpdateMutation = useSubmissionUpdate();

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitingForm(true);

        submissionUpdateMutation.mutate(
            {
                data: {
                    result: fResult,
                    note: fNote,
                    contact_worker: fContact,
                    date: fDate,
                    id: submission.id,
                    shareholder_id: submission.shareholder_id,
                },
            },
            {
                onSuccess: () => {
                    toast.success(transl("Submission updated successfully"), {
                        position: "top-right",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    navigate(`/dashboard/submission/project/${project.id}`);
                },
            }
        );
    };

    const handlefResultChange = (e) => {
        setFResult(e.target.value);
    };

    return (
        <Card className="max-w-2xl">
            <CardContent>
                <form onSubmit={handleSubmit} className="pt-7">
                    {/* DATE */}
                    <FormControl
                        variant="outlined"
                        className="w-full "
                        sx={{ mb: "20px" }}
                    >
                        <InputLabel htmlFor="date-outlined-label">
                            {transl("Date")}
                        </InputLabel>
                        <OutlinedInput
                            id="date-outlined-label"
                            value={fDate}
                            type={`date`}
                            onChange={(e) => setFDate(e.target.value)}
                            label={transl("Date")}
                        />
                    </FormControl>

                    {/* RESULTS */}
                    <SelectResultsProject
                        project_id={project?.id}
                        currentResult={fResult}
                        handleResultChange={handlefResultChange}
                    />

                    {/* Contact info */}
                    <TextField
                        className="w-full "
                        sx={{ mb: "20px" }}
                        id="notes-static"
                        label={transl("Contact for worker")}
                        multiline
                        rows={4}
                        required={project?.results[fResult]?.includes(
                            'contactRequired":true'
                        )}
                        defaultValue={fContact}
                        onChange={(e) => setFContact(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    />

                    {/* NOTES */}
                    <TextField
                        className="w-full "
                        sx={{ mb: "20px" }}
                        id="notes-static"
                        label={transl("Note")}
                        multiline
                        rows={4}
                        required
                        defaultValue={fNote}
                        onChange={(e) => setFNote(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    />

                    {!submitingForm ? (
                        <Button
                            type="submit"
                            variant="contained"
                            className="w-full py-4"
                        >
                            {transl("Submit")}
                        </Button>
                    ) : (
                        <CircularProgress />
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

export default SubmissionFormEdit;
