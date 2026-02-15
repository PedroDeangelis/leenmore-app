import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import transl from "../../components/translate";
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    TextField,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useProjectWithShareholders } from "../../../hooks/useProject";
import { useUserisLoggendIn } from "../../../hooks/useUser";
import { useEmailSender } from "../../../hooks/useEmailSender";
import { useResources } from "../../../hooks/useResource";

function SingleEmailToWorker() {
    const { project_id } = useParams();
    const { data: project, isLoading } = useProjectWithShareholders(project_id);
    const { data: currentUser } = useUserisLoggendIn();
    const emailSender = useEmailSender();
    const { data: resources, isLoading: isResourcesLoading } = useResources(
        project_id,
        "project",
    );
    const [workers, setWorkers] = useState([]);
    const [selectedWorkerIds, setSelectedWorkerIds] = useState([]);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [selectedLinkIds, setSelectedLinkIds] = useState([]);
    const [selectedAttachmentIds, setSelectedAttachmentIds] = useState([]);
    // const workers

    useEffect(() => {
        const shareholders = project?.shareholder;

        if (!Array.isArray(shareholders)) {
            setWorkers([]);
            setSelectedWorkerIds([]);
            return;
        }

        let uniqueWorkers = shareholders
            .flatMap((s) => {
                const u = s.user;
                if (!u) return [];
                return Array.isArray(u) ? u : [u]; // support both array + single user
            })
            .filter(Boolean);

        uniqueWorkers = [...new Set(uniqueWorkers)].map((worker, index) => ({
            id: worker, // better than index (stable + unique)
            name: worker,
            hidden: false,
        }));

        setWorkers(uniqueWorkers);
        setSelectedWorkerIds((prev) =>
            prev.filter((id) =>
                uniqueWorkers.some((worker) => worker.id === id),
            ),
        );
    }, [project]);

    const handleWorkerToggle = (workerId) => (event) => {
        const { checked } = event.target;
        setSelectedWorkerIds((prev) => {
            if (checked) {
                return prev.includes(workerId) ? prev : [...prev, workerId];
            }
            return prev.filter((id) => id !== workerId);
        });
    };

    const selectedCount = selectedWorkerIds.filter((id) =>
        workers.some((worker) => worker.id === id),
    ).length;
    const allSelected = workers.length > 0 && selectedCount === workers.length;
    const someSelected = selectedCount > 0 && selectedCount < workers.length;

    const handleSelectAllChange = (event) => {
        const { checked } = event.target;
        if (checked) {
            setSelectedWorkerIds(workers.map((worker) => worker.id));
            return;
        }
        setSelectedWorkerIds([]);
    };

    const isLinkResource = (resource) => {
        if (resource?.type === "link" || resource?.url) {
            return true;
        }
        const path = resource?.path || "";
        return /^https?:\/\//i.test(path);
    };

    useEffect(() => {
        if (!Array.isArray(resources)) {
            setSelectedLinkIds([]);
            setSelectedAttachmentIds([]);
            return;
        }

        const nextLinkIds = resources
            .filter(isLinkResource)
            .map((resource) => resource.id);
        const nextAttachmentIds = resources
            .filter((resource) => !isLinkResource(resource))
            .map((resource) => resource.id);

        setSelectedLinkIds((prev) =>
            prev.filter((id) => nextLinkIds.includes(id)),
        );
        setSelectedAttachmentIds((prev) =>
            prev.filter((id) => nextAttachmentIds.includes(id)),
        );
    }, [resources]);

    const resourceList = Array.isArray(resources) ? resources : [];
    const linkResources = resourceList.filter(isLinkResource);
    const attachmentResources = resourceList.filter(
        (resource) => !isLinkResource(resource),
    );

    const handleLinkToggle = (resourceId) => (event) => {
        const { checked } = event.target;
        setSelectedLinkIds((prev) => {
            if (checked) {
                return prev.includes(resourceId) ? prev : [...prev, resourceId];
            }
            return prev.filter((id) => id !== resourceId);
        });
    };

    const handleAttachmentToggle = (resourceId) => (event) => {
        const { checked } = event.target;
        setSelectedAttachmentIds((prev) => {
            if (checked) {
                return prev.includes(resourceId) ? prev : [...prev, resourceId];
            }
            return prev.filter((id) => id !== resourceId);
        });
    };

    const canSend =
        selectedWorkerIds.length > 0 &&
        subject.trim().length > 0 &&
        message.trim().length > 0 &&
        !!currentUser?.id;

    const handleSendEmail = () => {
        if (!canSend || emailSender.isLoading) {
            return;
        }

        const linksPayload = linkResources
            .filter((resource) => selectedLinkIds.includes(resource.id))
            .map((resource) => ({
                title: resource.title || resource.name || resource.url || "",
                url: resource.url || resource.path || "",
            }))
            .filter((link) => link.url);

        const attachmentsPayload = attachmentResources
            .filter((resource) => selectedAttachmentIds.includes(resource.id))
            .map((resource) => ({
                resource_id: resource.id,
                filename: resource.title || "",
                file_path:
                    `${process.env.REACT_APP_STORAGE_PATH}` + resource.path ||
                    "",
            }));

        emailSender.mutate(
            {
                project_id,
                current_user_id: currentUser?.id,
                workers: selectedWorkerIds,
                subject: subject.trim(),
                message: message.trim(),
                links: linksPayload,
                attachments: attachmentsPayload,
            },
            {
                onSuccess: () => {
                    setSubject("");
                    setMessage("");
                },
            },
        );
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <Header title={`${transl("Email to worker")}: ${project.title}`}>
                <Button variant="text">
                    <Link to={`/dashboard/email-to-worker`}>
                        {transl("Go Back")}
                    </Link>
                </Button>
            </Header>
            <div className="grid grid-cols-2 gap-10 items-start mb-10">
                <div>
                    <FormControlLabel
                        className="mb-2 bg-white  rounded shadow block w-full"
                        control={
                            <Checkbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={handleSelectAllChange}
                            />
                        }
                        label={transl("Select all")}
                    />
                    {workers.map((worker, index) => (
                        <div key={worker.id}>
                            <FormControlLabel
                                key={worker.id}
                                className="mb-2 bg-white  rounded shadow block w-full"
                                control={
                                    <Checkbox
                                        checked={selectedWorkerIds.includes(
                                            worker.id,
                                        )}
                                        onChange={handleWorkerToggle(worker.id)}
                                    />
                                }
                                label={worker.name}
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <Card className=" ">
                        <CardContent>
                            <TextField
                                label={transl("Email Subject")}
                                variant="outlined"
                                sx={{ width: "100%" }}
                                value={subject}
                                onChange={(event) =>
                                    setSubject(event.target.value)
                                }
                            />

                            <FormControl
                                variant="outlined"
                                className="w-full "
                                sx={{ mt: "20px" }}
                            >
                                <TextField
                                    id="outlined-multiline-static"
                                    label={transl("Email Message")}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    value={message}
                                    onChange={(event) =>
                                        setMessage(event.target.value)
                                    }
                                />
                            </FormControl>
                            <p className="text-right">
                                <Button
                                    variant="contained"
                                    sx={{ mt: "20px" }}
                                    disabled={!canSend || emailSender.isLoading}
                                    onClick={handleSendEmail}
                                >
                                    {transl("Send Email")}
                                </Button>
                            </p>
                        </CardContent>
                    </Card>

                    <div className="mt-6">
                        <p className="font-semibold mb-2">{transl("Links")}</p>
                        <div className="grid grid-cols-1 gap-2">
                            {isResourcesLoading ? (
                                <CircularProgress size={20} />
                            ) : linkResources.length > 0 ? (
                                linkResources.map((resource) => (
                                    <FormControlLabel
                                        key={resource.id}
                                        className="block w-full bg-white rounded shadow"
                                        control={
                                            <Checkbox
                                                checked={selectedLinkIds.includes(
                                                    resource.id,
                                                )}
                                                onChange={handleLinkToggle(
                                                    resource.id,
                                                )}
                                            />
                                        }
                                        label={`${resource.title} (${resource.path})`}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    {transl("No links found")}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="font-semibold mb-2">
                            {transl("Attachments")}
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                            {isResourcesLoading ? (
                                <CircularProgress size={20} />
                            ) : attachmentResources.length > 0 ? (
                                attachmentResources.map((resource) => (
                                    <FormControlLabel
                                        key={resource.id}
                                        className="block w-full bg-white rounded shadow"
                                        control={
                                            <Checkbox
                                                checked={selectedAttachmentIds.includes(
                                                    resource.id,
                                                )}
                                                onChange={handleAttachmentToggle(
                                                    resource.id,
                                                )}
                                            />
                                        }
                                        label={
                                            resource.title ||
                                            resource.name ||
                                            resource.path
                                        }
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    {transl("No attachments found")}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleEmailToWorker;
