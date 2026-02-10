import { Button, IconButton } from "@mui/material";
import moment from "moment/moment";
import React, { useRef, useState } from "react";
import OChip from "../../../components/OChip";
import transl from "../../../components/translate";
import getShareholderSex from "../../../Worker/components/getShareholderSex";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

function SubmissionLoopItem({
    project,
    shareholder,
    user,
    date,
    created_at,
    result,
    projectResult,
    note,
    files,
    shares,
    sharesTotal,
    address,
    database,
    contact_info,
    contact_worker,
    date_of_birth_code,
    sex,
    shareholderValue,
    submissionID,
    setAttachmentPreview,
    privacyConsentFile,
}) {
    const chip = result ? JSON.parse(projectResult[result]) : false;
    const [active, setActive] = useState(false);
    const contentEl = useRef();

    const storagePath = process.env.REACT_APP_STORAGE_PATH;
    const privacyConsentFiles = Array.isArray(privacyConsentFile)
        ? privacyConsentFile
        : privacyConsentFile
          ? [privacyConsentFile]
          : [];

    const handlePreview = (file) => {
        setAttachmentPreview(file);
    };

    const handleDownload = async (file) => {
        if (!file) return;

        const url = `${storagePath}/${file}`;
        const filename = file.split("/").filter(Boolean).pop() || "download";

        const res = await fetch(url, { mode: "cors" });
        if (!res.ok) throw new Error(`Download failed: ${res.status}`);

        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(blobUrl);
    };

    const fileName = (file) =>
        file?.split("/").filter(Boolean).pop() || file || "";

    return (
        <div className="relative p-4 mb-3  overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg ">
            <div
                className="flex justify-between items-center cursor-pointer flex-wrap"
                onClick={() => {
                    setActive(!active);
                }}
            >
                <div className="w-2/12">
                    <p className="font-bold">
                        {shareholder}
                        <span className="text-slate-500 font-normal mx-2">
                            {date_of_birth_code}
                        </span>
                        {getShareholderSex(sex)}
                    </p>
                </div>
                <p className="w-2/12">{shares}</p>
                <p className="w-2/12">{sharesTotal}</p>
                <p className="w-1/12">{user}</p>
                <p className="w-1/12 text-xs text-slate-600">
                    {moment(created_at).format("YY/MM/DD HH:mm")}
                </p>
                <p className="w-2/12">{project}</p>
                <div className="w-2/12 text-center relative flex justify-end items-center">
                    <span className="text-xs text-slate-500 mr-2">
                        {moment(date).format("YY/MM/DD")}
                    </span>
                    {chip && <OChip color={chip.color}>{chip.name}</OChip>}
                    <Link to={`/dashboard/submission/edit/${submissionID}`}>
                        <IconButton>
                            <EditIcon
                                sx={{
                                    fontSize: "12px",
                                }}
                            />
                        </IconButton>
                    </Link>
                </div>
            </div>
            <div
                ref={contentEl}
                className="overflow-hidden transition-all"
                style={
                    active
                        ? { height: contentEl?.current?.scrollHeight }
                        : { height: "0px" }
                }
            >
                <div className="pt-4"></div>
                <div className="border-t border-dashed border-gray-400  pt-4 grid grid-cols-2 gap-14">
                    <div>
                        <div>
                            <p className="text-sm  text-slate-600 mb-3">
                                <strong className="mr-2 uppercase text-xs">
                                    {transl("Create At")}:
                                </strong>
                                {moment(created_at).format("YYYY-MM-DD  HH:mm")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm  text-slate-600 mb-3">
                                <strong className="mr-2 uppercase text-xs">
                                    {transl("Date")}:
                                </strong>
                                {moment(date).format("YYYY-MM-DD")}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm  text-slate-600 mb-3">
                                <strong className="mr-2 uppercase text-xs">
                                    {transl("Address")}:
                                </strong>
                                {address}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm  text-slate-600 mb-3">
                                <strong className="mr-2 uppercase text-xs">
                                    {transl("Contact Info")}:
                                </strong>
                                {contact_info}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm  text-slate-600 mb-3">
                                <strong className="mr-2 uppercase text-xs">
                                    {transl("Contact For Worker")}:
                                </strong>
                                {contact_worker}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm  text-slate-600 mb-3">
                                <strong className="mr-2 uppercase text-xs">
                                    {transl("Database")}:
                                </strong>
                                {database}
                            </p>
                        </div>
                    </div>
                    <div>
                        {files?.length > 0 && (
                            <div className="mb-4 text-slate-600">
                                <strong className="mr-2 uppercase text-xs">
                                    {transl("Files")}
                                </strong>
                                <div className="mt-2 space-y-2">
                                    {files.map((file) => (
                                        <div
                                            key={file}
                                            className="flex items-center justify-between border rounded px-2 py-1"
                                        >
                                            <span className="text-sm truncate mr-2">
                                                {fileName(file)}
                                            </span>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        handlePreview(file)
                                                    }
                                                >
                                                    {transl("Preview")}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        handleDownload(file)
                                                    }
                                                >
                                                    {transl("Download")}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {privacyConsentFiles.length > 0 && (
                            <div className="mb-4 text-slate-600">
                                <strong className="mr-2 uppercase text-xs">
                                    {transl("privacy consent file")}
                                </strong>
                                <div className="mt-2 space-y-2">
                                    {privacyConsentFiles.map((file) => (
                                        <div
                                            key={file}
                                            className="flex items-center justify-between border rounded px-2 py-1"
                                        >
                                            <span className="text-sm truncate mr-2">
                                                {fileName(file)}
                                            </span>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        handlePreview(file)
                                                    }
                                                >
                                                    {transl("Preview")}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        handleDownload(file)
                                                    }
                                                >
                                                    {transl("Download")}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <p className="text-sm  text-slate-600 mb-2">
                                {transl("Note")}
                            </p>
                            <p>{note}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubmissionLoopItem;
