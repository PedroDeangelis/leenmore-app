import { Button } from "@mui/material";
import React from "react";
import { useQueryClient } from "react-query";
import signOut from "../../auth/signOut";

function ButtonSignOut() {
	const queryClient = useQueryClient();

	const handleClick = async () => {
		signOut().then(() => {
			queryClient.invalidateQueries("isUserLoggedIn");
			queryClient.invalidateQueries("getUserMeta");
		});
	};

	return <Button onClick={handleClick}>Log Out</Button>;
}

export default ButtonSignOut;
