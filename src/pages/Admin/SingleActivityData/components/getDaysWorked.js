const getDaysWorked = (submissions) => {
    var days = [];

    submissions.forEach((submission) => {
        const date = submission.date.split("T")[0];
        if (!days.includes(date)) {
            days.push(date);
        }
    });

    days = [...new Set(days)];

    days = days.sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    return days;
};

export default getDaysWorked;
