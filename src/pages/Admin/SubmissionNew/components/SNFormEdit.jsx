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
import React, { useState } from "react";
import transl from "../../../components/translate";
import moment from "moment";
import SelectResultsProject from "../../../Worker/SingleShareholderApp/SubmissionForm/SelectResultsProject";
import { useSubmissionUpdate } from "../../../../hooks/useSubmission";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { submissionEditAtom } from "../../../../helpers/atom";
import { useEffect } from "react";
import SelectResultsWorker from "./SelectResultsWorker";
import AttachmentPreviewDialog from "../../SingleSubmission/components/AttachmentPreviewDialog";

function SNFormEdit({ submission }) {
    const [date, setDate] = useState(moment(submission.date).format("Y-MM-DD"));
    const [result, setResult] = useState(submission.result);
    const [contactWorker, setContactWorker] = useState(
        submission.contact_worker
    );
    const [note, setNote] = useState(submission.note);
    const [submitingForm, setSubmitingForm] = useState(false);
    const submissionUpdateMutation = useSubmissionUpdate();
    const [, setSubmissionEdit] = useAtom(submissionEditAtom);
    const [previewFile, setPreviewFile] = useState(null);
    const [worker, setWorker] = useState(() => {
        return {
            id: submission.user_id,
            first_name: submission.user_name,
        };
    });

    console.log('submission', submission)
    const [attachments, setAttachments] = useState(submission.files || []);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitingForm(true);

        submissionUpdateMutation.mutate(
            {
                data: {
                    result: result,
                    note: note,
                    contact_worker: contactWorker,
                    date: date,
                    id: submission.id,
                    user_id: worker.id,
                    user_name: worker.first_name,
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

                    setSubmissionEdit(null);
                },
            }
        );
    };

    const handlefResultChange = (e) => {
        setResult(e.target.value);
    };

    const handleCancelCurrentEdting = () => {
        setSubmissionEdit(null);
    };

    const handleWorkerChange = (value) => {
        setWorker((prevWorker) => ({
            ...prevWorker,
            ...value,
        }));
    };

    const handleDownload = async (file) => {
        const url = `${process.env.REACT_APP_STORAGE_PATH}${file}`;
        const res = await fetch(url);
        const blob = await res.blob();

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.split("/").pop() || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
    };

    const handlePreview = (file) => {
        setPreviewFile(file);
    };

    useEffect(() => {
        setResult(submission.result);
        setContactWorker(submission.contact_worker);
        setNote(submission.note);
        setDate(moment(submission.date).format("Y-MM-DD"));
        setWorker({
            id: submission.user_id,
            first_name: submission.user_name,
        });
        setAttachments(submission.files || []);
    }, [submission]);

    return (
        <Card>
            <CardContent>
                <div className="flex justify-between items-center mb-6">
                    <p className=" font-bold text-base text-center text-slate-500">
                        {submission.user_name}
                    </p>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCancelCurrentEdting}
                    >
                        {transl("cancel editing")}
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* WORKER */}
                    <SelectResultsWorker
                        worker={worker}
                        handleWorkerChange={handleWorkerChange}
                    />

                    {/* DATE */}
                    <FormControl
                        variant="outlined"
                        className="w-full "
                        sx={{ mb: "10px" }}
                    >
                        <InputLabel htmlFor="date-outlined-label">
                            {transl("Date")}
                        </InputLabel>
                        <OutlinedInput
                            id="date-outlined-label"
                            value={date}
                            type={`date`}
                            onChange={(e) => setDate(e.target.value)}
                            label={transl("Date")}
                        />
                    </FormControl>

                    {/* RESULTS */}
                    <SelectResultsProject
                        project_id={submission?.project_id}
                        currentResult={result}
                        handleResultChange={handlefResultChange}
                    />

                    {/* CONTACT FOR WORKER */}
                    <TextField
                        className="w-full "
                        sx={{ mb: "10px" }}
                        id="notes-static"
                        label={transl("Contact for worker")}
                        multiline
                        rows={4}
                        value={contactWorker}
                        onChange={(e) => setContactWorker(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    />

                    {/* NOTES */}
                    <TextField
                        className="w-full "
                        sx={{ mt: "10px", mb: "20px" }}
                        id="notes-static"
                        label={transl("Note")}
                        multiline
                        rows={4}
                        required
                        value={note}
                        onChange={(e) => {
                            setNote(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    />

                    {/* List attachments and option to download */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                    {
                        attachments.length > 0 && (
                            attachments.map((file, index) => (
                                <div key={index} className="relative ">     
                                    {
                                        // check if file is an image
                                        (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif')) ? (                                                                       
                                            <img
                                                src={`${process.env.REACT_APP_STORAGE_PATH}${file}`}
                                                alt="attachment preview"
                                                className="mb-2"
                                            />) : (
                                                <span></span>
                                            )
                                    }   
                                    <div className="grid grid-cols-2 gap-2 item-center"> 
                                    <Button
                                        onClick={() => handleDownload(file)}
                                        variant="outlined"
                                        size="small"
                                        >
                                        {transl("Download")}
                                    </Button>
                                    <Button 
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handlePreview(file)}
                                        >
                                        {transl("Preview")}
                                    </Button>
                                    </div>
                                </div>
                            ))
                        )
                    }
                    </div>
                    <AttachmentPreviewDialog
                        open={Boolean(previewFile)}
                        onClose={() => setPreviewFile(null)}
                        files={previewFile}
                    />

                    {!submitingForm ? (
                        <Button
                            type="submit"
                            variant="contained"
                            className="w-full py-4"
                        >
                            {transl("Update")}
                        </Button>
                    ) : (
                        <CircularProgress />
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

export default SNFormEdit;
