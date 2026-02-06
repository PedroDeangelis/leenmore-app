import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import transl from "../../../components/translate";
import { useProjecUpdate } from "../../../../hooks/useProject";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";

function ProjectMessageEditing({ message, projectID }) {
    const [isEditMessage, setIsEditMessage] = useState(false);
    const inputRef = useRef(null);
    const projectUpdateMutation = useProjecUpdate();

    useEffect(() => {
        if (isEditMessage) {
            inputRef.current?.focus();
        }
    }, [isEditMessage]);

    const handleMessageSet = (value) => {
        projectUpdateMutation.mutate(
            {
                project_id: projectID,
                meta: {
                    message: value,
                },
            },
            {
                onSuccess: (data) => {
                    toast.success(transl("Project updated with success"), {
                        position: "top-right",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    setIsEditMessage(false);
                },
            }
        );
    };

    const handleMessageEditing = () => {
        if (isEditMessage) {
            handleMessageSet(inputRef.current.value);
        }
        setIsEditMessage(!isEditMessage);
    };

    return (
        <div
            className={`col-span-2 border border-slate-300 rounded p-4 flex items-center justify-between ${
                isEditMessage && "bg-white"
            }`}
        >
            {isEditMessage ? (
                <input
                    type="text"
                    className="w-full"
                    defaultValue={message}
                    ref={inputRef}
                />
            ) : message ? (
                <p className="text-sm ">{message}</p>
            ) : (
                <p className="text-sm text-slate-500">
                    {transl("No message displaying")}
                </p>
            )}

            {projectUpdateMutation.isLoading ? (
                <CircularProgress
                    className="flex-shrink-0"
                    sx={{ padding: "2px", minWidth: 0, ml: 2 }}
                    size={24}
                />
            ) : (
                <Button
                    className="flex-shrink-0"
                    variant="text"
                    sx={{ padding: "2px", minWidth: 0, ml: 2 }}
                    onClick={() => handleMessageEditing()}
                >
                    {isEditMessage ? <SaveIcon /> : <EditIcon />}
                </Button>
            )}
        </div>
    );
}

export default ProjectMessageEditing;
