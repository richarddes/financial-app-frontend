import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import ExtendedStockCard from "../../stocks/ExtendedStockCard";
import * as chart from "react-chartjs-2";

const mockState = {
  symbol: "AAPL",
  price: 250.02,
  chartData: {
    labels: ["08.26", "09.26", "10.26", "11.26", "12.26", "13.26"],
    data: [23.4, 35, 29.5, 31.5, 25.68, 27],
  },
  change: 0.45
};

chart.Line = jest.fn(() => <div></div>);

test("should go to buy/sell page", () => {
  const history = createMemoryHistory();
  history.push("/", mockState);

  render(
    <Router history={history}>
      <ExtendedStockCard />
    </Router>
  );

  fireEvent.click(screen.queryByText("Buy"));

  expect(history.location.pathname).toBe("/stocks/stock/aapl/buy-sell");
});
