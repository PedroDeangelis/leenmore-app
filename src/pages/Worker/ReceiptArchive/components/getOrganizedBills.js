export default function getOrganizedBills(receipts) {
    var bills = {
        list: [],
        total: 0,
    };

    receipts.forEach((receipt) => {
        // check if has bill list with receipt.usage_history

        let amount = receipt.amount;
        amount = amount.replace(/,/g, "");
        amount = parseInt(amount);

        if (
            bills.list.some(
                (bill) => bill.usage_history === receipt.usage_history
            )
        ) {
            // if has, add receipt.amount to bill.amount
            bills.list.forEach((bill) => {
                if (bill.usage_history === receipt.usage_history) {
                    bill.amount += amount;
                }
            });
        } else {
            // if not, add new bill to bills.list
            bills.list.push({
                usage_history: receipt.usage_history,
                amount: amount,
            });
        }
    });

    // sort bill list
    bills.list.sort((a, b) => {
        return a.amount < b.amount ? 1 : -1;
    });

    // calculate total
    bills.list.forEach((bill) => {
        bills.total += bill.amount;
    });

    return bills;
}
