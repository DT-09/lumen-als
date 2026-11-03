/** STEMPROOF same-origin API proxy. Configure STEMPROOF_API_ORIGIN in Pages. */
export async function onRequest(context) {
  const origin = context.env.STEMPROOF_API_ORIGIN;
  const json = (detail, status) => new Response(JSON.stringify({detail}), {
    status, headers: {"content-type":"application/json; charset=utf-8","cache-control":"no-store"}
  });
  if (!origin) return json("API is not configured. Set STEMPROOF_API_ORIGIN to the HTTPS origin of the separate FastAPI service.",503);
  let upstream, backend;
  try { upstream = new URL(context.request.url); backend = new URL(origin); }
  catch { return json("Invalid STEMPROOF_API_ORIGIN.",500); }
  if (backend.protocol !== "https:" || backend.username || backend.password || backend.pathname !== "/" || backend.search || backend.hash)
    return json("STEMPROOF_API_ORIGIN must be an HTTPS origin only, without credentials or a path.",500);
  if (backend.host === upstream.host) return json("STEMPROOF_API_ORIGIN points to this Pages site and would create a proxy loop.",508);
  const headers = new Headers(context.request.headers);
  headers.delete("host"); headers.delete("cf-connecting-ip");
  const init = {method:context.request.method,headers,redirect:"manual"};
  if (context.request.method !== "GET" && context.request.method !== "HEAD") init.body = context.request.body;
  try {
    const response = await fetch(backend.origin + upstream.pathname + upstream.search,init);
    const out = new Headers(response.headers); out.set("cache-control","no-store");
    return new Response(response.body,{status:response.status,statusText:response.statusText,headers:out});
  } catch { return json("The configured API could not be reached. Check the backend origin and health endpoint.",502); }
}
