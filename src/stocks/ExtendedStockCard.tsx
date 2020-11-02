import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "./ExtendedStockCard.css";

import { BuySellOptions, PageName } from "../types";

export default function ExtendedStockCard(props: {
  setPageName: (pageName: PageName) => void
}): JSX.Element {
  const history = useHistory();
  const locationState: any = history.location.state;

  const [chartData, setChartdata] = useState<any>({});

  useEffect(() => {
    props.setPageName("Stock Info")

    const chartProps = locationState.chartData;
    setChartdata({
      labels: [...chartProps.labels],
      datasets: [
        {
          lineTension: 0,
          data: [...chartProps.data]
        }
      ]
    })
  }, []);

  const gotoBuySellPage = (action: BuySellOptions): void => {
    history.push({
      pathname: `/stocks/stock/${locationState.symbol.toLowerCase()}/buy-sell`,
      state: {
        symbol: locationState.symbol,
        price: locationState.price,
        action: action,
        amount: locationState.amount
      }
    });
  };

  return (
    <>
      <div className="container max-container" id="extendedStockCard">
        <div style={{ float: "left" }}>
          <h3>
            {locationState.symbol}
            <strong> {locationState.price}$</strong>
          </h3>
          <h4 style={locationState.change > 0 ? { color: "var(--green)", marginLeft: 5 } : locationState.change < 0 ? { color: "var(--red)", marginLeft: 5 } : {marginLeft: 5}}>
            {locationState.change}%
          </h4>
        </div>
        <div id="chart">
          <Line data={chartData} legend={{ display: false }} options={{ maintainAspectRatio: false }} />
        </div>
        <div style={{position: "absolute", bottom: 40, left: 20}}>
          <button onClick={() => gotoBuySellPage("buy")}>Buy</button>
          <button style={{ marginLeft: "20px" }} onClick={() => gotoBuySellPage("sell")}>Sell</button>
        </div>
      </div>
    </>
  );
}
