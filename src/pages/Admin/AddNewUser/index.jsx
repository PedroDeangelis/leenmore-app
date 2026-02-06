import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import transl from "../../components/translate";
import Header from "../components/Header";
import FormNewUser from "./components/FormNewUser";

function AddNewUser() {
	return (
		<>
			<Header title="Add new User"></Header>
			<FormNewUser />
		</>
	);
}

export default AddNewUser;
