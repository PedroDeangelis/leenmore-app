import moment from "moment";
import transl from "../../../components/translate";

const getEndDate = (end_date) => {
    let daysLeft = null;
    let end_date_formated = moment(end_date).format("MM/DD");

    if (end_date) {
        //endDate = 2023-03-26 00:00:00+00;
        const days = moment(end_date).diff(moment(), "days") + 1;

        if (days > 0) {
            let text = transl("days left");
            daysLeft = (
                <p className=" mr-6 text-blue-800 font-bold ">
                    <span className="mr-4">주총일({end_date_formated})이</span>
                    {days} {text}
                </p>
            );
        } else if (days > -5) {
            let text = transl("expired end date");

            daysLeft = (
                <p className=" mr-6 text-sm font-bold ">
                    <span className="mr-4">주총일({end_date_formated})이</span>
                    {text}
                </p>
            );
        } else {
            let text = transl("expired end date");

            daysLeft = (
                <p className=" mr-6 text-gray-400  text-sm ">
                    <span className="mr-4">주총일({end_date_formated})이</span>
                    {text}
                </p>
            );
        }
    }

    return daysLeft;
};

export default getEndDate;
