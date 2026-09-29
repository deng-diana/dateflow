// API base URLs. Server-side code runs inside Docker and reaches the API by
// service name; the browser reaches it through the host's published port.
export const SERVER_API = process.env.API_URL ?? "http://localhost:8000";
export const BROWSER_API =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
