import formatNumber from "../../components/formatNumber";
import { getTheResultColorOption } from "../../components/resultColorOptions";
import transl from "../../components/translate";

export default function getPercentageRateForShareholder(
    shareholders,
    results,
    shares_target
) {
    if (!shareholders?.length) return null;
    var resultList = results.map((result) => JSON.parse(result));

    resultList.push({
        name: transl("eletronic vote"),
        color: "b&w",
        order: 9999999999,
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

    allResults = shareholders.map((item) => {
        let result = item.eletronic_voting?.length
            ? transl("eletronic vote")
            : item.result;

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
                item2.result == transl("eletronic vote") &&
                item.name == transl("eletronic vote")
            ) {
                total += parseInt(item2.shares);
            }
        });
        finalTotal.push({
            result: key,
            name: item.name,
            color: item.color,
            total: total,
            order: item.order,
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
        results: finalTotal.sort((a, b) => a.order - b.order),
        total: formatNumber(totalTotal),
        percentage: ((totalTotal / shares_target) * 100).toFixed(2),
        colorTotal: colorTotal,
    };
}
