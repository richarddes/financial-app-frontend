import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router, MemoryRouter } from "react-router-dom";
import SignupPage from "../../auth/SignupPage";
import * as dependency from "../../utils/utils";
import { act } from "react-dom/test-utils";

dependency.apiFetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    headers: {
      get: jest.fn(() => "some-token"),
    },
  })
);

test("should switch url to /login when login button is pressed", () => {
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <SignupPage />
    </Router>
  );

  fireEvent.click(screen.queryByText("LOG IN"));

  expect(history.location.pathname).toBe("/login");
});

test("should switch to /login when signup button is pressed", () => {
  const history = createMemoryHistory();

  act(() => {
    render(
      <Router history={history}>
        <SignupPage />
      </Router>
    );
  });

  fireEvent.submit(screen.queryByText("Join Now"));

  return dependency
    .apiFetch()
    .then()
    .then(() => {
      expect(history.location.pathname).toBe("/login");
    });
});

test("required fields should have a required tag", () => {
  act(() => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );
  });

  return dependency
    .apiFetch()
    .then()
    .then(() => {
      expect(screen.queryByPlaceholderText("E-Mail").hasAttribute("required"));
      expect(
        screen.queryByPlaceholderText("Password").hasAttribute("required")
      );
      expect(
        screen.queryByPlaceholderText("Last Name").hasAttribute("required")
      );
    })
});
