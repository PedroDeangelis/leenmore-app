import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

function ActivityDataProjectLoopItem({ project }) {
    return (
        <Link to={`/dashboard/activity-data/${project.id}`}>
            <div className="relative p-4 mb-3 cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg flex justify-between items-center">
                <p className="text-lg">
                    {project.title}
                    <span className="ml-2 text-sm text-slate-400">
                        {moment(project.created_at).format("YYYY/MM/DD HH:mm")}h
                    </span>
                </p>
            </div>
        </Link>
    );
}

export default ActivityDataProjectLoopItem;
