import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import DataDisplay from "../../components/DataDisplay";
import transl from "../../../components/translate";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import { useProjecUpdate } from "../../../../hooks/useProject";

function EditProjectLinkMangeId({ project }) {
    const [isEditing, setIsEditing] = useState(false);
    const [linkManageId, setLinkManageId] = useState(
        project?.link_manage_id || "",
    );
    const inputRef = useRef(null);
    const projectUpdateMutation = useProjecUpdate();

    useEffect(() => {
        setLinkManageId(project?.link_manage_id || "");
    }, [project?.link_manage_id]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const updateProjectsCache = async () => {
        try {
            await axios.post(
                `${process.env.REACT_APP_STORAGE_PATH}update-supabase-projects-cache`,
                // `https://leenmore-storage.lndo.site/update-supabase-projects-cache`,
                {
                    project_id: project.id,
                    token: process.env.REACT_APP_STORAGE_AUTH_KEY,
                },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            return true;
        } catch (error) {
            console.error("updateProjectsCache error", error);
            return false;
        }
    };

    const handleSave = () => {
        const nextValue = inputRef.current?.value?.trim() || "";
        const currentValue = (linkManageId || "").trim();

        if (nextValue === currentValue) {
            setLinkManageId(nextValue);
            setIsEditing(false);
            return;
        }

        projectUpdateMutation.mutate(
            {
                project_id: project.id,
                meta: {
                    link_manage_id: nextValue || null,
                },
            },
            {
                onSuccess: async () => {
                    setLinkManageId(nextValue);
                    setIsEditing(false);

                    toast.success(transl("Project updated with success"), {
                        position: "top-right",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    const isCacheUpdated = await updateProjectsCache();

                    if (!isCacheUpdated) {
                        toast.warn(
                            transl("Project updated but cache refresh failed"),
                            {
                                position: "top-right",
                                autoClose: 4000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            },
                        );
                    }
                },
            },
        );
    };

    const handleEditToggle = () => {
        if (isEditing) {
            handleSave();
            return;
        }

        setIsEditing(true);
    };

    return (
        <Card>
            <CardContent>
                <DataDisplay label={transl("eSignon ID")}>
                    <span className="inline-flex w-full items-center">
                        {isEditing ? (
                            <input
                                type="text"
                                className="flex-1 min-w-0 border border-slate-300 rounded px-2 py-1 text-base"
                                defaultValue={linkManageId}
                                ref={inputRef}
                            />
                        ) : (
                            <span className="flex-1 min-w-0">
                                {linkManageId || transl("Not Set")}
                            </span>
                        )}
                        {projectUpdateMutation.isLoading ? (
                            <CircularProgress
                                className="align-middle ml-2"
                                size={20}
                                sx={{ ml: 1 }}
                            />
                        ) : (
                            <Button
                                onClick={handleEditToggle}
                                sx={{ minWidth: 0, ml: 1 }}
                            >
                                {isEditing ? <SaveIcon /> : <EditIcon />}
                            </Button>
                        )}
                    </span>
                </DataDisplay>
            </CardContent>
        </Card>
    );
}

export default EditProjectLinkMangeId;
