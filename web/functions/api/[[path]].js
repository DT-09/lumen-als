/**
 * Cloudflare Pages Function: same-origin proxy for the Python learning API.
 * Set LUMEN_API_ORIGIN in Pages > Settings > Variables and Secrets to the
 * HTTPS origin of the separately deployed FastAPI service (no trailing slash).
 * The Python API must use a persistent writable volume and session isolation.
 */
export async function onRequest(context) {
  const origin = context.env.LUMEN_API_ORIGIN;
  if (!origin) {
    return new Response(JSON.stringify({
      detail: "Learning API is not configured. Set the Cloudflare Pages variable LUMEN_API_ORIGIN to the HTTPS origin of the deployed LUMEN FastAPI backend."
    }), { status: 503, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
  }
  let upstream;
  try { upstream = new URL(context.request.url); }
  catch { return new Response("Invalid request URL", { status: 400 }); }
  const base = origin.replace(/\/+$/, "");
  const target = base + upstream.pathname + upstream.search;
  const headers = new Headers(context.request.headers);
  headers.delete("host");
  headers.delete("cf-connecting-ip");
  const init = { method: context.request.method, headers, redirect: "manual" };
  if (context.request.method !== "GET" && context.request.method !== "HEAD") init.body = context.request.body;
  try {
    const response = await fetch(target, init);
    const outHeaders = new Headers(response.headers);
    outHeaders.set("cache-control", "no-store");
    outHeaders.delete("content-security-policy-report-only");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers: outHeaders });
  } catch {
    return new Response(JSON.stringify({ detail: "The configured learning API could not be reached. Check LUMEN_API_ORIGIN and backend health." }), {
      status: 502, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
    });
  }
}
