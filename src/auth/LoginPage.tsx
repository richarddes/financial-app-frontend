import React, { useState, useLayoutEffect, useContext, FormEvent, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { getCsrfToken, invalidateCSRFToken, AuthContext, updateCSRFToken } from "./auth";
import { apiFetch, isSuccess } from "../utils/utils";
import "./LoginPage.css";

export default function LoginPage(): JSX.Element {
  const history = useHistory();

  const [email, setEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [showErrMsg, setShowErrMsg] = useState<boolean>(false);

  const auth = useContext(AuthContext);

  useEffect(() => getCsrfToken(), [])

  // auto-login
  useLayoutEffect(() => {
    apiFetch("/check-credentials")
      .then((res: Response) => {
        if (isSuccess(res.status)) {
          auth.toggleAuth();
          history.push("/");
          return;
        }
      })
  }, []);

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();

    const data = {
      email: email,
      pass: pwd
    }

    apiFetch("/login", "POST", data)
      .then((res: Response) => {
        if (isSuccess(res.status)) {
          auth.toggleAuth();
          history.push("/");
          invalidateCSRFToken();
          updateCSRFToken(res.headers.get("X-CSRF-Token"))
          return;
        }

        setShowErrMsg(true);
        setInterval(() => setShowErrMsg(false), 4000);
        setPwd("");
      })
  }

  return (
    <div className="container centered-container min-container">
      <form role="form" onSubmit={handleSubmit}>
        Log In <br />
        <h5 role="alert" className="errText" style={{ opacity: showErrMsg ? 1 : 0 }}>Wrong Email or Password</h5>
        <h5>Email</h5>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <h5>Password</h5>
        <input type="password" placeholder="Password" value={pwd} onChange={e => setPwd(e.target.value)} required />
        <button className="big-btn" type="submit">LOG IN</button>
      </form>
      <Route render={({ history }) => (
        <h6 id="reset-pwd" tabIndex={0} style={{ marginTop: "10px" }} onClick={() => history.push("/reset-pwd/email")}>Forgot your password?</h6>
      )} />
      <span>
        Not a member?
        <Route render={({ history }) => (
          <button className="unimportant-btn" onClick={() => history.push("/signup")}>SIGN UP</button>
        )} />
      </span>
    </div>
  );
}

