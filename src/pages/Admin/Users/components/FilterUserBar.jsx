import { FormControl, InputLabel, IconButton, MenuItem, Select } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import React from "react";
import transl from "../../../components/translate";

const STATUS_OPTIONS = ["active", "deactivated"];
const ROLE_OPTIONS = ["worker", "admin"];
const PHONE_OPTIONS = ["has phone number", "no phone number"];

function FilterUserBar({
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    phoneFilter,
    setPhoneFilter,
    nameSort,
    setNameSort,
}) {
    return (
        <div className="max-w-3xl mb-8 p-2 border border-slate-300 rounded-xl bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <FormControl fullWidth size="small">
                <InputLabel id="simple-select-user-status">
                    {transl("Status")}
                </InputLabel>
                <Select
                    labelId="simple-select-user-status"
                    id="simple-select-user-status"
                    value={statusFilter}
                    label={transl("Status")}
                    onChange={(event) => setStatusFilter(event.target.value)}
                >
                    <MenuItem value="all">{transl("Show All")}</MenuItem>
                    {STATUS_OPTIONS.map((item) => (
                        <MenuItem key={item} value={item}>
                            {transl(item)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel id="simple-select-user-role">
                    {transl("Role")}
                </InputLabel>
                <Select
                    labelId="simple-select-user-role"
                    id="simple-select-user-role"
                    value={roleFilter}
                    label={transl("Role")}
                    onChange={(event) => setRoleFilter(event.target.value)}
                >
                    <MenuItem value="all">{transl("Show All")}</MenuItem>
                    {ROLE_OPTIONS.map((item) => (
                        <MenuItem key={item} value={item}>
                            {transl(item)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel id="simple-select-user-phone">
                    {transl("Phone number")}
                </InputLabel>
                <Select
                    labelId="simple-select-user-phone"
                    id="simple-select-user-phone"
                    value={phoneFilter}
                    label={transl("Phone number")}
                    onChange={(event) => setPhoneFilter(event.target.value)}
                >
                    <MenuItem value="all">{transl("Show All")}</MenuItem>
                    {PHONE_OPTIONS.map((item) => (
                        <MenuItem key={item} value={item}>
                            {transl(item)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div className="flex items-center justify-between pl-3">
                <p className="text-sm text-slate-600">
                    {transl("Sort by name")}
                </p>
                <IconButton
                    color="primary"
                    aria-label={transl("Sort by name")}
                    onClick={() =>
                        setNameSort(nameSort === "asc" ? "desc" : "asc")
                    }
                >
                    {nameSort === "asc" ? (
                        <ArrowUpwardIcon />
                    ) : (
                        <ArrowDownwardIcon />
                    )}
                </IconButton>
            </div>
        </div>
    );
}

export default FilterUserBar;
