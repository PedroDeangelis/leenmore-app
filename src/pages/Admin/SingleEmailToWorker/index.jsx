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
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useProjectWithShareholders } from "../../../hooks/useProject";
import { useUser, useUserisLoggendIn } from "../../../hooks/useUser";
import { useEmailSender } from "../../../hooks/useEmailSender";
import { useResources } from "../../../hooks/useResource";
import { useExcelGenerator } from "../../../hooks/useExcelGenerator";
import { toast } from "react-toastify";

function SingleEmailToWorker() {
    const { project_id } = useParams();
    const { data: project, isLoading } = useProjectWithShareholders(project_id);
    const { data: currentUser } = useUserisLoggendIn();
    const { data: usermeta } = useUser(currentUser?.id);
    const emailSender = useEmailSender();
    const excelGenerator = useExcelGenerator();
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
    const [includeWorkerReportXLSL, setIncludeWorkerReportXLSL] =
        useState(true);
    const [includeWorkerReportPDF, setIncludeWorkerReportPDF] = useState(true);
    const [isSendingEmails, setIsSendingEmails] = useState(false);
    const [sortColumn, setSortColumn] = useState("a");
    const [sortOrder, setSortOrder] = useState("asc");
    const [downloadType, setDownloadType] = useState("excel");
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

    const canSend =
        selectedWorkerIds.length > 0 &&
        subject.trim().length > 0 &&
        message.trim().length > 0 &&
        !!currentUser?.id;

    const getSortValue = (shareholder, column) => {
        switch (column) {
            case "a":
                return shareholder?.no ?? "";
            case "b":
                return shareholder?.date_of_birth_code ?? "";
            case "c":
                return shareholder?.sex ?? "";
            case "d":
                return shareholder?.name ?? "";
            case "e":
                return shareholder?.prev_note ?? "";
            case "f":
                return shareholder?.shares_total ?? "";
            case "g":
                return shareholder?.address ?? "";
            case "h":
                return shareholder?.contact_info ?? "";
            case "i":
                return shareholder?.database ?? "";
            case "j":
                return shareholder?.prev_result ?? "";
            case "k":
                return shareholder?.prev_comment ?? "";
            default:
                return "";
        }
    };

    const parseSortableNumber = (value) => {
        if (value === null || value === undefined) {
            return NaN;
        }
        const cleaned = String(value).replace(/[^0-9.-]/g, "");
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : NaN;
    };

    const sortWorkerShareholders = (items) => {
        if (!Array.isArray(items)) {
            return [];
        }
        const column = sortColumn;
        if (!column) {
            return items;
        }

        const orderMultiplier = sortOrder === "desc" ? -1 : 1;
        return [...items].sort((a, b) => {
            const rawA = getSortValue(a, column);
            const rawB = getSortValue(b, column);

            if (column === "a" || column === "f") {
                const numA = parseSortableNumber(rawA);
                const numB = parseSortableNumber(rawB);
                if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
                    if (numA === numB) return 0;
                    return numA > numB ? orderMultiplier : -orderMultiplier;
                }
            }

            const strA = (rawA ?? "").toString();
            const strB = (rawB ?? "").toString();
            return (
                strA.localeCompare(strB, undefined, {
                    numeric: true,
                    sensitivity: "base",
                }) * orderMultiplier
            );
        });
    };

    const handleSendEmail = async () => {
        if (
            !canSend ||
            emailSender.isLoading ||
            excelGenerator.isLoading ||
            isSendingEmails
        ) {
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

        const trimmedSubject = subject.trim();
        const trimmedMessage = message.trim();
        const storagePath = process.env.REACT_APP_STORAGE_PATH || "";
        const shouldIncludeWorkerReport =
            includeWorkerReportXLSL || includeWorkerReportPDF;

        const sendEmailToWorkers = async (
            workers,
            links,
            includeWorkerReportXLSL,
            includeWorkerReportPDF,
        ) => {
            await emailSender.mutateAsync({
                project_id,
                current_user_id: currentUser?.id,
                workers,
                subject: trimmedSubject,
                message: trimmedMessage,
                links,
                attachments: attachmentsPayload,
                include_worker_report_xlsl: includeWorkerReportXLSL,
                include_worker_report_pdf: includeWorkerReportPDF,
            });
        };

        setIsSendingEmails(true);
        let didSend = false;
        try {
            if (!shouldIncludeWorkerReport) {
                await sendEmailToWorkers(
                    selectedWorkerIds,
                    linksPayload,
                    false,
                    false,
                );
                setSubject("");
                setMessage("");
                didSend = true;
                return;
            }

            for (const workerId of selectedWorkerIds) {
                const workerName = workerId;
                const workerShareholders = getWorkerShareholders(workerName);
                let reportUrlXlsx = null;
                let reportUrlPdf = null;

                if (workerShareholders.length) {
                    try {
                        const reportResponse = await excelGenerator.mutateAsync(
                            {
                                project_id,
                                filename: `${project?.title || "project"}_주주명부_${workerName}`,
                                data: {
                                    sheet_name: workerName,
                                    rows: workerShareholders.map(
                                        buildWorkerReportPayload,
                                    ),
                                },
                            },
                        );
                        const xlsxPath = reportResponse?.xlsx_path;
                        const pdfPath = reportResponse?.pdf_path;
                        if (xlsxPath) {
                            reportUrlXlsx = `${storagePath}${xlsxPath}`;
                        }
                        if (pdfPath) {
                            reportUrlPdf = `${storagePath}${pdfPath}`;
                        }
                    } catch (error) {
                        reportUrlXlsx = null;
                        reportUrlPdf = null;
                    }
                }

                await sendEmailToWorkers(
                    [workerId],
                    linksPayload,
                    includeWorkerReportXLSL ? reportUrlXlsx : false,
                    includeWorkerReportPDF ? reportUrlPdf : false,
                );
            }

            setSubject("");
            setMessage("");
            didSend = true;
        } finally {
            setIsSendingEmails(false);
            if (didSend) {
                toast.success("Email sent successfully");
            }
        }
    };

    const getWorkerShareholders = (workerName) => {
        if (!workerName || !Array.isArray(project?.shareholder)) {
            return [];
        }

        const filtered = project.shareholder.filter((shareholder) => {
            const assignedWorkers = shareholder?.user;
            if (Array.isArray(assignedWorkers)) {
                return assignedWorkers.includes(workerName);
            }
            if (typeof assignedWorkers === "string") {
                return assignedWorkers === workerName;
            }
            return false;
        });

        return sortWorkerShareholders(filtered);
    };

    const buildWorkerReportPayload = (shareholder) => ({
        a: shareholder?.no ?? "",
        b: shareholder?.date_of_birth_code
            ? `${shareholder?.name}${shareholder?.date_of_birth_code}`
            : "",
        c: shareholder?.sex ?? "",
        d: shareholder?.name ?? "",
        e: shareholder?.prev_note ?? "",
        f: shareholder?.shares_total ?? "",
        g: shareholder?.address ?? "",
        h: shareholder?.contact_info ?? "",
        i: shareholder?.database ?? "",
        j: shareholder?.prev_result ?? "",
        k: shareholder?.prev_comment ?? "",
    });

    const getDownloadFilename = (payloadFilename, xlsxPath, isPdf) => {
        if (isPdf) {
            return payloadFilename.endsWith(".pdf")
                ? payloadFilename
                : `${payloadFilename}.pdf`;
        }

        if (payloadFilename) {
            return payloadFilename.endsWith(".xlsx")
                ? payloadFilename
                : `${payloadFilename}.xlsx`;
        }

        const fallbackName = xlsxPath?.split("/").filter(Boolean).pop();
        return fallbackName || "worker-report.xlsx";
    };

    const downloadFromUrl = (url, filename) => {
        if (!url) {
            return;
        }

        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveBlob(blob, filename);
                    return;
                }
                const link = document.createElement("a");
                const objectUrl = window.URL.createObjectURL(blob);
                link.href = objectUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    window.URL.revokeObjectURL(objectUrl);
                    document.body.removeChild(link);
                }, 0);
            })
            .catch(() => {
                const link = document.createElement("a");
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                }, 0);
            });
    };

    const handleDownloadWorkerReport = (workerName) => {
        if (!workerName || excelGenerator.isLoading) {
            return;
        }

        const workerShareholders = getWorkerShareholders(workerName);
        if (!workerShareholders.length) {
            return;
        }

        excelGenerator.mutate(
            {
                project_id,
                filename: `${project?.title || "project"}_주주명부_${workerName}`,
                data: {
                    sheet_name: workerName,
                    rows: workerShareholders.map(buildWorkerReportPayload),
                },
            },
            {
                onSuccess: (resp) => {
                    let filePath = resp?.xlsx_path;
                    let isPdf = false;

                    if (!filePath) {
                        return;
                    }

                    if (downloadType == "pdf" && resp.pdf_path) {
                        filePath = resp.pdf_path;
                        isPdf = true;
                    }

                    const storagePath =
                        process.env.REACT_APP_STORAGE_PATH || "";
                    const downloadUrl = `${storagePath}${filePath}`;
                    const filename = getDownloadFilename(
                        resp?.filename,
                        filePath,
                        isPdf,
                    );
                    downloadFromUrl(downloadUrl, filename);
                },
            },
        );
    };

    const handleMultiWorkerToggle = async () => {
        if (excelGenerator.isLoading) {
            return;
        }

        const workerIds = selectedWorkerIds.length
            ? selectedWorkerIds
            : workers.map((worker) => worker.id);

        if (!workerIds.length) {
            return;
        }

        const users = workerIds
            .map((workerId) => {
                const workerName = workerId;
                const workerShareholders = getWorkerShareholders(workerName);
                if (!workerShareholders.length) {
                    return null;
                }

                return {
                    sheet_name: workerName,
                    rows: workerShareholders.map(buildWorkerReportPayload),
                };
            })
            .filter(Boolean);

        if (!users.length) {
            return;
        }

        try {
            const resp = await excelGenerator.mutateAsync({
                project_id,
                filename: `${project?.title || "project"}_????_multi-worker`,
                data: users,
                multiple: true,
            });

            const xlsxPath = resp?.xlsx_path;
            if (!xlsxPath) {
                return;
            }

            const storagePath = process.env.REACT_APP_STORAGE_PATH || "";
            const downloadUrl = `${storagePath}${xlsxPath}`;
            const filename = getDownloadFilename(resp?.filename, xlsxPath);
            downloadFromUrl(downloadUrl, filename);
        } catch (error) {
            return;
        }
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
                    <div className="grid grid-cols-3 gap-5 mb-5">
                        <FormControl sx={{ width: "100%" }}>
                            <InputLabel id="demo-simple-select-label">
                                {transl("Sort Column")}
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                required={true}
                                label={transl("Sort Column")}
                                value={sortColumn}
                                onChange={(event) =>
                                    setSortColumn(event.target.value)
                                }
                            >
                                <MenuItem value="a">연번</MenuItem>
                                <MenuItem value="b">고유번호</MenuItem>
                                <MenuItem value="c">성별</MenuItem>
                                <MenuItem value="d">주주명</MenuItem>
                                <MenuItem value="e">비고</MenuItem>
                                <MenuItem value="f">총소유주식수</MenuItem>
                                <MenuItem value="g">주소</MenuItem>
                                <MenuItem value="h">주소서치</MenuItem>
                                <MenuItem value="i">구연락처</MenuItem>
                                <MenuItem value="j">구 판단</MenuItem>
                                <MenuItem value="k">구 멘트</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: "100%" }}>
                            <InputLabel id="demo-simple-select-label">
                                {transl("Sort Order")}
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                required={true}
                                label={transl("Sort Order")}
                                value={sortOrder}
                                onChange={(event) =>
                                    setSortOrder(event.target.value)
                                }
                            >
                                <MenuItem value="asc">
                                    {transl("Ascending")}
                                </MenuItem>
                                <MenuItem value="desc">
                                    {transl("Descending")}
                                </MenuItem>
                            </Select>
                        </FormControl>
                        {/* Download EXCEL / PDF */}
                        <FormControl sx={{ width: "100%" }}>
                            <InputLabel id="download-type">
                                {transl("Download Type")}
                            </InputLabel>
                            <Select
                                labelId="download-type"
                                id="download-type-select"
                                label={transl("Download Type")}
                                value={downloadType}
                                onChange={(event) =>
                                    setDownloadType(event.target.value)
                                }
                            >
                                <MenuItem value="excel">Excel</MenuItem>
                                <MenuItem value="pdf">PDF</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
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
                                onClick={handleMultiWorkerToggle}
                                disabled={excelGenerator.isLoading}
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
                                        handleDownloadWorkerReport(worker.id)
                                    }
                                    disabled={excelGenerator.isLoading}
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
                                    disabled={
                                        !canSend ||
                                        emailSender.isLoading ||
                                        excelGenerator.isLoading ||
                                        isSendingEmails
                                    }
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
                    <div className="mt-6">
                        <p className="font-semibold mb-2">명부양식</p>
                        <FormControlLabel
                            className="block w-full bg-white rounded shadow mb-1.5"
                            control={
                                <Checkbox
                                    checked={includeWorkerReportXLSL}
                                    onChange={(event) =>
                                        setIncludeWorkerReportXLSL(
                                            event.target.checked,
                                        )
                                    }
                                />
                            }
                            label="이메일에 명부양식 포함 (Excel 형식)"
                        />
                        <FormControlLabel
                            className="block w-full bg-white rounded shadow"
                            control={
                                <Checkbox
                                    checked={includeWorkerReportPDF}
                                    onChange={(event) =>
                                        setIncludeWorkerReportPDF(
                                            event.target.checked,
                                        )
                                    }
                                />
                            }
                            label="이메일에 명부양식 포함 (PDF 형식)"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleEmailToWorker;
