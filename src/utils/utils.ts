// the backend api does not support any other http methods other than GET and POST
type AcceptedHttpMethod = "GET" | "POST";

export async function apiFetch(url : string, method : AcceptedHttpMethod = "GET", body : Object = {}) : Promise<Response> {
  if (url.trim() === "") return null;

  url = `/api${url}`;

  let headers, res;

  if (method === "POST") {
    headers = new Headers({
      "X-CSRF-Token": window.sessionStorage.getItem("csrfToken") as string
    });

    res = await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: headers,
      credentials: "same-origin"
    });
  } else {
    res = await fetch(url, {
      method: method,
      credentials: "same-origin"
    });
  }

  return res;
}

export function isSuccess(status : number) : boolean {
  if (/^2\d\d$/.test(status.toString())) return true;

  return false;
}