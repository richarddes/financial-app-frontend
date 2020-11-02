import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import ResetPwdPageEmail from "../../auth/ResetPwdPageEmail";

test("should switch url to /reset-pwd/pwd when submit button is clicked", () => {
  const history = createMemoryHistory();
  
  render (
    <Router history={history}>
      <ResetPwdPageEmail />
    </Router>
  );

  fireEvent.click(screen.queryByText("SUBMIT"));

  expect(history.location.pathname).toBe("/reset-pwd/pwd");
})