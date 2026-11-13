import { PORTFOLIO_API } from '../api/axios';

/**
 * Sends JavaScript errors from visitors' browsers to the backend, which groups them,
 * lists them in Admin -> Errors and emails the owner (at most once per error per day).
 * Off on localhost. At most 5 reports per page load, and each distinct error once.
 */
const ENABLED = typeof window !== 'undefined' && !/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
const sent = new Set();
let budget = 5;

export const reportError = (error, extra = {}) => {
  if (!ENABLED || budget <= 0) return;
  try {
    const message = String(error?.message || error || 'Unknown error').slice(0, 1000);
    const stack = String(error?.stack || extra.stack || '').slice(0, 8000);
    const key = `${message}|${stack.split('\n')[1] || ''}`;
    if (sent.has(key)) return;
    sent.add(key);
    budget -= 1;
    fetch(`${PORTFOLIO_API}/errors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, stack, path: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  } catch { /* never throw from the error reporter */ }
};

export const installErrorReporting = () => {
  if (!ENABLED) return;
  window.addEventListener('error', (e) => {
    // Failed <img>/<script> loads also fire "error" on window without an Error object; skip those.
    if (!e.error && !e.message) return;
    reportError(e.error || e.message, { stack: e.error?.stack });
  });
  window.addEventListener('unhandledrejection', (e) => {
    const r = e.reason;
    // Network/API failures are already handled (and shown) by the pages themselves.
    if (r?.isAxiosError || r?.name === 'AbortError') return;
    reportError(r instanceof Error ? r : new Error(String(r)));
  });
};
