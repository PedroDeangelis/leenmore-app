import React from "react";
import MenuListItem from "./MenuListItem";

import DashboardIcon from "@mui/icons-material/Dashboard";
import { LayoutGroup } from "framer-motion";
import transl from "../../../components/translate";

function MenuList() {
    return (
        <LayoutGroup>
            <div className="px-5">
                <MenuListItem
                    title={transl("Dashboard")}
                    icon={<DashboardIcon fontSize="small" />}
                    link="/dashboard"
                />
                <MenuListItem
                    title={transl("Projects")}
                    icon={<DashboardIcon fontSize="small" />}
                    link="/dashboard/project"
                />
                <MenuListItem
                    title={transl("Project Submission")}
                    icon={<DashboardIcon fontSize="small" />}
                    link="/dashboard/submission"
                />
                <MenuListItem
                    title={transl("Users")}
                    icon={<DashboardIcon fontSize="small" />}
                    link="/dashboard/user"
                />
                <MenuListItem
                    title={transl("Activity report")}
                    icon={<DashboardIcon fontSize="small" />}
                    link="/dashboard/activity-report"
                />
                <MenuListItem
                    title={transl("Activity data")}
                    icon={<DashboardIcon fontSize="small" />}
                    link="/dashboard/activity-data"
                />
                <MenuListItem
                    title={transl("Receipt details")}
                    icon={<DashboardIcon fontSize="small" />}
                    link="/dashboard/receipt"
                />
                <MenuListItem
                    title={transl("Project Resources")}
                    icon={<DashboardIcon fontSize="small" />}
                    link="/dashboard/resources"
                />
            </div>
        </LayoutGroup>
    );
}

export default MenuList;
