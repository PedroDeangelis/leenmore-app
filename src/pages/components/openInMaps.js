export const openInMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://map.naver.com/?query=${encodedAddress}`;
    window.open(url, "_blank");
};
