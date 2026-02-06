import {
    Card,
    CardContent,
    FormControl,
    InputLabel,
    OutlinedInput,
    TextField,
} from "@mui/material";
import React from "react";
import transl from "../../../components/translate";
import { handleUpdateNumberWithCommas } from "../../../components/formatNumber";

function FormNewProject({
    titleRef,
    sharesIssuedRef,
    targetSharesRef,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}) {
    return (
        <>
            <Card className=" col-span-2 mb-4">
                <CardContent>
                    <TextField
                        label={transl("Title")}
                        variant="outlined"
                        inputRef={titleRef}
                        sx={{ width: "100%" }}
                    />
                </CardContent>
            </Card>
            <div className="grid grid-cols-4 gap-4 mb-4">
                <Card className="">
                    <CardContent>
                        <TextField
                            label={transl("total number of shares issued")}
                            variant="outlined"
                            inputRef={sharesIssuedRef}
                            sx={{ width: "100%" }}
                            onChange={handleUpdateNumberWithCommas}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <TextField
                            label={transl("target number of shares")}
                            variant="outlined"
                            inputRef={targetSharesRef}
                            sx={{ width: "100%" }}
                            onChange={handleUpdateNumberWithCommas}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <FormControl variant="outlined" className="w-full ">
                            <InputLabel htmlFor="start-date-id">
                                {transl("project start date")}
                            </InputLabel>
                            <OutlinedInput
                                id="start-date-id"
                                value={startDate}
                                type={`date`}
                                onChange={(e) => setStartDate(e.target.value)}
                                label={transl("project start date")}
                            />
                        </FormControl>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <FormControl variant="outlined" className="w-full ">
                            <InputLabel htmlFor="end-date-id">
                                {transl("project end date")}
                            </InputLabel>
                            <OutlinedInput
                                id="end-date-id"
                                value={endDate}
                                type={`date`}
                                onChange={(e) => setEndDate(e.target.value)}
                                label={transl("project end date")}
                            />
                        </FormControl>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default FormNewProject;
