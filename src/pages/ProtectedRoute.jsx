import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserisLoggendIn, useUser } from "../hooks/useUser";
import ButtonGoToTop from "./Admin/components/ButtonGoToTop";
import LoadingScreen from "./LoadingScreen";
import AppContainer from "./Worker/components/AppContainer";
import AppMenu from "./Worker/components/AppMenu";
import { Drawer } from "@mui/material";
import { appDrawerOpenAtom } from "../helpers/atom";
import { useAtom } from "jotai";
import DrawerMenuBox from "./Worker/DrawerMenuBox";

function ProtectedRoute() {
    const { data: currentUser } = useUserisLoggendIn();
    const { data: usermeta, isLoading } = useUser(currentUser?.id);
    const [drawerOpen, setDrawerOpen] = useAtom(appDrawerOpenAtom);

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setDrawerOpen(open);
    };

    if (!currentUser?.id) {
        return <Navigate to="/" />;
    }

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (usermeta?.status == "deactivated") {
        return <Navigate to="/deactivate-account" />;
    }

    if (usermeta?.role == "admin") {
        return <Navigate to="/dashboard" />;
    }

    return (
        <AppContainer>
            <Outlet />
            <AppMenu />
            <Drawer
                open={drawerOpen}
                anchor="right"
                variant="temporary"
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <DrawerMenuBox />
            </Drawer>
            <ButtonGoToTop size={"small"} />
        </AppContainer>
    );
}

export default ProtectedRoute;
