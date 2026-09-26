import formatNumber from "../../components/formatNumber";
import { getTheResultColorOption } from "../../components/resultColorOptions";
import transl from "../../components/translate";
import {
    PROJECT_TALLY_BUCKET_EV,
    PROJECT_TALLY_BUCKET_EPROXY,
    PROJECT_TALLY_BUCKET_NULL,
} from "./shareholderTallyBuckets";

const normalizeOrder = (orderValue, fallbackValue) => {
    const numericOrder = Number(orderValue);
    return Number.isFinite(numericOrder) ? numericOrder : fallbackValue;
};

const getSyntheticLabels = () => ({
    eletronicVoteLabel: transl("eletronic vote"),
    eproxyLinkLabel: transl("eproxy link"),
});

/**
 * Shared presentation half, used by both the raw-array and the server-tally
 * entry points below.
 *
 * `totalsByResult` maps a result key to a share total already truncated per
 * row. Keys are either the raw `result` string (matched against the PHYSICAL
 * INDEX of the result in `results`) or one of the two synthetic labels
 * (matched by name). A key matching neither -- notably "null" -- contributes
 * nothing, which is how null-result shareholders have always been excluded.
 */
function buildResultRates(totalsByResult, results, shares_target) {
    const { eletronicVoteLabel, eproxyLinkLabel } = getSyntheticLabels();

    var resultList = results.map((result, index) => {
        const parsedResult = JSON.parse(result);

        return {
            ...parsedResult,
            order: normalizeOrder(parsedResult?.order, index),
        };
    });

    resultList.push({
        name: eletronicVoteLabel,
        color: "b&w",
        order: 9999999999,
    });

    // Order matters: greenOrders is read AFTER the e-vote row is pushed but
    // BEFORE the e-proxy row, so the e-proxy row sorts just after the last
    // green option. Reordering these three statements moves it in the output.
    const greenOrders = resultList
        .map((item, index) => ({
            color: item?.color,
            order: normalizeOrder(item?.order, index),
        }))
        .filter((item) => item.color === "green")
        .map((item) => item.order);

    const eproxyOrder = greenOrders.length
        ? Math.max(...greenOrders) + 0.01
        : 9999999998;

    resultList.push({
        name: eproxyLinkLabel,
        color: "green",
        order: eproxyOrder,
    });

    let finalTotal = [];
    let colorTotal = {};

    resultList.forEach((item, key) => {
        // Matches the original semantics exactly: a normal result matches on
        // physical index, while the two synthetic rows match on their label.
        let total = totalsByResult.get(String(key)) ?? 0;

        if (item.name === eletronicVoteLabel) {
            total += totalsByResult.get(eletronicVoteLabel) ?? 0;
        }
        if (item.name === eproxyLinkLabel) {
            total += totalsByResult.get(eproxyLinkLabel) ?? 0;
        }

        finalTotal.push({
            result: key,
            name: item.name,
            color: item.color,
            total: total,
            order: normalizeOrder(item.order, key),
        });
    });

    finalTotal = finalTotal
        .filter((item) => item.total > 0)
        .map((item) => {
            const colorObj = getTheResultColorOption(item.color);
            let percentage = (item.total / shares_target) * 100;

            //add the color to the total, if the color is in the array then add the total to the color
            if (colorTotal.hasOwnProperty(item.color)) {
                colorTotal[item.color]["total"] += item.total;
                colorTotal[item.color]["percentage"] += percentage;
            } else {
                colorTotal[item.color] = {
                    color: colorObj,
                    total: item.total,
                    result: item.result,
                    percentage: percentage,
                };
            }

            return {
                ...item,
                colorHex: colorObj.background,
                percentage: (percentage > 100 ? 100 : percentage).toFixed(2),
                //percentage: (percentage > 100 ? 100 : percentage).toFixed(2),
                total: formatNumber(item.total),
                totalClean: item.total,
            };
        });

    let totalTotal = 0;
    finalTotal.forEach((item) => {
        totalTotal += item.totalClean;
    });

    //map the colorTotal and return all the values
    Object.entries(colorTotal).forEach(([key, value]) => {
        colorTotal[key]["total"] = formatNumber(colorTotal[key]["total"]);
    });

    return {
        results: finalTotal.sort(
            (a, b) =>
                normalizeOrder(a.order, Number.MAX_SAFE_INTEGER) -
                normalizeOrder(b.order, Number.MAX_SAFE_INTEGER)
        ),
        total: formatNumber(totalTotal),
        percentage: ((totalTotal / shares_target) * 100).toFixed(2),
        colorTotal: colorTotal,
    };
}

/**
 * Tally from a raw shareholder array. Still used by the dashboard, which holds
 * the rows in memory already. Prefer getPercentageRateFromTally where only the
 * totals are needed -- it does not require downloading every row.
 */
export default function getPercentageRateForShareholder(
    shareholders,
    results,
    shares_target,
) {
    if (!shareholders?.length) return null;

    const { eletronicVoteLabel, eproxyLinkLabel } = getSyntheticLabels();

    // `shares` is a text column holding comma-formatted numbers, and a few rows
    // are null -- an unguarded .replace() here blanked the whole results panel.
    const parseShares = (value) =>
        Number(String(value ?? "").replace(/,/g, "")) || 0;

    const hasEproxyLink = (shareholder) =>
        shareholder.api_recipient_contact &&
        shareholder.api_recipient_completion_date;

    // Bucket once, then look up per result. The previous nested forEach was
    // resultList.length * shareholders.length (~300k iterations at 30k rows).
    const totalsByResult = new Map();
    shareholders.forEach((item) => {
        let result = item.result;

        if (item.eletronic_voting?.length) {
            result = eletronicVoteLabel;
        } else if (hasEproxyLink(item)) {
            result = eproxyLinkLabel;
        }

        const key = String(result);
        totalsByResult.set(
            key,
            (totalsByResult.get(key) ?? 0) + Math.trunc(parseShares(item.shares)),
        );
    });

    return buildResultRates(totalsByResult, results, shares_target);
}

/**
 * Same output, computed from the server-side aggregate instead of a full
 * shareholder download. See useProjectShareholderTally.
 */
export function getPercentageRateFromTally(tally, results, shares_target) {
    if (!tally?.buckets?.size) return null;

    const { eletronicVoteLabel, eproxyLinkLabel } = getSyntheticLabels();

    const totalsByResult = new Map();
    tally.buckets.forEach((value, bucket) => {
        let key;

        if (bucket === PROJECT_TALLY_BUCKET_EV) {
            key = eletronicVoteLabel;
        } else if (bucket === PROJECT_TALLY_BUCKET_EPROXY) {
            key = eproxyLinkLabel;
        } else if (bucket === PROJECT_TALLY_BUCKET_NULL) {
            // Deliberately a key nothing looks up. String(null) === "null" was
            // what the array version produced, and buildResultRates only ever
            // reads "0".."n" and the two labels -- so shareholders with no
            // result have never counted toward the totals. Mapping this to a
            // real row would change every displayed percentage.
            key = "null";
        } else {
            key = bucket;
        }

        totalsByResult.set(
            key,
            (totalsByResult.get(key) ?? 0) + value.totalShares,
        );
    });

    return buildResultRates(totalsByResult, results, shares_target);
}
