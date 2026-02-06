import React from "react";
import { useOption, useOptionUpdate } from "../../../../hooks/useOptions";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import { Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import transl from "../../../components/translate";

function ButtonLockReceiptSubmission() {
    const { data: receiptSubmissionStatus, isLoading } = useOption(
        "receipt_submission_status",
        "value"
    );

    const updateOption = useOptionUpdate();

    const handleStatusChange = (message, status) => {
        if (window.confirm(message)) {
            updateOption.mutate(
                {
                    name: "receipt_submission_status",
                    value: status,
                    type: "value",
                },
                {
                    onSuccess: () => {
                        toast.success(transl("updated with success"), {
                            position: "top-right",
                            autoClose: 4000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    },
                }
            );
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return receiptSubmissionStatus ? (
        <Button
            variant="outlined"
            color="primary"
            onClick={() =>
                handleStatusChange(
                    transl("do you really want to lock receipt submission?"),
                    null
                )
            }
        >
            <LockIcon />
        </Button>
    ) : (
        <Button
            variant="outlined"
            color="primary"
            onClick={() =>
                handleStatusChange(
                    transl("do you really want to unlock receipt submission?"),
                    "open"
                )
            }
        >
            <LockOpenIcon />
        </Button>
    );
}

export default ButtonLockReceiptSubmission;
