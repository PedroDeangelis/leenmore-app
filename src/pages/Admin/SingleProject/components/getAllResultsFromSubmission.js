export default function getAllResultsFromSubmission(submission) {
	if (!submission?.length) return null;

	let allResults = [];

	submission.forEach((item) => {
		allResults.push(item.result);
	});

	allResults = allResults.reduce((acc, curr) => {
		if (typeof acc[curr] == "undefined") {
			acc[curr] = 1;
		} else {
			acc[curr] += 1;
		}
		return acc;
	}, {});

	return allResults;
}
