import { Button, Card, CardContent, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserProfileUpdate } from "../../../../hooks/useUser";
import transl from "../../../components/translate";
import DataDisplay from "../../components/DataDisplay";
import EditIcon from "@mui/icons-material/Edit";

function SingleUserInfo({
    id,
    first_name,
    email,
    email_receiver,
    role,
    status,
    phone_number,
}) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);
    const [isEditingEmailReceiver, setIsEditingEmailReceiver] = useState(false);
    const [name, setName] = useState(first_name || "");
    const [phoneNumber, setPhoneNumber] = useState(phone_number || "");
    const [emailReceiver, setEmailReceiver] = useState(email_receiver || "");
    const userProfileUpdateMutation = useUserProfileUpdate();

    useEffect(() => {
        setName(first_name || "");
    }, [first_name]);

    useEffect(() => {
        setPhoneNumber(phone_number || "");
    }, [phone_number]);

    useEffect(() => {
        setEmailReceiver(email_receiver || "");
    }, [email_receiver]);

    const handleNameSave = (e) => {
        e.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            return;
        }

        if (trimmedName === first_name) {
            setIsEditingName(false);
            return;
        }

        userProfileUpdateMutation.mutate(
            {
                id: id,
                first_name: trimmedName,
                role: role,
            },
            {
                onSuccess: () => {
                    toast.success(transl("User updated successfully"));
                    setIsEditingName(false);
                },
            },
        );
    };

    const handleNameCancel = () => {
        setName(first_name || "");
        setIsEditingName(false);
    };

    const handlePhoneNumberSave = (e) => {
        e.preventDefault();

        const trimmedPhoneNumber = phoneNumber.trim();

        if (trimmedPhoneNumber === (phone_number || "")) {
            setIsEditingPhoneNumber(false);
            return;
        }

        userProfileUpdateMutation.mutate(
            {
                id: id,
                first_name: first_name,
                role: role,
                phone_number: trimmedPhoneNumber,
            },
            {
                onSuccess: () => {
                    toast.success(transl("User updated successfully"));
                    setIsEditingPhoneNumber(false);
                },
            },
        );
    };

    const handlePhoneNumberCancel = () => {
        setPhoneNumber(phone_number || "");
        setIsEditingPhoneNumber(false);
    };

    const handleEmailReceiverSave = (e) => {
        e.preventDefault();

        const trimmedEmailReceiver = emailReceiver.trim();

        if (trimmedEmailReceiver === (email_receiver || "")) {
            setIsEditingEmailReceiver(false);
            return;
        }

        userProfileUpdateMutation.mutate(
            {
                id: id,
                first_name: first_name,
                role: role,
                email_receiver: trimmedEmailReceiver,
            },
            {
                onSuccess: () => {
                    toast.success(transl("User updated successfully"));
                    setIsEditingEmailReceiver(false);
                },
            },
        );
    };

    const handleEmailReceiverCancel = () => {
        setEmailReceiver(email_receiver || "");
        setIsEditingEmailReceiver(false);
    };

    return (
        <Card className="mb-4">
            <CardContent>
                <div className="grid grid-cols-5 gap-4">
                    <div className="">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            {transl("Title")}
                        </p>
                        {isEditingName ? (
                            <form
                                onSubmit={handleNameSave}
                                className="flex items-end gap-2"
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={
                                        userProfileUpdateMutation.isLoading
                                    }
                                >
                                    {transl("save")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="text"
                                    onClick={handleNameCancel}
                                    disabled={
                                        userProfileUpdateMutation.isLoading
                                    }
                                >
                                    {transl("cancel")}
                                </Button>
                            </form>
                        ) : (
                            <div className="flex items-center  gap-4">
                                <p className="text-lg">{first_name}</p>
                                <Button
                                    size="small"
                                    variant="text"
                                    onClick={() => setIsEditingName(true)}
                                    startIcon={<EditIcon />}
                                >
                                    {transl("Edit user name")}
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="col-span-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            {transl("Phone Number")}
                        </p>
                        {isEditingPhoneNumber ? (
                            <form
                                onSubmit={handlePhoneNumberSave}
                                className="flex items-end gap-2"
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={
                                        userProfileUpdateMutation.isLoading
                                    }
                                >
                                    {transl("save")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="text"
                                    onClick={handlePhoneNumberCancel}
                                    disabled={
                                        userProfileUpdateMutation.isLoading
                                    }
                                >
                                    {transl("cancel")}
                                </Button>
                            </form>
                        ) : (
                            <div className="flex items-center gap-4">
                                <p className="text-lg">
                                    {phone_number || transl("Not provided")}
                                </p>
                                <Button
                                    size="small"
                                    variant="text"
                                    onClick={() =>
                                        setIsEditingPhoneNumber(true)
                                    }
                                    startIcon={<EditIcon />}
                                >
                                    {transl("Edit phone number")}
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="col-span-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            {transl("Email Receiver")}
                        </p>
                        {isEditingEmailReceiver ? (
                            <form
                                onSubmit={handleEmailReceiverSave}
                                className="flex items-end gap-2"
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    type="email"
                                    value={emailReceiver}
                                    onChange={(e) =>
                                        setEmailReceiver(e.target.value)
                                    }
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={
                                        userProfileUpdateMutation.isLoading
                                    }
                                >
                                    {transl("save")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="text"
                                    onClick={handleEmailReceiverCancel}
                                    disabled={
                                        userProfileUpdateMutation.isLoading
                                    }
                                >
                                    {transl("cancel")}
                                </Button>
                            </form>
                        ) : (
                            <div className="flex items-center gap-4">
                                <p className="text-lg">
                                    {email_receiver || transl("Not provided")}
                                </p>
                                <Button
                                    size="small"
                                    variant="text"
                                    onClick={() =>
                                        setIsEditingEmailReceiver(true)
                                    }
                                    startIcon={<EditIcon />}
                                ></Button>
                            </div>
                        )}
                    </div>
                    <DataDisplay label={transl("Email")}>{email}</DataDisplay>
                    <div className="grid grid-cols-2">
                        <DataDisplay label={transl("Role")}>
                            {transl(role)}
                        </DataDisplay>
                        <DataDisplay label={transl("Status")}>
                            {transl(status)}
                        </DataDisplay>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default SingleUserInfo;
