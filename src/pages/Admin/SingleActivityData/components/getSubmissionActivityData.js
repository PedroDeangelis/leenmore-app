const getSubmissionActivityData = (submissions, results) => {
    var workers = {};
    var resultList = results.map((result) => JSON.parse(result));
    const greensResults = resultList.reduce((acc, item, index) => {
        if (item.color === "green") {
            acc.push({ ...item, pos: index });
        }
        return acc;
    }, []);

    var lastSubmissionPerShareholder = getLastSubmissions(submissions);

    lastSubmissionPerShareholder.forEach((submission) => {
        const worker = submission.user_name;
        var shares = submission.shareholder.shares;
        shares = shares.replace(",", "");
        shares = shares.replace(".", "");
        shares = parseInt(shares);

        if (!workers[worker]) {
            workers[worker] = {
                worker: worker,
                totalReports: 0,
                totalSharesContacted: 0,
                proxyShareholders: 0,
                ownedSharesByProxy: 0,
            };
        }

        // workers[worker].totalReports += 1;
        workers[worker].totalSharesContacted += shares;

        // check if its a green result
        if (greensResults.some((item) => item.pos == submission.result)) {
            workers[worker].proxyShareholders += 1;
            workers[worker].ownedSharesByProxy += shares;
        }
    });

    // totalReports per worker
    submissions.forEach((submission) => {
        const worker = submission.user_name;

        workers[worker].totalReports += 1;
    });

    return workers;
};

export default getSubmissionActivityData;

const getLastSubmissions = (submissions) => {
    const lastSubmissionsMap = {};

    submissions.forEach((submission) => {
        const key = `${submission.user_id}-${submission.shareholder_id}`;
        if (
            !lastSubmissionsMap[key] ||
            new Date(submission.date) > new Date(lastSubmissionsMap[key].date)
        ) {
            lastSubmissionsMap[key] = submission;
        }
    });

    return Object.values(lastSubmissionsMap);
};

export { getLastSubmissions };

function findRepeatedShareholders(submissions) {
    const shareholderCount = {};
    const repeatedShareholders = {};

    submissions.forEach((submission) => {
        const shareholderId = submission.shareholder_id;
        shareholderCount[shareholderId] =
            (shareholderCount[shareholderId] || 0) + 1;

        if (shareholderCount[shareholderId] > 1) {
            repeatedShareholders[shareholderId] =
                shareholderCount[shareholderId];
        }
    });

    return repeatedShareholders;
}
