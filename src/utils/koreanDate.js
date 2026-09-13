import moment from "moment";

// Korea Standard Time is UTC+9 (no DST). Use these for any user-facing
// "today/now" default or day calculation so the date reflects the Korean
// calendar day regardless of the device's timezone.
export const koreanNow = () => moment().utcOffset(9);

export const koreanToday = (format = "YYYY-MM-DD") => koreanNow().format(format);

// Which Korean calendar day a stored timestamp falls on. Use this when
// comparing a database timestamp against a date the user picked, so the
// comparison happens on the same calendar the rest of the UI shows.
// Returns "" rather than moment's "Invalid date" string, so callers can
// compare the result against a date string without a bogus match.
export const koreanDay = (value, format = "YYYY-MM-DD") => {
    if (!value) {
        return "";
    }

    const isDateOnly =
        typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim());

    // A date-only value (a day the user picked, e.g. receipt.date) already
    // names the calendar day it means, so it is read as-is. Converting it to
    // KST would move it back a day whenever the device runs ahead of Korea.
    // Only a real timestamp gets shifted onto the Korean calendar.
    const parsed = isDateOnly
        ? moment(value.trim(), "YYYY-MM-DD")
        : moment(value).utcOffset(9);

    return parsed.isValid() ? parsed.format(format) : "";
};

// Whether a stored date/timestamp falls inside a "YYYY-MM-DD" range picked by
// the user. Both bounds are inclusive and an empty bound means unbounded. A
// value that cannot be parsed is excluded rather than silently kept.
export const isWithinKoreanDayRange = (value, from, to) => {
    if (!from && !to) {
        return true;
    }

    const day = koreanDay(value);

    if (!day) {
        return false;
    }

    if (from && day < from) {
        return false;
    }

    if (to && day > to) {
        return false;
    }

    return true;
};
