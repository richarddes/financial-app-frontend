import React, { useState, FormEvent, useEffect } from "react";
import { Route, useHistory } from "react-router";
import { getCsrfToken, invalidateCSRFToken, updateCSRFToken } from "./auth";
import { apiFetch, isSuccess } from "../utils/utils";

export default function SignupPage() {
  const history = useHistory();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");

  useEffect(() => getCsrfToken(), [])

  const handleSubmit = (event : FormEvent) : void => {
    event.preventDefault();
    const data = {
      email: email,
      pass: pwd,
      firstName: firstName,
      lastName: lastName
    }

    apiFetch("/register", "POST", data)
      .then((res : Response) => {   
        if (isSuccess(res.status)) {
          history.push("/login");
          invalidateCSRFToken();
          updateCSRFToken(res.headers.get("X-CSRF-Token"));
          return;
        }

        alert("An error has occured doing the registration process. Please try again later.");
      })
   }

  return (
    <div className="container centered-container min-container">
        <form onSubmit={handleSubmit}>
          Sign Up
          <h5>First Name</h5>
          <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <h5>Last Name</h5>
          <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
          <h5>E-Mail</h5>
          <input type="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} required />
          <h5>Password</h5>
          <input type="password" placeholder="Password" value={pwd} onChange={e => setPwd(e.target.value)} required />
          <button type="submit" className="big-btn">Join Now</button>
        </form>
      <span>
        Already have an account?
        <Route render={({ history }) => (
          <button className="unimportant-btn" onClick={() => history.push("/login")} >LOG IN</button>
        )}
        />
      </span>
    </div>
  );
}
