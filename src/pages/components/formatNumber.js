export default function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const numberWithCommas = (number) => {
    const parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

export const handleUpdateNumberWithCommas = (e) => {
    const rawValue = e.target.value.replace(/,/g, ""); // Remove existing commas
    const formattedValue = numberWithCommas(rawValue);
    e.target.value = formattedValue;
};
