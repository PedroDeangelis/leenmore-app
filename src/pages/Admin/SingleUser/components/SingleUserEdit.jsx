import { Button, Card, CardContent, TextField } from "@mui/material";
import React, { useRef } from "react";
import { toast } from "react-toastify";
import { useUserPasswordUpdate } from "../../../../hooks/useUser";
import transl from "../../../components/translate";

function SingleUserEdit({ id }) {
    const passwordRef = useRef();
    const userPasswordUpdateMutation = useUserPasswordUpdate();

    const handleSubmit = (e) => {
        e.preventDefault();
        userPasswordUpdateMutation.mutate(
            {
                id: id,
                password: passwordRef.current.value,
            },
            {
                onSuccess: (data) => {
                    toast.success(transl("Password updated successfully"));
                },
            }
        );
    };

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        inputRef={passwordRef}
                        required={true}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"
                    />
                    <p className="text-sm mb-6 text-slate-400">
                        {transl("min 6 characters")}
                    </p>
                    <Button type="submit" variant="contained" color="primary">
                        {transl("Update Password")}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default SingleUserEdit;
