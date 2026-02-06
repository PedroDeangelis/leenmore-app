import { TableBody } from "@mui/material";
import React, { useEffect, useState } from "react";
import ResultsTableLoopItem from "./ResultsTableLoopItem";

function ResultsTableLoop({ results, setResults, isEdit }) {
    const [resultsParsed, setResultsParsed] = useState([]);

    useEffect(() => {
        if (results) {
            let resultsTemp = [...results];

            resultsTemp = resultsTemp.map((result, index) => {
                let resultParsed = JSON.parse(result);

                if (resultParsed?.order === undefined) {
                    resultParsed = { ...resultParsed, order: index };
                }

                return resultParsed;
            });

            setResultsParsed(resultsTemp);
        }
    }, [results]);

    return (
        <TableBody>
            {resultsParsed
                .sort((a, b) => a?.order - b?.order)
                .map((value, key) => {
                    return (
                        <ResultsTableLoopItem
                            key={key}
                            result={value}
                            isEdit={isEdit}
                            setResults={setResults}
                            index={key}
                        />
                    );
                })}
        </TableBody>
    );
}

export default ResultsTableLoop;
