import {
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from "@mui/material";
import React, { useRef, useState } from "react";
import transl from "../../components/translate";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useUserLogin } from "../../../hooks/useUser";
import { useNavigate } from "react-router-dom";

function SignInForm() {
	const emailRef = useRef();
	const passRef = useRef();
	const userLoginMutation = useUserLogin();
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const submitSignInUser = (e) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage(false);

		userLoginMutation.mutate(
			{
				email: emailRef.current.value,
				password: passRef.current.value,
			},
			{
				onSuccess: (data) => {
					if (data?.id) {
						navigate("/app");
					} else {
						setIsLoading(false);
						setErrorMessage(transl("Email or Password Invalid"));
					}
				},
			}
		);
	};

	return (
		<form
			onSubmit={(e) => {
				submitSignInUser(e);
			}}
		>
			<Card>
				<CardContent>
					<TextField
						id="input-email"
						label={transl("Email")}
						variant="outlined"
						inputRef={emailRef}
						required={true}
						sx={{ width: "100%", mb: "20px" }}
						type="email"
					/>
					<FormControl
						sx={{ width: "100%" }}
						variant="outlined"
						required={true}
					>
						<InputLabel htmlFor="input-password">
							{transl("Password")}
						</InputLabel>
						<OutlinedInput
							id="input-password"
							label="Password"
							inputRef={passRef}
							type={showPassword ? "text" : "password"}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge="end"
									>
										{showPassword ? (
											<VisibilityOff />
										) : (
											<Visibility />
										)}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
					{errorMessage && (
						<p className="text-sm text-red-600 text-center mt-3">
							{errorMessage}
						</p>
					)}
				</CardContent>
				<CardActions>
					{isLoading ? (
						<div className="flex items-center justify-center w-full mb-2">
							<CircularProgress />
						</div>
					) : (
						<Button
							className="w-full button-tall mb-0"
							variant="contained"
							type="submit"
						>
							{transl("Sing In")}
						</Button>
					)}
				</CardActions>
			</Card>
		</form>
	);
}

export default SignInForm;
