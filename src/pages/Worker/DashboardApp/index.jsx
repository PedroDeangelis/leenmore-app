import React from "react";
import AppHeader from "../components/AppHeader";
import transl from "../../components/translate";
import AppContent from "../components/AppContent";
import ProjectLoop from "./components/ProjectLoop";

function DashboardApp() {
    return (
        <div>
            <AppHeader>
                <h1 className="text-3xl">{transl("My Projects")}</h1>
            </AppHeader>
            <AppContent>
                <ProjectLoop />
            </AppContent>
        </div>
    );
}

export default DashboardApp;
