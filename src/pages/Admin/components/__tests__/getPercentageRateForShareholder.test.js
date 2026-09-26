// The results panel is now computed from a server-side aggregate
// (project_shareholder_result_tally) instead of a full shareholder download.
// These tests pin the two paths together: whatever the RPC buckets, the
// rendered totals must match what the raw-array version produced.
//
// `tallyFromArray` below mirrors the SQL in
// supabase/migrations/*_add_project_shareholder_result_tally.sql. If that SQL
// changes, change this too -- they are the same rules in two languages.
import getPercentageRateForShareholder, {
    getPercentageRateFromTally,
} from "../getPercentageRateForShareholder";
import {
    PROJECT_TALLY_BUCKET_EV,
    PROJECT_TALLY_BUCKET_EPROXY,
    PROJECT_TALLY_BUCKET_NULL,
} from "../shareholderTallyBuckets";

function tallyFromArray(rows) {
    const buckets = new Map();
    let shareholderCount = 0;

    rows.forEach((row) => {
        let bucket;
        if ((row.eletronic_voting ?? "") !== "") {
            bucket = PROJECT_TALLY_BUCKET_EV;
        } else if (
            (row.api_recipient_contact ?? "") !== "" &&
            (row.api_recipient_completion_date ?? "") !== ""
        ) {
            bucket = PROJECT_TALLY_BUCKET_EPROXY;
        } else if (row.result === null || row.result === undefined) {
            bucket = PROJECT_TALLY_BUCKET_NULL;
        } else {
            bucket = String(row.result);
        }

        const cleaned = String(row.shares ?? "").replace(/,/g, "").trim();
        const shares = /^-?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/.test(cleaned)
            ? Math.trunc(Number(cleaned))
            : 0;

        const prev = buckets.get(bucket) ?? { count: 0, totalShares: 0 };
        buckets.set(bucket, {
            count: prev.count + 1,
            totalShares: prev.totalShares + shares,
        });
        shareholderCount += 1;
    });

    return { buckets, shareholderCount };
}

const results = [
    JSON.stringify({ name: "\uCC2C\uC131", color: "green", order: 0 }),
    JSON.stringify({ name: "\uBC18\uB300", color: "red", order: 1 }),
    JSON.stringify({ name: "\uBBF8\uC815", color: "yellow", order: 2 }),
];

const expectSamePaths = (rows, target = 10000) => {
    const fromArray = getPercentageRateForShareholder(rows, results, target);
    const fromTally = getPercentageRateFromTally(
        tallyFromArray(rows),
        results,
        target,
    );
    expect(JSON.stringify(fromTally)).toBe(JSON.stringify(fromArray));
};

describe("tally path matches the raw-array path", () => {
    it("sums plain results", () => {
        expectSamePaths([
            { result: "0", shares: "1,000" },
            { result: "0", shares: "2,500" },
            { result: "1", shares: "700" },
            { result: "2", shares: "50" },
        ]);
    });

    it("treats electronic voting as its own result", () => {
        expectSamePaths([
            { result: "0", shares: "1,000", eletronic_voting: "yes" },
            { result: "1", shares: "2,000", eletronic_voting: "" },
            { result: null, shares: "3,000", eletronic_voting: "y" },
        ]);
    });

    it("requires BOTH eproxy fields to be non-empty", () => {
        expectSamePaths([
            {
                result: "0",
                shares: "1,000",
                api_recipient_contact: "010-1",
                api_recipient_completion_date: "2026-01-01",
            },
            // Empty completion date -> NOT eproxy. Empty string, not null:
            // this is how the column actually stores "unset", and an
            // IS NOT NULL check in the SQL would wrongly bucket it here.
            {
                result: "0",
                shares: "2,000",
                api_recipient_contact: "010-2",
                api_recipient_completion_date: "",
            },
            {
                result: "1",
                shares: "3,000",
                api_recipient_contact: "",
                api_recipient_completion_date: "2026-01-01",
            },
        ]);
    });

    it("lets electronic voting win over eproxy", () => {
        expectSamePaths([
            {
                result: "0",
                shares: "1,000",
                eletronic_voting: "y",
                api_recipient_contact: "010-1",
                api_recipient_completion_date: "2026-01-01",
            },
        ]);
    });

    it("parses padded, comma-formatted and malformed share counts", () => {
        expectSamePaths([
            { result: "0", shares: " 7,000 " },
            { result: "0", shares: "280 " },
            { result: "1", shares: "220 " },
            { result: "1", shares: null },
            { result: "2", shares: "" },
            { result: "2", shares: "abc" },
        ]);
    });

    it("returns null for empty input from both paths", () => {
        expect(getPercentageRateForShareholder([], results, 100)).toBe(null);
        expect(
            getPercentageRateFromTally({ buckets: new Map() }, results, 100),
        ).toBe(null);
        expect(getPercentageRateFromTally(null, results, 100)).toBe(null);
    });
});

describe("shareholders with no result", () => {
    // Long-standing behaviour, preserved deliberately: on project 207 this is
    // 61,876 of 62,284 rows, so counting them would change every percentage.
    it("are excluded from the totals", () => {
        const rows = [
            { result: "0", shares: "1,000" },
            { result: null, shares: "9,999,999" },
            { result: null, shares: "5,000" },
        ];

        expectSamePaths(rows);
        expect(
            getPercentageRateFromTally(tallyFromArray(rows), results, 10000)
                .total,
        ).toBe("1,000");
    });

    it("still count toward the shareholder total", () => {
        const tally = tallyFromArray([
            { result: "0", shares: "1,000" },
            { result: null, shares: "5,000" },
        ]);
        expect(tally.shareholderCount).toBe(2);
    });
});
