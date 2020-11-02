import React, { useState, useContext, Props, useEffect } from "react";
import Cookies from "js-cookie";
import { invalidateCSRFToken, AuthContext, updateCSRFToken } from "../auth/auth";
import Modal from "../components/Modal"
import "./AccountPage.css";
import { apiFetch, isSuccess } from "../utils/utils";
import { PageName } from "../types";

type Language = "en" | "de";

export default function AccountPage(props: {
  setPageName: (pageName: PageName) => void
}): JSX.Element {
  const [lang, setLang] = useState<Language>(Cookies.get("lang") as Language || "en")
  const [pwd, setPwd] = useState<string>("");
  const [newPwd, setNewPwd] = useState<string>("");
  const [repeatPwd, setReapeatPwd] = useState<string>("");
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  const auth = useContext(AuthContext);

  useEffect(() => {
    props.setPageName("Account");
  }, [])

  const changeLang = (lang: Language): void => {
    setLang(lang)
    Cookies.set("lang", lang);

    apiFetch("/users/change-lang", "POST")
      .then((res: Response) => {
        if (isSuccess(res.status)) {
          invalidateCSRFToken();
          updateCSRFToken(res.headers.get("X-CSRF-Token"))
          return;
        } else if (res.status === 401) {
          auth.toggleAuth();
          return;
        }
      });
  }

  const resetPwd = (): void => {
    if (newPwd !== repeatPwd) {
      alert("Your new password does not match your repeated password!");
    } else {
      alert("This feature hasn't been implemented yet!");
    }
  }

  const deleteAccount = (): void => {
    apiFetch("/users/delete-acc", "POST")
      .then((res: Response) => {
        if (isSuccess(res.status)) {
          auth.toggleAuth();
          invalidateCSRFToken();
          updateCSRFToken(res.headers.get("X-CSRF-Token"));
          return;
        } else if (res.status === 401) {
          auth.toggleAuth();
          return;
        }

        alert("There was an error deleting your account. Please try again later.");
      });
  }

  return (
    <div className="container max-container">
      <span>
        News Language:
        <select style={{marginLeft: 15}} value={lang} onChange={e => changeLang(e.target.value as Language)}>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </span> <br />
      Reset Password:
      <form>
        <div id="box">
          Current: <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Your current password" required />
          New: <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Your new password" required />
          Again: <input type="password" value={repeatPwd} onChange={e => setReapeatPwd(e.target.value)}
            placeholder="Repeat your new password" required />
          <button type="submit" onClick={resetPwd}>Reset</button>
        </div>
      </form>
      <button className="danger-btn" onClick={() => {
        setDisplayModal(true);
      }}>Delete Account</button>
      {displayModal &&
        <Modal>
          Do you really want to delete your account? <br />
          <button className="danger-btn" onClick={() => {
            setDisplayModal(false);
            deleteAccount();
          }}>Delete</button>
          <button onClick={() => setDisplayModal(false)}>Cancel</button>
        </Modal>
      }
    </div>
  );
}