import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";
import ActivityDataTableRow from "./ActivityDataTableRow";
import getSubmissionActivityData from "./getSubmissionActivityData";
import ArrowSortFilter from "./ArrowSortFilter";
import sortObjectAcvivityData from "./sortObjectAcvivityData";

function ActivityDataTable({
    submissions,
    results,
    sortFilter,
    setSortFilter,
}) {
    const [data, setData] = useState({});

    useEffect(() => {
        const _data = getSubmissionActivityData(submissions, results);

        // sort
        const _dataSorted = sortObjectAcvivityData(_data, sortFilter);

        setData(_dataSorted);
    }, [submissions, sortFilter]);

    return (
        <div className="w-9/12 pb-10">
            <TableContainer
                component={Paper}
                sx={{
                    maxWidth: "100%",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <ArrowSortFilter
                                    sortFilter={sortFilter}
                                    setSortFilter={setSortFilter}
                                    currentItem="worker"
                                />
                            </TableCell>
                            <TableCell>
                                <ArrowSortFilter
                                    sortFilter={sortFilter}
                                    setSortFilter={setSortFilter}
                                    currentItem="total reports"
                                />
                            </TableCell>
                            <TableCell>
                                <ArrowSortFilter
                                    sortFilter={sortFilter}
                                    setSortFilter={setSortFilter}
                                    currentItem="total shares contacted"
                                />
                            </TableCell>
                            <TableCell>
                                <ArrowSortFilter
                                    sortFilter={sortFilter}
                                    setSortFilter={setSortFilter}
                                    currentItem="proxy shareholders"
                                />
                            </TableCell>
                            <TableCell>
                                <ArrowSortFilter
                                    sortFilter={sortFilter}
                                    setSortFilter={setSortFilter}
                                    currentItem="owned shares by proxy"
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(data).map(([key, value]) => (
                            <ActivityDataTableRow
                                key={key}
                                data={value}
                                worker={key}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default ActivityDataTable;
