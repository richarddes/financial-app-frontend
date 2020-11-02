import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import ExtendedNewsCard from "../../news/ExtendedNewsCard";

const mockState = {url: "some-url.com"};

test("should render correctly", () => {
  const history = createMemoryHistory();
  history.push("/", mockState);

  render (
    <Router history={history}>
      <ExtendedNewsCard />
    </Router>
  );

  expect(screen.queryByTestId("source-field").innerHTML).toBe(mockState.url);
})
