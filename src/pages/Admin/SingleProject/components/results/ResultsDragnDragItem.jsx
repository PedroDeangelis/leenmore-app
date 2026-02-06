import React from "react";
import { getTheResultColorOption } from "../../../../components/resultColorOptions";
import { move } from "lodash";

function ResultsDragnDragItem({ result }) {
    return (
        <div
            className="text-center py-3"
            style={{
                backgroundColor: `${
                    getTheResultColorOption(result.color).background
                }`,
            }}
        >
            {result.name}
        </div>
    );
}

export default ResultsDragnDragItem;
