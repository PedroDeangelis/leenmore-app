import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import UserTableList from "./components/UserTableList";
import transl from "../../components/translate";

function Users() {
    return (
        <div>
            <Header title={transl("Users")}>
                <Link to="/dashboard/user/add-new">
                    <Button variant="contained">
                        {transl("Add new User")}
                    </Button>
                </Link>
            </Header>
            <UserTableList />
        </div>
    );
}

export default Users;
