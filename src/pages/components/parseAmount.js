// Receipt amounts are stored as display strings ("1,500"), so strip the
// grouping commas before comparing or summing. Mirrors the parsing in
// getOrganizedBills so a sorted order always agrees with the total shown,
// but tolerates a null/empty amount instead of throwing.
export default function parseAmount(amount) {
    const parsed = parseInt(String(amount ?? "").replace(/,/g, ""), 10);

    return Number.isNaN(parsed) ? 0 : parsed;
}
