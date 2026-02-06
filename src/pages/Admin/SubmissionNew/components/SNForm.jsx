import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";
import { useUserList } from "../../../../hooks/useUser";
import SubmissionForm from "../../../Worker/SingleShareholderApp/SubmissionForm/SubmissionForm";
import moment from "moment";
import { submissionEditAtom } from "../../../../helpers/atom";
import { useAtom } from "jotai";
import SNFormEdit from "./SNFormEdit";

function SNForm({ shareholder }) {
    const [userID, setUserID] = useState("");
    const [usermeta, setUsermeta] = useState({});
    const { data: userList, isLoading } = useUserList();
    const [submissionEdit, setSubmissionEdit] = useAtom(submissionEditAtom);

    useEffect(() => {
        if (userID) {
            const user = userList.find((user) => user.id === userID);
            setUsermeta(user);
        }
    }, [userID, userList]);

    // DESTROY WHEN NOT VISIBLE
    useEffect(() => {
        return () => {
            setUserID("");
            setUsermeta({});
            setSubmissionEdit(null);
        };
    }, []);

    useEffect(() => {
        if (submissionEdit) {
            setUserID(false);
        }
    }, [submissionEdit]); // eslint-disable-line react-hooks/exhaustive-deps

    if (submissionEdit) {
        return (
            <div>
                <p className="mb-2 font-bold text-center text-lg">
                    {transl("Editing submission")}
                </p>
                <SNFormEdit submission={submissionEdit} />
            </div>
        );
    }

    return (
        <div>
            {!userID && (
                <div
                    className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-700 px-4 py-3 shadow-md mb-6 flex items-center"
                    role="alert"
                >
                    <svg
                        className="fill-current h-6 w-6 text-teal-500 mr-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                    <p className="font-bold">
                        {transl("Select a user to show the submission form")}
                    </p>
                </div>
            )}
            {userID && (
                <div className="flex items-center justify-between mb-2">
                    <p className=" font-bold text-center text-lg">
                        {transl("Adding new submission")}
                    </p>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setUserID("")}
                    >
                        {transl("cancel")}
                    </Button>
                </div>
            )}
            <Card>
                <CardContent>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <div>
                            <select
                                required
                                onChange={(e) => setUserID(e.target.value)}
                                className="w-full py-4 px-2 border border-slate-400 rounded mb-4 bg-transparent"
                            >
                                <option value={""}>
                                    {transl("Select user")}
                                </option>
                                {userList.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.first_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {userID && (
                        <SubmissionForm
                            project_id={shareholder.project_id}
                            filename={`${shareholder.name}${shareholder.date_of_birth_code}`}
                            user={usermeta.first_name}
                            user_id={usermeta.id}
                            shareholder={shareholder}
                            date={moment().format("YYYYMMDD")}
                            stayOnThePage={true}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default SNForm;
