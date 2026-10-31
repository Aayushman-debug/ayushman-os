/**
 * Production API URL resolver.
 * In development (when VITE_API_URL is unset), relative `/api/...` calls
 * are handled by the Vite dev server proxy (`http://localhost:5000`).
 * In production (when VITE_API_URL is configured on Vercel, e.g. `https://ayushman-api.onrender.com`),
 * relative `/api/...` fetch calls are transparently routed to the deployed Express API.
 */
const envMeta = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};

const rawApiBase = (
  envMeta.VITE_API_URL ||
  envMeta.VITE_API_BASE_URL ||
  ''
)
  .trim()
  .replace(/\/+$/, '');

const API_PATH_REGEX = /^\/api(?:\/|\?|$)/;

export function resolveApiUrl(inputPath: string, baseUrl: string = rawApiBase): string {
  const cleanBase = baseUrl.trim().replace(/\/+$/, '');
  if (cleanBase && API_PATH_REGEX.test(inputPath)) {
    return `${cleanBase}${inputPath}`;
  }
  return inputPath;
}

if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const isApiRequest = typeof input === 'string' && API_PATH_REGEX.test(input);
    if (isApiRequest) {
      const headers = new Headers(init?.headers);
      const token = window.sessionStorage.getItem('ayushman_admin_token');
      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      const targetUrl = resolveApiUrl(input, rawApiBase);
      return originalFetch(targetUrl, {
        ...init,
        headers,
        credentials: init?.credentials || 'include',
      });
    }
    return originalFetch(input, init);
  };
}

export const API_BASE_URL = rawApiBase;
