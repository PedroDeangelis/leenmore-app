import React, { useRef, useState } from "react";
import {
    Alert,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";

import { resultColorOptions } from "../../../components/resultColorOptions";
import transl from "../../../components/translate";
import ResultTableList from "./ResultTableList";

function FormResultCreator({ formResultsList, setFormResultsList }) {
    const resultRef = useRef();

    const [resultItem, setResultItem] = useState("");
    const [resultError, setResultError] = useState(false);
    const [contactCheckbox, setContactCheckbox] = useState(false);
    const [attachmentCheckbox, setAttachmentCheckbox] = useState(false);
    const resultColors = resultColorOptions;

    const insertNewResult = (e) => {
        e.preventDefault();

        let newColor = resultRef.current.value;

        setResultError(false);

        if (formResultsList) {
            formResultsList.forEach((value) => {
                if (value.name == newColor) {
                    setResultError(
                        transl(
                            `The result ${newColor} is already added, try a different one.`
                        )
                    );
                    newColor = false;
                }
            });
        }

        if (!newColor) {
            return false;
        }

        setFormResultsList((prev) => [
            ...prev,
            {
                name: newColor,
                color: resultItem,
                contactRequired: contactCheckbox,
                attachmentRequired: attachmentCheckbox,
            },
        ]);
    };

    const handleResultItemChange = (e) => {
        setResultItem(e.target.value);
    };
    const removeResult = (name) => {
        setFormResultsList(
            formResultsList.filter((item) => item.name !== name)
        );
    };

    return (
        <Card className="mb-4 ">
            <CardContent>
                <p className="text-lg mb-3">{transl("Results")}</p>
                <div className="grid grid-cols-3 gap-8 items-start">
                    <div>
                        <form onSubmit={insertNewResult}>
                            <TextField
                                required={true}
                                label={transl("Result name")}
                                variant="outlined"
                                inputRef={resultRef}
                                sx={{ width: "100%", mb: "16px" }}
                            />

                            <FormControl sx={{ width: "100%", mb: "16px" }}>
                                <InputLabel id="demo-simple-select-label">
                                    {transl("Result Color")}
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={resultItem}
                                    required={true}
                                    label={transl("Result Color")}
                                    onChange={handleResultItemChange}
                                >
                                    {resultColors
                                        .filter((val) => val.name !== "b&w")
                                        .map((val, index) => (
                                            <MenuItem
                                                key={index}
                                                value={val.name}
                                            >
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-3 h-3"
                                                        style={{
                                                            mr: "10px",
                                                            marginRight: "10px",
                                                            backgroundColor:
                                                                val.background,
                                                        }}
                                                    ></div>
                                                    {val.name
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        val.name.slice(1)}
                                                </div>
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                className="flex items-center  border border-slate-200 rounded mb-4"
                                control={
                                    <Checkbox
                                        checked={contactCheckbox}
                                        onChange={(e) =>
                                            setContactCheckbox(e.target.checked)
                                        }
                                    />
                                }
                                label={transl("Contact Required on submission")}
                            />

                            <FormControlLabel
                                className="flex items-center  border border-slate-200 rounded mb-4"
                                control={
                                    <Checkbox
                                        checked={attachmentCheckbox}
                                        onChange={(e) =>
                                            setAttachmentCheckbox(
                                                e.target.checked
                                            )
                                        }
                                    />
                                }
                                label={transl(
                                    "Attachment Required on submission"
                                )}
                            />

                            {resultError && (
                                <Alert severity="error" className="mb-4">
                                    {resultError}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ width: "100%" }}
                            >
                                {transl("add result")}
                            </Button>
                        </form>
                    </div>
                    {formResultsList?.length ? (
                        <ResultTableList
                            formResultsList={formResultsList}
                            removeResult={removeResult}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default FormResultCreator;
