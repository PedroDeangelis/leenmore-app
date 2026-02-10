import React from "react";
import Header from "../components/Header";
import transl from "../../components/translate";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { Link } from "react-router-dom";

function EmailToWorker() {
    return <></>;

    return (
        <div>
            <Header title={`${transl("Email to Worker")}: Project name here`}>
                <Button variant="text">
                    <Link to={`/dashboard/email-to-worker`}>
                        {transl("Go Back")}
                    </Link>
                </Button>
            </Header>
            <div className="grid grid-cols-2 gap-20">
                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        List of Workers
                    </h2>
                    <div className="border-slate-300 border px-4 mb-4 rounded-md">
                        <FormControlLabel
                            className="flex items-center"
                            control={<Checkbox />}
                            label={"강근영 (gykang512@naver.com)"}
                        />
                    </div>
                    <div className="border-slate-300 border px-4 mb-4 rounded-md">
                        <FormControlLabel
                            className="flex items-center"
                            control={<Checkbox />}
                            label={"강근태 (kanggt0916@gmail.com)"}
                        />
                    </div>
                    <div className="border-slate-300 border px-4 mb-4 rounded-md">
                        <FormControlLabel
                            className="flex items-center"
                            control={<Checkbox />}
                            label={"고슬기 (goseulki9418@gmail.com)"}
                        />
                    </div>
                </div>
                <div>
                    {/* Add a text area to compose the email */}
                    <h2 className="text-lg font-semibold mb-4">
                        {transl("Compose Email")}
                    </h2>
                    <textarea
                        className="w-full h-40 border-slate-300 border rounded-md p-2"
                        placeholder={transl("Write your email here...")}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}

export default EmailToWorker;
