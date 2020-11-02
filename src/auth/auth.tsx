import { createContext } from "react";
import { apiFetch, isSuccess } from "../utils/utils";

export const AuthContext = createContext({
  isAuth: false,
  toggleAuth: () => { }
});

export function getCsrfToken() {
  if (window.sessionStorage.getItem("csrfToken") === null || window.sessionStorage.getItem("csrfToken") === "") {
    apiFetch("/get-csrf-token")
      .then((res: Response) => {
        if (isSuccess(res.status)) {
          const csrfToken = res.headers.get("X-CSRF-Token") as string;
          window.sessionStorage.setItem("csrfToken", csrfToken);
        } else {
          setTimeout(() => {
            getCsrfToken();
          }, 5000);
        }
      })
  }
}

export function invalidateCSRFToken() {
  window.sessionStorage.setItem("csrfToken", "");
}

export function updateCSRFToken(newToken: string): void {
  if (newToken.trim() === "") return;

  window.sessionStorage.setItem("csrfToken", newToken);
}