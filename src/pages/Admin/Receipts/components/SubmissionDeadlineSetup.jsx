import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";
import {
    Button,
    CircularProgress,
    FormControl,
    TextField,
} from "@mui/material";
import { useOption, useOptionUpdate } from "../../../../hooks/useOptions";
import { toast } from "react-toastify";

function SubmissionDeadlineSetup({ close }) {
    const { data: deadline, isLoading } = useOption(
        "submission_deadline",
        "value"
    );
    const [newDeadline, setNewDeadline] = useState("");

    const updateOption = useOptionUpdate();

    const handleSaveDeadline = () => {
        updateOption.mutate(
            {
                name: "submission_deadline",
                value: newDeadline,
                type: "value",
            },
            {
                onSuccess: (data) => {
                    toast.success(
                        transl("submission deadline updated with success"),
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
                    close();
                },
            }
        );
    };

    useEffect(() => {
        setNewDeadline(deadline);
    }, [deadline]);

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div className="bg-slate-200 p-4 rounded mb-4">
            <p className="text-center text-lg text-slate-500 mb-1">
                {transl("current submission deadline")}
            </p>
            <p className="text-center p-3 bg-slate-100 text-slate-600">
                {deadline}
            </p>
            <p className="text-center text-lg text-slate-500 mb-1 mt-10">
                {transl("set new submission deadline")}
            </p>
            <FormControl variant="outlined" className="w-full">
                <TextField
                    id="submission-deadline-input"
                    label={transl("submission deadline")}
                    variant="outlined"
                    multiline
                    rows={4}
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                />
            </FormControl>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                className="w-full"
                onClick={() => handleSaveDeadline()}
            >
                {transl("save")}
            </Button>
        </div>
    );
}

export default SubmissionDeadlineSetup;
