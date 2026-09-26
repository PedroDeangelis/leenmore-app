import { TableBody } from "@mui/material";
import React, { useMemo } from "react";
import ResultsTableLoopItem from "./ResultsTableLoopItem";
import {
    parseProjectResults,
    sortResultsForDisplay,
} from "../../../../components/projectResults";

function ResultsTableLoop({ results, setResults, isEdit }) {
    // Derived, not mirrored in state: the previous useState/useEffect pair left a
    // render where the parsed copy was stale relative to `results`, which was
    // another way for an edit to land on the wrong slot.
    const parsed = useMemo(() => parseProjectResults(results), [results]);

    const displayOrder = useMemo(
        () => sortResultsForDisplay(parsed),
        [parsed],
    );

    return (
        <TableBody>
            {displayOrder.map((value) => (
                <ResultsTableLoopItem
                    // Key and address rows by immutable identity, never by
                    // display position: `index` is what the item writes to.
                    key={value.physicalIndex}
                    result={value}
                    isEdit={isEdit}
                    setResults={setResults}
                    index={value.physicalIndex}
                    allResults={parsed}
                />
            ))}
        </TableBody>
    );
}

export default ResultsTableLoop;
