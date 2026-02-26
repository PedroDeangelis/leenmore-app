const normalizeKey = (value) =>
    value
        ?.toString()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9ㄱ-힣]/g, "");

export default function setShareholderUpdateList(csv) {
    let shareholders = [];
    if (!csv?.length) return shareholders;

    const headerRow = csv[0] || [];
    const headerIndex = {};

    headerRow.forEach((col, idx) => {
        const norm = normalizeKey(col);
        if (norm) {
            headerIndex[norm] = idx;
        }
    });

    const getIndex = (...keys) => {
        for (const key of keys) {
            if (headerIndex[key] !== undefined) {
                return headerIndex[key];
            }
        }
        return null;
    };

    const indexes = {
        id: getIndex("uuid", "id") ?? 0,
        no: getIndex("no", "번호") ?? 1,
        shares: getIndex("numberofshares", "주식수") ?? 5,
        shares_total:
            getIndex("totalnumberofshares", "총보유주식수", "총소유주식수") ??
            6,
        eletronic_voting:
            getIndex("eletronicvoting", "전자투표", "전투날짜") ?? 7,
        database: getIndex("database", "종복여부", "중복여부") ?? 8,
        contact_info:
            getIndex("contact", "contactinfo", "전화번호", "전투연락처") ?? 9,
        address: getIndex("address", "주소") ?? 10,
        contact_worker: getIndex("contactforworker", "작업자연락처") ?? 11,
        user: getIndex("worker", "담당자") ?? 12,
        registration: getIndex(
            "residentregistrationnumber",
            "registration",
            "주민등록번호",
            "실명번호",
        ),
        prev_comment: getIndex("prevcomment", "구 판단") ?? 13,
        prev_result: getIndex("prevresult", "구 멘트") ?? 14,
        prev_note: getIndex("prevnote", "비고") ?? 15,
        api_recipient_contact:
            getIndex("apirecipientcontact", "전자위임날짜") ?? 16,
        api_recipient_completion_date:
            getIndex("apirecipientcompletiondate", "전자위임연락처") ?? 17,
    };

    csv?.forEach((row, key) => {
        if (key === 0) return;

        const id = row[indexes.id];
        if (!id) {
            return;
        }

        const user = row[indexes.user] || "";

        shareholders.push({
            id: id,
            no: row[indexes.no],
            registration: indexes.registration
                ? row[indexes.registration]
                : undefined,
            shares: row[indexes.shares],
            shares_total: row[indexes.shares_total],
            eletronic_voting: row[indexes.eletronic_voting],
            contact_info: row[indexes.contact_info],
            database: row[indexes.database],
            contact_worker: row[indexes.contact_worker],
            address: row[indexes.address],
            user:
                typeof user === "string"
                    ? user
                          .split("/")
                          .map((i) => i.trim())
                          .filter(Boolean)
                    : user,
            prev_comment: row[indexes.prev_comment],
            prev_result: row[indexes.prev_result],
            prev_note: row[indexes.prev_note],
            api_recipient_contact: row[indexes.api_recipient_contact],
            api_recipient_completion_date:
                row[indexes.api_recipient_completion_date],
        });
    });

    return shareholders;
}
