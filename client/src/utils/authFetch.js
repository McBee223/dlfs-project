export const authFetch = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (res.status === 401) {
        localStorage.removeItem("userToken");
        window.location.href = "/signin?reason=deleted";
    }
    return res;
};