import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Header from "../components/Header";
import transl from "../../components/translate";
import sanitizeFilename from "../../components/sanitizeFilename";
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
import { useUser, useUserisLoggendIn } from "../../../hooks/useUser";
import { useEmailSender } from "../../../hooks/useEmailSender";
import { useResources } from "../../../hooks/useResource";

const MIME_XLSX =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const WORKER_SHAREHOLDER_HEADERS = [
    "no",
    "date_of_birth_code",
    "sex",
    "name",
    "prev_note",
    "shares_total",
    "address",
    "contact_info",
    "database",
    "prev_result",
    "prev_comment",
];

const WORKER_SHAREHOLDER_HEADER_LABELS = [
    "연번",
    "고유번호",
    "성별",
    "주주명",
    "비고",
    "총소유주식수",
    "주소",
    "주소서치",
    "구연락처",
    "구 판단",
    "구 멘트",
];

const normalizeAssignedWorkers = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => item?.toString().trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        return value
            .split("/")
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
};

const sanitizeWorksheetName = (value) => {
    if (!value) return "Worker";
    const sanitized = value.replace(/[\\/?*:[\]]/g, "").trim();
    return sanitized.slice(0, 31) || "Worker";
};

const getUniqueWorksheetName = (value, usedNames) => {
    const baseName = sanitizeWorksheetName(value);
    let candidate = baseName;
    let index = 2;

    while (usedNames.has(candidate)) {
        const suffix = ` (${index})`;
        const maxBaseLength = Math.max(0, 31 - suffix.length);
        candidate = `${baseName.slice(0, maxBaseLength)}${suffix}`;
        index += 1;
    }

    usedNames.add(candidate);
    return candidate;
};

function SingleEmailToWorker() {
    const { project_id } = useParams();
    const { data: project, isLoading } = useProjectWithShareholders(project_id);
    const { data: currentUser } = useUserisLoggendIn();
    const { data: usermeta } = useUser(currentUser?.id);
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

    const currentWorkerName =
        usermeta?.first_name || currentUser?.user_metadata?.first_name || "";
    const hasCurrentWorker = workers.some(
        (worker) => worker.name === currentWorkerName,
    );

    const handleDownloadShareholderSheet = async (worker) => {
        const workerName = (
            hasCurrentWorker
                ? currentWorkerName
                : worker?.name || currentWorkerName
        )
            ?.toString()
            .trim();

        if (!workerName) {
            return;
        }

        const shareholders = Array.isArray(project?.shareholder)
            ? project.shareholder
            : [];
        const assignedShareholders = shareholders.filter((shareholder) =>
            normalizeAssignedWorkers(shareholder?.user).includes(workerName),
        );

        const workbook = new ExcelJS.Workbook();
        const usedNames = new Set();
        const worksheet = workbook.addWorksheet(
            getUniqueWorksheetName(workerName, usedNames),
        );
        worksheet.addRow(WORKER_SHAREHOLDER_HEADER_LABELS);

        assignedShareholders.forEach((shareholder) => {
            const row = WORKER_SHAREHOLDER_HEADERS.map((key) => {
                const value = shareholder?.[key];
                return value === null || value === undefined ? "" : value;
            });
            worksheet.addRow(row);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const baseFilename = `${project?.title || "project"}_\uC8FC\uC8FC\uBA85\uBD80_${workerName}`;
        const filename = `${sanitizeFilename(baseFilename)}.xlsx`;

        saveAs(new Blob([buffer], { type: MIME_XLSX }), filename);
    };

    const handleDownloadAllShareholderSheets = async () => {
        const shareholders = Array.isArray(project?.shareholder)
            ? project.shareholder
            : [];
        const workbook = new ExcelJS.Workbook();
        const usedNames = new Set();
        const selectedWorkers = workers.filter((worker) =>
            selectedWorkerIds.includes(worker.id),
        );

        selectedWorkers.forEach((worker) => {
            const workerName = worker?.name?.toString().trim();
            if (!workerName) return;

            const assignedShareholders = shareholders.filter((shareholder) =>
                normalizeAssignedWorkers(shareholder?.user).includes(
                    workerName,
                ),
            );

            const worksheet = workbook.addWorksheet(
                getUniqueWorksheetName(workerName, usedNames),
            );
            worksheet.addRow(WORKER_SHAREHOLDER_HEADER_LABELS);

            assignedShareholders.forEach((shareholder) => {
                const row = WORKER_SHAREHOLDER_HEADERS.map((key) => {
                    const value = shareholder?.[key];
                    return value === null || value === undefined ? "" : value;
                });
                worksheet.addRow(row);
            });
        });

        if (workbook.worksheets.length === 0) {
            const worksheet = workbook.addWorksheet("Workers");
            worksheet.addRow(WORKER_SHAREHOLDER_HEADER_LABELS);
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const baseFilename = `${project?.title || "project"}_\uC8FC\uC8FC\uBA85\uBD80_\uC804\uCCB4`;
        const filename = `${sanitizeFilename(baseFilename)}.xlsx`;

        saveAs(new Blob([buffer], { type: MIME_XLSX }), filename);
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
                    <div className="grid grid-cols-2 gap-5 mb-2 items-center">
                        <div className="bg-white  rounded shadow block w-full ">
                            <FormControlLabel
                                className="block w-full px-2"
                                control={
                                    <Checkbox
                                        checked={allSelected}
                                        indeterminate={someSelected}
                                        onChange={handleSelectAllChange}
                                    />
                                }
                                label={transl("Select all")}
                            />
                        </div>
                        <div className="pr-2 flex justify-end">
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ whiteSpace: "nowrap" }}
                                className="flex-shrink-0 "
                                onClick={handleDownloadAllShareholderSheets}
                            >
                                명부양식 전체 다운로드
                            </Button>
                        </div>
                    </div>
                    {workers.map((worker, index) => (
                        <div
                            key={worker.id}
                            className="mb-2 bg-white  rounded shadow block w-full flex items-center"
                        >
                            <FormControlLabel
                                key={worker.id}
                                className="pl-2 w-full"
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
                            <div className="pr-2">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ whiteSpace: "nowrap" }}
                                    className="flex-shrink-0 "
                                    onClick={() =>
                                        handleDownloadShareholderSheet(worker)
                                    }
                                >
                                    명부양식 내려받기
                                </Button>
                            </div>
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
