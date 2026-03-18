import moment from "moment/moment";
import transl from "../../../components/translate";

const CONTACT_HEADER = "\uC5F0\uB77D\uCC98";
const ASSIGNEE_PREFIX = "\uB2F4\uB2F9\uC790";
const SCRIPT_PREFIX = "\uBA58\uD2B8";
const PRIVACY_CONSENT_LABEL = "\uB3D9\uC758";

const compareSubmissionOrder = (a, b) => {
    const aDate = new Date(a?.date || a?.created_at || 0).getTime();
    const bDate = new Date(b?.date || b?.created_at || 0).getTime();

    if (aDate !== bDate) {
        return aDate - bDate;
    }

    const aCreatedAt = new Date(a?.created_at || a?.date || 0).getTime();
    const bCreatedAt = new Date(b?.created_at || b?.date || 0).getTime();

    if (aCreatedAt !== bCreatedAt) {
        return aCreatedAt - bCreatedAt;
    }

    const aId = Number(a?.id || 0);
    const bId = Number(b?.id || 0);

    return aId - bId;
};

const formatMomentValue = (value, format) => {
    if (!value) {
        return "";
    }

    const momentValue = moment(value);

    return momentValue.isValid() ? momentValue.format(format) : "";
};

const parseProjectResults = (results = []) =>
    results.map((value) => {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    });

const buildHeaderDates = (submissions = []) => {
    const sortedSubmissions = submissions
        .filter((submission) => submission?.date)
        .slice()
        .sort(compareSubmissionOrder);

    if (!sortedSubmissions.length) {
        return [];
    }

    const start = moment(sortedSubmissions[0].date);
    const end = moment(sortedSubmissions[sortedSubmissions.length - 1].date);

    if (!start.isValid() || !end.isValid()) {
        return [];
    }

    const dates = [];
    const currentDate = start.clone();

    while (currentDate.isSameOrBefore(end, "day")) {
        dates.push(currentDate.format("MMDD"));
        currentDate.add(1, "days");
    }

    return dates;
};

const buildSubmissionLookup = (submissions, resultTable) => {
    const submissionLookup = new Map();

    submissions
        .filter(Boolean)
        .slice()
        .sort(compareSubmissionOrder)
        .forEach((submission) => {
            const shareholderId = submission?.shareholder_id;

            if (!shareholderId) {
                return;
            }

            let shareholderEntry = submissionLookup.get(shareholderId);

            if (!shareholderEntry) {
                shareholderEntry = {
                    byDate: new Map(),
                    latestSubmissionDate: "",
                    latestSubmissionTimestamp: Number.NEGATIVE_INFINITY,
                    privacyConsentFile: "",
                };

                submissionLookup.set(shareholderId, shareholderEntry);
            }

            const createdAtTimestamp = new Date(
                submission?.created_at || submission?.date || 0,
            ).getTime();

            if (createdAtTimestamp >= shareholderEntry.latestSubmissionTimestamp) {
                shareholderEntry.latestSubmissionTimestamp = createdAtTimestamp;
                shareholderEntry.latestSubmissionDate = formatMomentValue(
                    submission?.created_at || submission?.date,
                    "YYYY-MM-DD",
                );
            }

            if (submission?.privacy_consent_file) {
                shareholderEntry.privacyConsentFile = PRIVACY_CONSENT_LABEL;
            }

            const dateKey = formatMomentValue(submission?.date, "MMDD");

            if (!dateKey) {
                return;
            }

            let dayEntry = shareholderEntry.byDate.get(dateKey);

            if (!dayEntry) {
                dayEntry = {
                    user: "",
                    notes: [],
                    contacts: [],
                    result: "",
                    latestDateTimestamp: Number.NEGATIVE_INFINITY,
                    latestCreatedAtTimestamp: Number.NEGATIVE_INFINITY,
                    latestId: Number.NEGATIVE_INFINITY,
                };

                shareholderEntry.byDate.set(dateKey, dayEntry);
            }

            if (String(submission?.note ?? "").trim() !== "") {
                dayEntry.notes.push(submission.note);
            }

            if (String(submission?.contact_worker ?? "").trim() !== "") {
                dayEntry.contacts.push(submission.contact_worker);
            }

            const submissionDateTimestamp = new Date(
                submission?.date || submission?.created_at || 0,
            ).getTime();
            const submissionCreatedAtTimestamp = new Date(
                submission?.created_at || submission?.date || 0,
            ).getTime();
            const submissionId = Number(submission?.id || 0);

            const isLatestForDay =
                submissionDateTimestamp > dayEntry.latestDateTimestamp ||
                (submissionDateTimestamp === dayEntry.latestDateTimestamp &&
                    (submissionCreatedAtTimestamp >
                        dayEntry.latestCreatedAtTimestamp ||
                        (submissionCreatedAtTimestamp ===
                            dayEntry.latestCreatedAtTimestamp &&
                            submissionId >= dayEntry.latestId)));

            if (isLatestForDay) {
                dayEntry.latestDateTimestamp = submissionDateTimestamp;
                dayEntry.latestCreatedAtTimestamp = submissionCreatedAtTimestamp;
                dayEntry.latestId = submissionId;
                dayEntry.user = submission?.user_name ?? "";
                dayEntry.result = resultTable[submission?.result]?.name ?? "";
            }
        });

    return submissionLookup;
};

