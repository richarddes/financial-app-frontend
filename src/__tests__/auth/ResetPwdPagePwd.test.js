import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import ResetPwdPagePwd from "../../auth/ResetPwdPagePwd";

test("should switch to dashboard when submit button is clicked", () => {
  const history = createMemoryHistory();
  
  render (
    <Router history={history}>
      <ResetPwdPagePwd />
    </Router>
  );

  fireEvent.click(screen.queryByText("SUBMIT"));

  expect(history.location.pathname).toBe("/login");
})