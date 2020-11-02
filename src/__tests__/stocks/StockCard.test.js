import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router, MemoryRouter } from "react-router-dom";
import StockCard from "../../stocks/StockCard";
import * as chart from "react-chartjs-2";

const props = {
  boughtStock: false,
  withChart: false,
  realtimePrice: ["AAPL", 250.02],
  chartData: {
    datasets: [],
  },
  symbol: "AAPL",
  latestPrice: 250.03,
  change: 0.04,
};

chart.Line = jest.fn(() => <div></div>);

test("should switch url to stock url", () => {
  const history = createMemoryHistory();
  
  render(
    <Router history={history}>
      <StockCard
        realtimePrice={props.realtimePrice}
        chartData={props.chartData}
        symbol={props.symbol}
        latestPrice={props.latestPrice}
        change={props.change}
      />
    </Router>
  );

  fireEvent.click(screen.queryByRole("gridcell"));

  expect(history.location.pathname).toBe(
    `/stocks/stock/${props.realtimePrice[0].toLowerCase()}`
  );
});

test("should render props correctly", () => {
  render(
    <MemoryRouter>
      <StockCard
        realtimePrice={props.realtimePrice}
        chartData={props.chartData}
        symbol={props.symbol}
        latestPrice={props.latestPrice}
        change={props.change}
      />
    </MemoryRouter>
  );

  expect(screen.queryByTestId("company-tag").innerHTML).toBe(
    props.realtimePrice[0]
  );
  expect(screen.queryByTestId("price-info").innerHTML).toBe(
    "250.02$<span>0.04%</span>"
  );
});
