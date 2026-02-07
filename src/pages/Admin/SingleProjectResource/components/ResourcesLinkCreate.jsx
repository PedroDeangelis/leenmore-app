import React, { useState } from "react";
import transl from "../../../components/translate";
import { Button, Card, CardContent, TextField } from "@mui/material";
import { useResourceCreate } from "../../../../hooks/useResource";
import { toast } from "react-toastify";

function ResourcesLinkCreate({ project }) {
    const createResourceMutation = useResourceCreate();
    const [website, setWebsite] = useState("");
    const [content, setContent] = useState("");

    const normalizeUrl = (value) => {
        const trimmed = value.trim();
        if (!trimmed) {
            return "";
        }
        if (/^https?:\/\//i.test(trimmed)) {
            return trimmed;
        }
        return `https://${trimmed}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!project?.id) {
            return;
        }

        const url = normalizeUrl(website);
        const title = content.trim();

        if (!url || !title) {
            toast.error(transl("please fill all fields"), {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        createResourceMutation.mutate(
            {
                resource: {
                    title: title,
                    path: url,
                    attachedTo: "project",
                    parentId: project.id,
                },
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
                    setWebsite("");
                    setContent("");
                },
            }
        );
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <p className="text-lg mb-3">{transl("insert link button")}</p>
                <form onSubmit={handleSubmit}>
                    <TextField
                        required={true}
                        type="url"
                        label={transl("website address")}
                        variant="outlined"
                        sx={{ width: "100%", mb: 1 }}
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                    <TextField
                        required={true}
                        label={transl("content")}
                        variant="outlined"
                        sx={{ width: "100%" }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <p className="text-right">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                            disabled={createResourceMutation.isLoading}
                        >
                            {transl("insert link button")}
                        </Button>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}

export default ResourcesLinkCreate;
