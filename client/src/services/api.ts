import axios from 'axios';

const normalizeBaseUrl = (value: string) => {
    const trimmed = value.trim();
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

const isLocalhostHost = (value: string) => value.includes('localhost') || value.includes('127.0.0.1');

export const getGuestId = () => {
    if (typeof window === 'undefined') return 'server_side_guest';
    let guestId = localStorage.getItem('deepdetect_guest_id');
    if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem('deepdetect_guest_id', guestId);
    }
    return guestId;
};

const isBrowserLocalhost = () => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

const resolveApiBaseUrl = () => {
    const configured = normalizeBaseUrl(import.meta.env.VITE_API_URL || '');
    if (!configured) return '';

    const pointsToLocalhost = isLocalhostHost(configured);
    if (pointsToLocalhost && !isBrowserLocalhost()) {
        // Prevent broken hosted builds caused by local-only env values.
        return '';
    }

    return configured;
};

const configuredApiBaseUrl = resolveApiBaseUrl();

const getApiBaseCandidates = () => {
    const candidates: string[] = [];
    const addCandidate = (value: string) => {
        if (!candidates.includes(value)) {
            candidates.push(value);
        }
    };

    if (!configuredApiBaseUrl) {
        addCandidate('');
        return candidates;
    }

    // On localhost, prefer the current origin first so Vite's /api proxy works.
    if (isBrowserLocalhost() && isLocalhostHost(configuredApiBaseUrl)) {
        addCandidate('');
        addCandidate(configuredApiBaseUrl);
        return candidates;
    }

    addCandidate(configuredApiBaseUrl);
    addCandidate('');
    return candidates;
};

const apiBaseCandidates = getApiBaseCandidates();
const primaryApiBaseUrl = apiBaseCandidates[0] ?? '';
const toApiUrl = (baseUrl: string, path: string) => `${baseUrl}/api${path}`;

const api = axios.create({
    baseURL: toApiUrl(primaryApiBaseUrl, ''),
});

const isProxyStyleFailure = (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.response) {
        return false;
    }

    const responseText = typeof error.response.data === 'string' ? error.response.data : '';
    const responseContentType = String(error.response.headers?.['content-type'] || '');

    return Boolean(
        error.response.status === 500 &&
        (
            /proxy|econnrefused|localhost:5002|127\.0\.0\.1:5002|socket hang up/i.test(responseText) ||
            responseContentType.includes('text/html')
        )
    );
};

export const isApiUnavailableError = (error: unknown) =>
    axios.isAxiosError(error) && (!error.response || isProxyStyleFailure(error));

const shouldTryNextCandidate = (error: unknown) => isApiUnavailableError(error);

const postToCandidate = <T>(baseUrl: string, path: string, payload: T, config?: Parameters<typeof api.post>[2]) => {
    return axios.post(toApiUrl(baseUrl, path), payload, config);
};

const getFromCandidate = (baseUrl: string, path: string, config?: Parameters<typeof api.get>[1]) => {
    return axios.get(toApiUrl(baseUrl, path), config);
};

export const postWithApiFallback = async <T>(path: string, payload: T, config?: Parameters<typeof api.post>[2]) => {
    let lastError: unknown;

    for (const baseUrl of apiBaseCandidates) {
        try {
            return await postToCandidate(baseUrl, path, payload, config);
        } catch (error) {
            lastError = error;
            if (!shouldTryNextCandidate(error)) {
                throw error;
            }
        }
    }

    throw lastError;
};

export const getWithApiFallback = async (path: string, config?: Parameters<typeof api.get>[1]) => {
    let lastError: unknown;

    for (const baseUrl of apiBaseCandidates) {
        try {
            return await getFromCandidate(baseUrl, path, config);
        } catch (error) {
            lastError = error;
            if (!shouldTryNextCandidate(error)) {
                throw error;
            }
        }
    }

    throw lastError;
};

export const checkHealth = async () => {
    for (const baseUrl of apiBaseCandidates) {
        try {
            const healthUrl = baseUrl ? `${baseUrl}/api/health` : '/api/health';
            const res = await axios.get(healthUrl);
            return res.data;
        } catch (error) {
            if (!shouldTryNextCandidate(error)) {
                console.error("API Health Check Failed", error);
                return null;
            }
        }
    }

    return null;
};

export const getApiHostLabel = () => primaryApiBaseUrl || 'the local /api route';

export default api;
