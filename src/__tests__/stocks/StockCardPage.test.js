import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StockCardPage from "../../stocks/StockCardPage";
import * as dependency from "../../utils/utils";
import * as chart from "react-chartjs-2";
import { act } from "react-dom/test-utils";

jest.mock("../../stocks/worker/WorkerClient.js");

const setCash = jest.fn(() => {});
const displayVals = {
  data: [
    {
      boughtStock: false,
      withChart: false,
      realtimePrice: ["AAPL", 250.02],
      chartData: [],
      symbol: "AAPL",
      latestPrice: 250.03,
      change: 0.04,
    },
    {
      boughtStock: false,
      withChart: false,
      realtimePrice: ["FB", 150.34],
      chartData: [],
      symbol: "FG",
      latestPrice: 150.34,
      change: -0.46,
    },
  ],
  chart: [],
};

test("should include copyright information", () => {
  act(() => {
    render(
      <MemoryRouter>
        <StockCardPage boughtStocksPage={false} setCash={setCash} />
      </MemoryRouter>
    );
  });

  expect(screen.queryByText(/Powered by\w*/)).toBeInTheDocument();
});

test("should show error message when no stocks are being displayed", () => {
  const opts = [true, false];

  for (const boughtStocksPage of opts) {
    act(() => {
      render(
        <MemoryRouter>
          <StockCardPage
            boughtStocksPage={boughtStocksPage}
            setCash={setCash}
          />
        </MemoryRouter>
      );
    });

    if (boughtStocksPage) {
      expect(
        screen.queryByText("You haven't bought any stocks yet")
      ).toBeInTheDocument();
    } else {
      expect(
        screen.queryByText(
          /There has been an error while fetching the news. Status code \d*/
        )
      ).toBeInTheDocument();
    }
  }
});

test("should render values correctly", async () => {
  dependency.apiFetch = jest.fn(() =>
    Promise.resolve({
      status: 200,
      text: jest.fn(() => "1000"),
      json: jest.fn(() => displayVals),
    })
  );

  chart.Line = jest.fn(() => <div></div>);

  act(() => {
    render(
      <MemoryRouter>
        <StockCardPage boughtStocksPage={true} setCash={setCash} />
      </MemoryRouter>
    );
  });

  dependency
    .apiFetch()
    .then()
    .then(() => {
      expect(screen.queryByRole("grid").children.length).toBe(2);
    })
});
