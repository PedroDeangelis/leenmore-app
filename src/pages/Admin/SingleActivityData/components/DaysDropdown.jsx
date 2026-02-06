import {
    Card,
    CardContent,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";

function DaysDropdown({ daysWorked, daysSelected, setDaysSelected }) {
    const [dates, setDates] = useState([]);

    const handleDateChange = (event) => {
        const val = event.target.value;

        if (val.includes("all")) {
            setDaysSelected([]);
        } else {
            setDaysSelected(val);
        }
    };

    useEffect(() => {
        if (daysWorked) {
            setDates(daysWorked);
        }
    }, [daysWorked]);

    return (
        <Card>
            <CardContent>
                <FormControl fullWidth>
                    <InputLabel id="simple-select-date">
                        {transl("date")}
                    </InputLabel>
                    <Select
                        labelId="simple-select-date"
                        id="simple-select-date"
                        value={daysSelected}
                        label={transl("date")}
                        onChange={handleDateChange}
                        multiple
                    >
                        <MenuItem value="all">{transl("Show All")}</MenuItem>
                        {dates
                            .sort((a, b) => b.localeCompare(a))
                            .map((item) => (
                                <MenuItem key={item} value={item}>
                                    <Checkbox
                                        checked={
                                            daysSelected.indexOf(item) > -1
                                        }
                                    />
                                    {item}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </CardContent>
        </Card>
    );
}

export default DaysDropdown;
