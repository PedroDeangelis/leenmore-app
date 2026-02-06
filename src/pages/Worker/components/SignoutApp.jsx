import React from "react";
import { useQueryClient } from "react-query";
import signOut from "../../../auth/signOut";

function SignoutApp({ children }) {
	const queryClient = useQueryClient();

	const handleClick = async () => {
		signOut().then(() => {
			queryClient.invalidateQueries("isUserLoggedIn");
			queryClient.invalidateQueries("getUserMeta");
		});
	};
	return <div onClick={handleClick}>{children}</div>;
}

export default SignoutApp;
