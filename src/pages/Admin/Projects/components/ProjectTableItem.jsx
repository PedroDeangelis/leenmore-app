import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import transl from "../../../components/translate";
import getEndDate from "./getEndDate";

function ProjectTableItem({
    id,
    title,
    status,
    created_at,
    link,
    end_date = false,
    showEndDate = false,
}) {
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (showEndDate && end_date) {
            setEndDate(getEndDate(end_date));
        }
    }, [end_date]);

    return (
        <Link to={link}>
            <div className="relative p-4 mb-3 cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg flex justify-between items-center">
                <p className="text-lg">
                    {title}
                    <span className="ml-2 text-sm text-slate-400">
                        {moment(created_at).format("YYYY/MM/DD HH:mm")}h
                    </span>
                </p>
                <div className="flex items-center">
                    {endDate}
                    <p
                        className={
                            status == "publish"
                                ? "text-green-500"
                                : "text-slate-600"
                        }
                    >
                        {transl(status)}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default ProjectTableItem;
