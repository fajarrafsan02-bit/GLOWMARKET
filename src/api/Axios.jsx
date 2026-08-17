import axios from "axios";

const api = axios.create({
    baseURL: "/",
    timeout: 30000,
    withCredentials: true,
});

let refreshPromise = null;

function urlAuthKhusus(url) {
    if (!url) return false;
    return (
        url.includes("/auth/refresh") ||
        url.includes("/auth/login") ||
        url.includes("/auth/logout") ||
        url.includes("/auth/login-admin") ||
        url.includes("/auth/verifikasi-otp")
    );
}

function cobaRefresh() {
    if (!refreshPromise) {
        refreshPromise = api
            .post("/auth/refresh", {}, { _skipRefresh: true, _skipAuthLogout: true })
            .then(() => true)
            .catch(() => false)
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

function harusAbaikanLogout(url, config) {
    if (config?._skipAuthLogout) return true;
    if (!url) return false;
    return url.includes("/auth/");
}

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const config = err?.config;
        const url = config?.url || "";
        const data = err?.response?.data;
        const message =
            data?.message ||
            data?.error ||
            (Array.isArray(data?.errors) ? data.errors.join(", ") : undefined);

        if (message) {
            err.message = message;
        }

        const status = err?.response?.status;
        if (status !== 401) {
            return Promise.reject(err);
        }

        if (!config?._retry && !config?._skipRefresh && !urlAuthKhusus(url)) {
            const ok = await cobaRefresh();
            if (ok) {
                config._retry = true;
                return api(config);
            }
            window.dispatchEvent(new Event("auth:unauthorized"));
            return Promise.reject(err);
        }

        if (!harusAbaikanLogout(url, config)) {
            window.dispatchEvent(new Event("auth:unauthorized"));
        }

        return Promise.reject(err);
    },
);

export default api;