const joinShareholderUsers = (users) => {
    if (Array.isArray(users)) {
        return users.join("/");
    }

    return users ?? "";
};

const buildShareholderRow = ({
    customer,
    projectTitle,
    resultTable,
    headerDates,
    shareholderSubmissionData,
}) => {
    const shareholderRow = [
        customer?.no,
        projectTitle,
        customer?.registration,
        `${customer?.name ?? ""}${customer?.date_of_birth_code ?? ""}`,
        customer?.sex,
        customer?.name,
        customer?.shares,
        customer?.shares_total,
        customer?.eletronic_voting,
        customer?.address,
        customer?.contact_info,
        customer?.database,
        customer?.contact_worker,
        joinShareholderUsers(customer?.user),
        shareholderSubmissionData?.latestSubmissionDate ?? "",
        resultTable[customer?.result]?.name,
        shareholderSubmissionData?.privacyConsentFile ?? "",
        customer?.api_recipient_contact,
        customer?.api_recipient_completion_date,
    ];

    headerDates.forEach((date) => {
        const currentDay = shareholderSubmissionData?.byDate?.get(date);

        shareholderRow.push(currentDay?.user ?? "");
        shareholderRow.push(currentDay?.notes?.join(" / ") ?? "");
        shareholderRow.push(currentDay?.contacts ?? []);
        shareholderRow.push(currentDay?.result ?? "");
    });

    return shareholderRow;
};

export default function getDownloadCSV({ project, projectShareholders }) {
    const headers = [
        transl("No"),
        transl("Company"),
        transl("Resident Registration Number"),
        transl("Name+First 6 Digits of Resident Registration Number"),
        transl("Sex"),
        transl("Name"),
        transl("Number of Shares"),
        transl("Total Number of Shares"),
        transl("Eletronic Voting"),
        transl("Address"),
        transl("Contact"),
        transl("Database"),
        CONTACT_HEADER,
        transl("Worker(s)"),
        transl("Submission Date"),
        transl("Result"),
        transl("Privacy Consent File"),
        transl("recipient contact"),
        transl("completion date"),
    ];

    const shareholders = Array.isArray(projectShareholders)
        ? projectShareholders
        : [];
    const submissions = Array.isArray(project?.submission)
        ? project.submission
        : [];
    const resultTable = parseProjectResults(project?.results);
    const headerDates = buildHeaderDates(submissions);
    const submissionLookup = buildSubmissionLookup(submissions, resultTable);

    headerDates.forEach((date) => {
        headers.push(`${ASSIGNEE_PREFIX}${date}`);
        headers.push(`${SCRIPT_PREFIX}${date}`);
        headers.push(`${transl("contact for worker")}${date}`);
        headers.push(`${transl("result")}${date}`);
    });

    return {
        header: headers,
        rowCount: shareholders.length,
        estimatedCellCount: headers.length * (shareholders.length + 1),
        forEachRow: (callback) => {
            shareholders.forEach((customer) => {
                callback(
                    buildShareholderRow({
                        customer,
                        projectTitle: project?.title,
                        resultTable,
                        headerDates,
                        shareholderSubmissionData: submissionLookup.get(
                            customer?.id,
                        ),
                    }),
                );
            });
        },
    };
}
