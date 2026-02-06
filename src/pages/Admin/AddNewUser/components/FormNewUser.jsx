import {
	Button,
	Card,
	CardContent,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserNew } from "../../../../hooks/useUser";
import transl from "../../../components/translate";

function FormNewUser() {
	const firstNameRef = useRef();
	const emailNameRef = useRef();
	const passwordNameRef = useRef();
	const [role, setRole] = useState("worker");
	const newUserMutation = useUserNew();
	const navigate = useNavigate();

	const handleChange = (event) => {
		setRole(event.target.value);
	};

	const handleUserCreation = (e) => {
		e.preventDefault();
		newUserMutation.mutate(
			{
				email: emailNameRef.current.value,
				first_name: firstNameRef.current.value,
				role: role,
				password: passwordNameRef.current.value,
			},
			{
				onSuccess: (data) => {
					navigate(`/dashboard/user`);
					toast.success(transl("User created with sucesss"), {
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
		<form className="grid grid-cols-2" onSubmit={handleUserCreation}>
			<Card>
				<CardContent>
					<TextField
						required
						sx={{ width: "100%", marginBottom: "16px" }}
						id="outlined-required"
						label="Name"
						inputRef={firstNameRef}
					/>
					<TextField
						required
						sx={{ width: "100%", marginBottom: "16px" }}
						id="outlined-required"
						label="Email"
						type="email"
						inputRef={emailNameRef}
					/>
					<FormControl fullWidth sx={{ marginBottom: "16px" }}>
						<InputLabel id="demo-simple-select-label">
							{transl("Role")} *
						</InputLabel>
						<Select
							required
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={role}
							label={transl("Role")}
							onChange={handleChange}
						>
							<MenuItem value={"worker"}>
								{transl("Worker")}
							</MenuItem>
							<MenuItem value={"admin"}>
								{transl("Admin")}
							</MenuItem>
						</Select>
					</FormControl>
					<TextField
						required
						sx={{ width: "100%", marginBottom: "30px" }}
						id="outlined-required"
						label="Password"
						inputRef={passwordNameRef}
					/>
					<Button
						type="submit"
						variant="contained"
						className="w-full"
					>
						{transl("Create User")}
					</Button>
				</CardContent>
			</Card>
		</form>
	);
}

export default FormNewUser;
