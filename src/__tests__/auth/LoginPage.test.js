import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router, MemoryRouter } from "react-router-dom";
import LoginPage from "../../auth/LoginPage";
import * as dependency from "../../utils/utils";
import { act } from "react-dom/test-utils";

test("should switch url to /signup when sign up button is pressed", () => {
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <LoginPage />
    </Router>
  );

  fireEvent.click(screen.queryByText("SIGN UP"));

  expect(history.location.pathname).toBe("/signup");
});

test("should switch url to /reset-pwd/email when forgot password button is pressed", () => {
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <LoginPage />
    </Router>
  );

  fireEvent.click(screen.queryByText("Forgot your password?"));

  expect(history.location.pathname).toBe("/reset-pwd/email");
});

test("should switch to dashboard when login button is pressed", () => {
  dependency.apiFetch = jest.fn(() =>
    Promise.resolve({
      status: 200,
      headers: {
        get: jest.fn(() => "some-csrf-token"),
      },
    })
  );

  const history = createMemoryHistory({ initialEntries: ["/login"] });

  act(() => {
    render(
      <Router history={history}>
        <LoginPage />
      </Router>
    );
  });

  fireEvent.submit(screen.queryByText("LOG IN"));

  return dependency
    .apiFetch()
    .then()
    .then(() => {
      expect(history.location.pathname).toBe("/");
    })
});

test("should show error message when login not successfull", () => {
  dependency.apiFetch = jest.fn(() =>
    Promise.resolve({
      status: 400,
      headers: {
        get: jest.fn(() => "some-csrf-token"),
      },
    })
  );

  act(() => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  });

  fireEvent.submit(screen.queryByRole("form"));

  return dependency
    .apiFetch()
    .then()
    .then(() => {
      expect(screen.queryByRole("alert").style.opacity).toBe("1");
    })
});
