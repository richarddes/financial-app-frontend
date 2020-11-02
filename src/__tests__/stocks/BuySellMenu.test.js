import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import BuySellMenu from "../../stocks/BuySellMenu";

const mockState = {
  action: "buy",
  price: 250.02,
  symbol: "AAPL",
};

test("should render props correctly", () => {
  const history = createMemoryHistory();
  history.push("/", mockState);

  render(
    <Router history={history}>
      <BuySellMenu cash={1000} />
    </Router>
  );

  expect(screen.queryByText("Buy Stock").innerHTML).toBeDefined();
  expect(screen.queryByText(/^Buy at \d*.\d\d\$/).innerHTML).toBe(
    "Buy at 250.02$"
  );
});