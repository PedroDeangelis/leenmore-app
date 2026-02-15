import {
    Alert,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    TextField,
} from "@mui/material";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProject } from "../../../../hooks/useProject";
import { useSubmissionCreate } from "../../../../hooks/useSubmission";
import transl from "../../../components/translate";
import SelectResultsProject from "./SelectResultsProject";
import SubmissionFileUpload from "./SubmissionFileUpload";
import PhoneNumberInput from "./PhoneNumberInput";
import SubmissionPrivacyConscentFileUpload from "./SubmissionPrivacyConscentFileUpload";

function SubmissionForm({
    project_id,
    filename,
    user,
    date,
    user_id,
    shareholder,
    stayOnThePage = false,
}) {
    const [fResult, setFResult] = useState("");
    const [fNote, setFNote] = useState("");
    const [fContact, setFContact] = useState({
        value: "",
        isValid: true,
    });
    const [submitingForm, setSubmitingForm] = useState(false);
    const [alertNotes, setAlertNotes] = useState(false);
    const [alertContactWorker, setAlertContactWorker] = useState(false);
    const [alertResult, setAlertResult] = useState(false);
    const [alertAttachment, setAlertAttachment] = useState(false);
    const [alertDate, setAlertDate] = useState(false);
    const [fDate, setFDate] = useState(moment().format("Y-MM-DD"));
    const [listOfUploadedFiles, setListOfUploadedFiles] = useState([]);
    const [privacyConsentCheckbox, setPrivacyConsentCheckbox] = useState(null);
    const [privacyConsentFilePath, setPrivacyConsentFilePath] = useState(null);

    const { data: project, isLoading } = useProject(project_id);
    const submissionCreateMutation = useSubmissionCreate();

    const navigate = useNavigate();

    const handlefResultChange = (e) => {
        setFResult(e.target.value);
        setAlertResult(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let isRefused = false;

        if (!fDate) {
            setAlertDate(true);
            isRefused = true;
        } else {
            setAlertDate(false);
        }

        if (!fResult) {
            setAlertResult(true);
            isRefused = true;
        } else {
            setAlertResult(false);
        }

        if (
            project?.results[fResult]?.includes('contactRequired":true') &&
            (!fContact.value || !fContact.isValid)
        ) {
            setAlertContactWorker(true);
            isRefused = true;
        } else {
            setAlertContactWorker(false);
        }

        if (!fNote) {
            setAlertNotes(true);
            isRefused = true;
        } else {
            setAlertNotes(false);
        }

        if (
            project?.results[fResult]?.includes('attachmentRequired":true') &&
            !listOfUploadedFiles?.length
        ) {
            setAlertAttachment(true);
            isRefused = true;
        } else {
            setAlertAttachment(false);
        }

        if (isRefused) {
            return false;
        }

        setSubmitingForm(true);

        submissionCreateMutation.mutate(
            {
                data: {
                    user_id: user_id,
                    user_name: user,
                    shareholder_id: shareholder.id,
                    project_id: project_id,
                    date: fDate,
                    result: fResult,
                    contact_worker: fContact.value,
                    note: fNote,
                    files: listOfUploadedFiles,
                    privacy_consent_file: privacyConsentFilePath,
                },
            },
            {
                onSuccess: (data) => {
                    if (!stayOnThePage) {
                        window.location.href = `/app/project/${project_id}/thankyou`;
                    }

                    toast.success(transl("Project created with sucesss"), {
                        position: "top-right",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                },
            },
        );
    };

    useEffect(() => {
        setFResult("");
        setFDate(moment().format("Y-MM-DD"));
        setListOfUploadedFiles([]);
        setFResult("");
        setAlertNotes("");
        setPrivacyConsentCheckbox(null);
        setPrivacyConsentFilePath(null);
        // setSubmitingForm('');
    }, []);

    return (
        <>
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
                        onChange={(e) => {
                            setFDate(e.target.value);
                            if (alertDate) setAlertDate(false);
                        }}
                        required
                        label={transl("Date")}
                    />
                    {alertDate && (
                        <FormHelperText error sx={{ ml: 0 }}>
                            실제 사용한 영수증 날짜를 기입해주세요.
                        </FormHelperText>
                    )}
                </FormControl>
                {/* RESULTS */}
                {alertResult && (
                    <Alert severity="error">
                        {transl("Results is a required field")}
                    </Alert>
                )}
                <SelectResultsProject
                    project_id={project_id}
                    currentResult={fResult}
                    handleResultChange={handlefResultChange}
                />
                {/* Contact info */}
                {alertContactWorker && (
                    <Alert severity="error">
                        {transl(
                            "The current result requires contact information for the worker",
                        )}
                    </Alert>
                )}
                <SubmissionPrivacyConscentFileUpload
                    privacyConsentCheckbox={privacyConsentCheckbox}
                    setPrivacyConsentCheckbox={setPrivacyConsentCheckbox}
                    project={project}
                    filename={`${shareholder.name}_${shareholder.date_of_birth_code}`}
                    privacyConsentFilePath={privacyConsentFilePath}
                    setPrivacyConsentFilePath={setPrivacyConsentFilePath}
                />
                <PhoneNumberInput
                    required={project?.results[fResult]?.includes(
                        'contactRequired":true',
                    )}
                    onChange={(payload) => {
                        setFContact(payload);
                        if (alertContactWorker && payload.isValid) {
                            setAlertContactWorker(false);
                        }
                    }}
                    showError={alertContactWorker}
                />
                {/* NOTES */}
                {alertNotes && (
                    <Alert severity="error">
                        {transl("Note is a required field")}
                    </Alert>
                )}
                <TextField
                    className="w-full "
                    sx={{ mb: "20px" }}
                    id="notes-static"
                    label={transl("Note")}
                    multiline
                    rows={4}
                    onChange={(e) => setFNote(e.target.value)}
                    value={fNote}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                        }

                        if (alertNotes) {
                            setAlertNotes(false);
                        }
                    }}
                />
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {alertAttachment && (
                            <Alert severity="error">
                                {transl(
                                    "Please attach the required file before submitting the form",
                                )}
                            </Alert>
                        )}
                        <SubmissionFileUpload
                            listOfUploadedFiles={listOfUploadedFiles}
                            setListOfUploadedFiles={setListOfUploadedFiles}
                            filename={filename}
                            user={user}
                            project={project}
                            date={date}
                            project_id={project_id}
                            fResult={fResult}
                            setAlertAttachment={setAlertAttachment}
                        />
                    </>
                )}
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
        </>
    );
}

export default SubmissionForm;
