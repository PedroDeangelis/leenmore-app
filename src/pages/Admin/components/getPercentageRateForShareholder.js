import formatNumber from "../../components/formatNumber";
import { getTheResultColorOption } from "../../components/resultColorOptions";
import transl from "../../components/translate";

export default function getPercentageRateForShareholder(
    shareholders,
    results,
    shares_target,
) {
    if (!shareholders?.length) return null;
    const normalizeOrder = (orderValue, fallbackValue) => {
        const numericOrder = Number(orderValue);
        return Number.isFinite(numericOrder) ? numericOrder : fallbackValue;
    };

    var resultList = results.map((result, index) => {
        const parsedResult = JSON.parse(result);

        return {
            ...parsedResult,
            order: normalizeOrder(parsedResult?.order, index),
        };
    });

    const eletronicVoteLabel = transl("eletronic vote");
    const eproxyLinkLabel = transl("eproxy link");

    resultList.push({
        name: eletronicVoteLabel,
        color: "b&w",
        order: 9999999999,
    });

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

    let allResults = [];
    let finalTotal = [];
    let colorTotal = {};

    shareholders.forEach((item) => {
        allResults.push({
            result: item.result,
            shares: Number(item.shares.replace(/,/g, "")),
        });
    });

    const hasEproxyLink = (shareholder) =>
        shareholder.api_recipient_contact &&
        shareholder.api_recipient_completion_date;

    const getResultColor = (resultValue) => {
        const index = Number.parseInt(resultValue, 10);
        if (!Number.isFinite(index)) {
            return null;
        }
        return resultList[index]?.color ?? null;
    };

    allResults = shareholders.map((item) => {
        const isGreenResult = getResultColor(item.result) === "green";
        let result = item.result;

        if (item.eletronic_voting?.length) {
            result = eletronicVoteLabel;
        } else if (hasEproxyLink(item)) {
            result = eproxyLinkLabel;
        }

        return {
            result: result,
            shares: Number(item.shares.replace(/,/g, "")),
            total: 0,
        };
    });

    resultList.forEach((item, key) => {
        let total = 0;
        allResults.forEach((item2) => {
            if (key == item2.result) {
                total += parseInt(item2.shares);
            } else if (
                item2.result == eletronicVoteLabel &&
                item.name == eletronicVoteLabel
            ) {
                total += parseInt(item2.shares);
            } else if (
                item2.result == eproxyLinkLabel &&
                item.name == eproxyLinkLabel
            ) {
                total += parseInt(item2.shares);
            }
        });
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
