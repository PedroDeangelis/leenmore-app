import { Button } from "@mui/material";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser, useUserStatusUpdate } from "../../../hooks/useUser";
import transl from "../../components/translate";
import Header from "../components/Header";
import SingleUserEdit from "./components/SingleUserEdit";
import SingleUserInfo from "./components/SingleUserInfo";

function SingleUser() {
	const { id } = useParams();
	const { data, isLoading } = useUser(id);
	const userStatusUpdateMutation = useUserStatusUpdate();

	const handleUserDeactvation = () => {
		userStatusUpdateMutation.mutate(
			{
				id: data.id,
				status: "deactivated",
			},
			{
				onSuccess: () => {
					toast.success(transl("User Deactivate successfully"), {
						position: "top-right",
						autoClose: 4000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				},
			}
		);
	};

	const handleUserActivation = () => {
		userStatusUpdateMutation.mutate(
			{
				id: data.id,
				status: "active",
			},
			{
				onSuccess: () => {
					toast.success(transl("User Actvate successfully"), {
						position: "top-right",
						autoClose: 4000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				},
			}
		);
	};

	return (
		<>
			{isLoading && !data ? (
				<p>{transl("Loading")}</p>
			) : (
				<div>
					<Header title={data?.first_name}>
						<Link to={"/dashboard/user"}>
							<Button variant="text">{transl("Go Back")}</Button>
						</Link>
						{data.status === "deactivated" ? (
							<Button
								onClick={handleUserActivation}
								variant="contained"
								sx={{ ml: 2 }}
							>
								{transl("Activate User")}
							</Button>
						) : (
							<Button
								onClick={handleUserDeactvation}
								variant="contained"
								sx={{ ml: 2 }}
							>
								{transl("Deactivate User")}
							</Button>
						)}
					</Header>
					<SingleUserInfo
						first_name={data.first_name}
						email={data.email}
						role={data.role}
						status={data.status}
					/>
					<div className="grid grid-cols-2">
						<SingleUserEdit id={data.id} />
					</div>
				</div>
			)}
		</>
	);
}

export default SingleUser;
