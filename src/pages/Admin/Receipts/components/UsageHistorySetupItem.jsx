import { FormControl, TextField } from "@mui/material";
import React, { useState } from "react";

function UsageHistorySetupItem({ item, onItemChange }) {
    return (
        <FormControl variant="outlined" className="w-full" sx={{ mb: 2 }}>
            <TextField
                variant="outlined"
                className="w-full bg-white overflow-hidden"
                size="small"
                value={item}
                onChange={(e) => onItemChange(e.target.value)}
            />
        </FormControl>
    );
}

export default UsageHistorySetupItem;
