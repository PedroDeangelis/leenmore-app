import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserisLoggendIn, useUser } from "../../../hooks/useUser";
import LoadingScreen from "../../LoadingScreen";
import ButtonGoToTop from "../components/ButtonGoToTop";
import MainContainer from "../components/MainContainer";
import Sidebar from "../components/Sidebar";

function ProtectedRouteAdmin() {
	const { data: currentUser } = useUserisLoggendIn();
	const { data: usermeta, isLoading } = useUser(currentUser?.id);
	if (!currentUser?.id) {
		return <Navigate to="/" />;
	}

	if (isLoading) {
		return <LoadingScreen />;
	}

	if (usermeta?.role == "worker") {
		return <Navigate to="/app" />;
	}

	return (
		<MainContainer>
			<Sidebar />
			<Outlet />
			<ButtonGoToTop />
		</MainContainer>
	);
}

export default ProtectedRouteAdmin;
