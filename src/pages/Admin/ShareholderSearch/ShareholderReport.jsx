import React, { useMemo } from "react";
import { Card, CardContent, CircularProgress } from "@mui/material";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import { useSubmissionsByShareholderIds } from "../../../hooks/useSubmission";
import OChip from "../../components/OChip";
import formatNumber from "../../components/formatNumber";
import { hasCompletedEproxy } from "../../components/resultSentinels";
import transl from "../../components/translate";
import getShareholderSex from "../../Worker/components/getShareholderSex";
import { resolveEffectiveStatus, resolveResultChip } from "./resolveResultChip";

const storagePath = process.env.REACT_APP_STORAGE_PATH;

const fileName = (file) =>
    file?.split("/").filter(Boolean).pop() || file || "";

const toFileList = (value) =>
    Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];

function InfoItem({ label, children, className = "" }) {
    if (children === null || children === undefined || children === "") {
        return null;
    }

    return (
        <p className={`text-sm ${className}`}>
            <span className="text-xs block text-slate-500">{label}</span>
            {children}
        </p>
    );
}

function FileLinks({ label, files }) {
    if (!files.length) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
            <span className="text-slate-500">{label}:</span>
            {files.map((file) => (
                <a
                    key={file}
                    href={`${storagePath}/${file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 hover:underline"
                >
                    {fileName(file)}
                </a>
            ))}
        </div>
    );
}

function ReportSummary({ person }) {
    const statusCounts = useMemo(() => {
        const counts = new Map();

        person.rows.forEach((row) => {
            const status = resolveEffectiveStatus(row) ?? {
                name: transl("No result"),
                color: "",
            };
            const key = `${status.name}|${status.color}`;
            const entry = counts.get(key) ?? { ...status, key, count: 0 };
            entry.count += 1;
            counts.set(key, entry);
        });

        return [...counts.values()].sort((a, b) => b.count - a.count);
    }, [person]);

    return (
        <Card sx={{ marginBottom: "24px" }}>
            <CardContent>
                <div className="flex items-start justify-between flex-wrap gap-6">
                    <div>
                        <p className="text-2xl font-bold">
                            {person.name}
                            <span className="text-slate-500 font-normal text-lg mx-2">
                                {person.dobCode}
                            </span>
                            {getShareholderSex(person.sex)}
                        </p>
                        {person.registration && (
                            <p className="text-sm text-slate-500 mt-1">
                                {transl("Registration")}: {person.registration}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-10 text-right">
                        <p>
                            <span className="text-xs block text-slate-500">
                                {transl("Number of projects")}
                            </span>
                            <span className="text-xl font-bold">
                                {person.projectCount}
                            </span>
                        </p>
                        <p>
                            <span className="text-xs block text-slate-500">
                                {transl("Shares across all projects")}
                            </span>
                            <span className="text-xl font-bold">
                                {formatNumber(person.totalShares)}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="mt-5">
                    <p className="text-xs uppercase font-bold text-slate-500 mb-2">
                        {transl("Result summary")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {statusCounts.map((status) => (
                            <OChip key={status.key} color={status.color} size="sm">
                                {`${status.name} × ${status.count}`}
                            </OChip>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function SubmissionHistory({ submissions, projectResults, isLoading, isError }) {
    let content;

    if (isLoading) {
        content = <CircularProgress size={20} />;
    } else if (isError) {
        content = (
            <p className="text-sm text-red-700">
                {transl("Error loading submissions")}
            </p>
        );
    } else if (!submissions.length) {
        content = (
            <p className="text-sm text-slate-500">{transl("No submissions")}</p>
        );
    } else {
        content = submissions.map((submission) => {
            const chip = resolveResultChip(submission.result, projectResults);

            return (
                <div
                    key={submission.id}
                    className="py-2 border-b last:border-b-0 border-gray-100"
                >
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-500 w-24 shrink-0">
                            {submission.date
                                ? moment(submission.date).format("YYYY-MM-DD")
                                : "-"}
                        </span>
                        <span className="w-32 shrink-0">
                            {submission.user_name}
                        </span>
                        {chip && (
                            <OChip color={chip.color} size="sm">
                                {chip.name}
                            </OChip>
                        )}
                        {submission.contact_worker && (
                            <span className="text-slate-500">
                                {submission.contact_worker}
                            </span>
                        )}
                    </div>
                    {submission.note && (
                        <p className="text-sm text-slate-600 mt-1">
                            {submission.note}
                        </p>
                    )}
                    <FileLinks
                        label={transl("Attachment")}
                        files={toFileList(submission.files)}
                    />
                    <FileLinks
                        label={transl("privacy consent file")}
                        files={toFileList(submission.privacy_consent_file)}
                    />
                </div>
            );
        });
    }

    return (
        <div className="mt-5 border-t border-dashed border-gray-300 pt-4">
            <p className="text-xs uppercase font-bold text-slate-500 mb-2">
                {transl("Submission history")}
            </p>
            {content}
        </div>
    );
}

function ProjectHoldingCard({ row, submissions, isLoading, isError }) {
    const chip = resolveResultChip(row.result, row.project_results);
    const workers = (row.user ?? []).filter(Boolean);

    return (
        <Card sx={{ marginBottom: "14px" }}>
            <CardContent>
                <div className="flex items-center justify-between gap-4">
                    <Link
                        to={`/dashboard/project/${row.project_id}`}
                        className="font-bold text-lg hover:underline"
                    >
                        {row.project_title}
                    </Link>
                    <div className="flex items-center gap-2">
                        {row.eletronic_voting && (
                            <p className="text-sm text-blue-700">
                                ({transl("eletronic vote")} {transl("completed")})
                            </p>
                        )}
                        {hasCompletedEproxy(row) && (
                            <p className="text-sm text-green-700">
                                ({transl("Eproxy completed")})
                            </p>
                        )}
                        {chip && <OChip color={chip.color}>{chip.name}</OChip>}
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-6 mt-4">
                    <InfoItem label={transl("Shares")}>{row.shares}</InfoItem>
                    <InfoItem label={transl("Total Shares")}>
                        {row.shares_total}
                    </InfoItem>
                    <InfoItem label={transl("Worker(s)")}>
                        {workers.length ? workers.join(" / ") : transl("vacant")}
                    </InfoItem>
                    <InfoItem label={transl("Registration")}>
                        {row.registration}
                    </InfoItem>
                    <InfoItem label={transl("Contact info")}>
                        {row.contact_info}
                    </InfoItem>
                    <InfoItem label={transl("Contact info 2")}>
                        {row.contact_info_2}
                    </InfoItem>
                    <InfoItem label={transl("Contact for worker")}>
                        {row.contact_worker}
                    </InfoItem>
                    <InfoItem label={transl("Address")} className="col-span-2">
                        {row.address}
                    </InfoItem>
                    <InfoItem label={transl("Last note")} className="col-span-2">
                        {row.last_note}
                    </InfoItem>
                </div>
                <SubmissionHistory
                    submissions={submissions}
                    projectResults={row.project_results}
                    isLoading={isLoading}
                    isError={isError}
                />
            </CardContent>
        </Card>
    );
}

function ShareholderReport({ person }) {
    const shareholderIds = useMemo(
        () => person.rows.map((row) => row.id),
        [person],
    );

    const {
        data: submissions = [],
        isLoading,
        isError,
    } = useSubmissionsByShareholderIds(shareholderIds);

    const submissionsByShareholder = useMemo(() => {
        const grouped = new Map();
        submissions.forEach((submission) => {
            const list = grouped.get(submission.shareholder_id) ?? [];
            list.push(submission);
            grouped.set(submission.shareholder_id, list);
        });
        return grouped;
    }, [submissions]);

    return (
        <div>
            <ReportSummary person={person} />
            {person.rows.map((row) => (
                <ProjectHoldingCard
                    key={row.id}
                    row={row}
                    submissions={submissionsByShareholder.get(row.id) ?? []}
                    isLoading={isLoading}
                    isError={isError}
                />
            ))}
        </div>
    );
}

export default ShareholderReport;
