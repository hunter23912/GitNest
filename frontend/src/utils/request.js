export const API_BASE_URL = "/api";

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  return fetch(url, options);
}
