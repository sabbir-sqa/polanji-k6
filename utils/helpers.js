// utils/helpers.js
export function addAuthHeaders(headers = {}, token) {
  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
}
