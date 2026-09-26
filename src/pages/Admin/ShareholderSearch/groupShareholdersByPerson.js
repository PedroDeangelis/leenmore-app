// `shares` is a text column holding comma-formatted numbers, and some rows are
// null. Same rule as getPercentageRateForShareholder.
export const parseShares = (value) =>
    Math.trunc(Number(String(value ?? "").replace(/,/g, "")) || 0);

const isFullRegistration = (value) => /^\d{13}$/.test(value ?? "");

/**
 * There is no person table: `shareholder` holds one row per (project x person).
 * Rows are grouped by name + date_of_birth_code (the app's 고유번호) rather
 * than by registration, because Excel mangled ~115k registrations into values
 * like "8.9E+12" while their date_of_birth_code stayed intact.
 */
export const groupShareholdersByPerson = (shareholders = []) => {
    const people = new Map();

    shareholders.forEach((row) => {
        const name = (row.name ?? "").trim();
        const dobCode = row.date_of_birth_code ?? "";
        const key = `${name}|${dobCode}`;

        if (!people.has(key)) {
            people.set(key, {
                key,
                name,
                dobCode,
                sex: row.sex,
                registration: "",
                totalShares: 0,
                rows: [],
            });
        }

        const person = people.get(key);
        person.rows.push(row);
        person.totalShares += parseShares(row.shares);

        if (!person.sex && row.sex) person.sex = row.sex;

        // Prefer a clean 13-digit registration over a mangled or masked one.
        if (
            row.registration &&
            !isFullRegistration(person.registration) &&
            (isFullRegistration(row.registration) || !person.registration)
        ) {
            person.registration = row.registration;
        }
    });

    return [...people.values()].map((person) => ({
        ...person,
        projectCount: new Set(person.rows.map((row) => row.project_id)).size,
    }));
};
