import React, { useRef, useState } from "react";
import moment from "moment/moment";
import OChip from "../../../components/OChip";
import transl from "../../../components/translate";
import getShareholderSex from "../../../Worker/components/getShareholderSex";

const formatDate = (value, format) => {
    if (!value) {
        return "-";
    }

    const parsedDate = moment(value);

    return parsedDate.isValid() ? parsedDate.format(format) : "-";
};

function SubmissionLoopEsignonItem({ project, shareholderValue, created_at }) {
    const [active, setActive] = useState(false);
    const contentEl = useRef();

    const workers = Array.isArray(shareholderValue?.user)
        ? shareholderValue.user.filter(Boolean)
        : shareholderValue?.user
          ? [shareholderValue.user]
          : [];

    const workerSummary =
        workers.length > 1
            ? `${workers[0]} +${workers.length - 1}`
            : workers[0] || "-";

    const completionDate =
        shareholderValue?.api_recipient_completion_date || created_at;

    return (
        <div className="relative p-4 mb-3 overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
            <div
                className="flex justify-between items-center cursor-pointer flex-wrap"
                onClick={() => {
                    setActive(!active);
                }}
            >
                <div className="w-2/12">
                    <p className="font-bold">
                        {shareholderValue?.name || "-"}
                        <span className="text-slate-500 font-normal mx-2">
                            {shareholderValue?.date_of_birth_code ||
                                shareholderValue?.registration ||
                                ""}
                        </span>
                        {getShareholderSex(shareholderValue?.sex)}
                    </p>
                </div>
                <p className="w-2/12">{shareholderValue?.shares || "-"}</p>
                <p className="w-2/12">
                    {shareholderValue?.shares_total || "-"}
                </p>
                <p className="w-1/12">{workerSummary}</p>
                <p className="w-1/12 text-xs text-slate-600">
                    {formatDate(created_at, "YY/MM/DD")}
                </p>
                <p className="w-2/12">{project || "-"}</p>
                <div className="w-2/12 text-center relative flex justify-end items-center">
                    <span className="text-xs text-slate-500 mr-2">
                        {formatDate(completionDate, "YY/MM/DD")}
                    </span>
                    <OChip color="green">{transl("eproxy link")}</OChip>
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
                <div className="border-t border-dashed border-gray-400 pt-4 grid grid-cols-2 gap-14">
                    <div>
                        <p className="text-sm text-slate-600 mb-3 flex items-center gap-2">
                            <strong className="uppercase text-xs">
                                {transl("Create At")}:
                            </strong>
                            {formatDate(created_at, "YYYY-MM-DD")}
                            <span className="text-green-700">
                                ({transl("Eproxy completed")})
                            </span>
                        </p>
                        <p className="text-sm text-slate-600 mb-3">
                            <strong className="mr-2 uppercase text-xs">
                                {transl("Eproxy Completion Date")}:
                            </strong>
                            {formatDate(completionDate, "YYYY-MM-DD HH:mm")}
                        </p>
                        <p className="text-sm text-slate-600 mb-3">
                            <strong className="mr-2 uppercase text-xs">
                                {transl("Eproxy Contact")}:
                            </strong>
                            {shareholderValue?.api_recipient_contact || "-"}
                        </p>
                        <p className="text-sm text-slate-600 mb-3">
                            <strong className="mr-2 uppercase text-xs">
                                {transl("Address")}:
                            </strong>
                            {shareholderValue?.address || "-"}
                        </p>
                        <p className="text-sm text-slate-600 mb-3">
                            <strong className="mr-2 uppercase text-xs">
                                {transl("Contact Info")}:
                            </strong>
                            {shareholderValue?.contact_info || "-"}
                        </p>
                        <p className="text-sm text-slate-600 mb-3">
                            <strong className="mr-2 uppercase text-xs">
                                {transl("Contact For Worker")}:
                            </strong>
                            {shareholderValue?.contact_worker || "-"}
                        </p>
                        <p className="text-sm text-slate-600 mb-3">
                            <strong className="mr-2 uppercase text-xs">
                                {transl("Database")}:
                            </strong>
                            {shareholderValue?.database || "-"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 mb-3">
                            <strong className="mr-2 uppercase text-xs">
                                {transl("Workers")}:
                            </strong>
                            {workers.length ? workers.join(", ") : "-"}
                        </p>
                        <p className="text-sm text-slate-600 mb-3">
                            <strong className="mr-2 uppercase text-xs">
                                {transl("Source")}:
                            </strong>
                            esignon
                        </p>
                        <p className="text-sm text-slate-600 mb-3">
                            <strong className="mr-2 uppercase text-xs">
                                {transl("Resident Registration Number")}:
                            </strong>
                            {shareholderValue?.registration || "-"}
                        </p>
                        <p className="text-sm text-slate-600 mb-3">
                            <strong className="mr-2 uppercase text-xs">
                                {transl("Eletronic Voting")}:
                            </strong>
                            {shareholderValue?.eletronic_voting || "-"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubmissionLoopEsignonItem;
