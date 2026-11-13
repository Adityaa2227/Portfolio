import axios from 'axios';

/**
 * The portfolio API lives in the "portfolio" module of Aditya Universal Backend
 * (/api/v1/portfolio). Override with VITE_API_URL if it ever moves.
 */
export const API_ORIGIN = import.meta.env.PROD
  ? 'https://aditya-universal-backend.onrender.com'
  : 'http://localhost:5000';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${API_ORIGIN}/api/v1/portfolio`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// The backend wraps responses as { success, data, message } and errors as
// { success: false, error: { code, message } }. Unwrap both here so the rest of
// the app keeps working with plain data and `err.response.data.message`.
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      response.data = body.data;
    }
    return response;
  },
  (error) => {
    const body = error?.response?.data;
    if (body && typeof body === 'object' && body.error?.message) {
      const details = Array.isArray(body.error.details) ? body.error.details.map((d) => d.message).filter(Boolean) : [];
      error.response.data = { ...body, message: details[0] || body.error.message };
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * GET for pages with no bundled fallback (e.g. the blog). Waits up to 60 s and retries
 * once on timeouts, network errors, 5xx and 429 (rate limited, after a short pause).
 * Other 4xx answers (e.g. 404 not found) are not retried.
 */
export const getWithWakeup = async (url, config = {}) => {
  const attempt = () => api.get(url, { timeout: 60000, ...config });
  try {
    return await attempt();
  } catch (err) {
    const status = err?.response?.status;
    if (status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } else if (status && status < 500) {
      throw err;
    }
    return attempt();
  }
};
