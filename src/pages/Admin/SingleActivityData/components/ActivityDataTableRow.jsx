import { TableCell, TableRow } from "@mui/material";
import React from "react";
import styled from "styled-components";
import formatNumber from "../../../components/formatNumber";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: "#fbfbfb",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

function ActivityDataTableRow({ worker, data }) {
    return (
        <StyledTableRow>
            <TableCell>{worker}</TableCell>
            <TableCell>{data.totalReports}</TableCell>
            <TableCell>{formatNumber(data.totalSharesContacted)}</TableCell>
            <TableCell className="bg-amber-200">
                {formatNumber(data.proxyShareholders)}
            </TableCell>
            <TableCell className="bg-emerald-200">
                {formatNumber(data.ownedSharesByProxy)}
            </TableCell>
        </StyledTableRow>
    );
}

export default ActivityDataTableRow;
