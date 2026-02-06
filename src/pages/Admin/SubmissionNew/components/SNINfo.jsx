import { Card, CardContent } from "@mui/material";
import React from "react";
import transl from "../../../components/translate";
import getShareholderSex from "../../../Worker/components/getShareholderSex";

function SNINfo({ shareholder }) {
    const { name, date_of_birth_code, sex, address, shares, shares_total } =
        shareholder;

    return (
        <Card className="mb-4">
            <CardContent className="text-lg">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            {transl("Shareholder")}
                        </p>
                        <p className="">
                            {name} ({date_of_birth_code})
                        </p>
                    </div>
                    <div className="w-8 text-center">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            {transl("Sex")}
                        </p>
                        <span className="font-bold">
                            {getShareholderSex(sex)}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-start">
                    <div className="w-8/12">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            {transl("Address")}
                        </p>
                        <p>{address}</p>
                    </div>
                    <div className="w-4/12 flex pl-7 justify-end text-center">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                {transl("Shares")}
                            </p>
                            <p className="">{shares}</p>
                        </div>
                        <div className="ml-7">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                {transl("Total Shares")}
                            </p>
                            <p className="">{shares_total}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default SNINfo;
