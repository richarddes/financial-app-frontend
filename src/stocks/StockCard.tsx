import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "./StockCard.css";

import { StockProps } from "../types";

interface StockCardProps extends StockProps {
  boughtStock: boolean,
  realtimePrice: [
    string,
    number
  ],
  chartData: any
};

export default function StockCard(props: StockCardProps): JSX.Element {
  const history = useHistory();

  const [price, setPrice] = useState<number>(props.symbol === props.realtimePrice[0] ? (props.realtimePrice[1] || props.latestPrice) : props.latestPrice);
  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    if (props.chartData.length < 1) return;

    const labels = Array.from(props.chartData, (chartNode: any) => {
      const dateParts = chartNode.date.split("-");
      // returns the date as dayOfMonth.monthOfYear
      return `${dateParts[2]}.${dateParts[1]}`;
    })

    const closePrices = Array.from(props.chartData, (chartNode: any) => chartNode.close)

    setChartData({
      labels: [...labels],
      datasets: [
        {
          lineTension: 0,
          data: [...closePrices]
        }
      ]
    });
  }, [props.chartData]);

  useEffect(() => {
    if (props.symbol === props.realtimePrice[0]) {
      setPrice(Math.round(props.realtimePrice[1] * 100) / 100);
    };
  }, [props.realtimePrice]);

  return (
    <div role="gridcell" className="container card stock-card" onClick={() => {
      history.push({
        pathname: `/stocks/stock/${props.symbol.toLowerCase()}`,
        state: {
          chartData: { labels: chartData.labels, data: chartData.datasets[0].data },
          price: price,
          symbol: props.symbol,
          boughFor: props.boughFor,
          amount: props.amount,
          change: props.change,
          ownedStock: props.boughtStock,
        }
      });
    }}>
      <div>
        <span style={{ float: "left" }}>
          <h5 data-testid="company-tag">{props.symbol}</h5>
        </span>
        {!props.boughtStock &&
          <span style={{ float: "right" }}>
            <h5 data-testid="price-info">
              {price}$
              <span style={props.change > 0 ? { color: "var(--green)" } : props.change < 0 ? { color: "var(--red)" } : {}}>
                {props.change}%
              </span>
            </h5>
          </span>
        }
      </div>
      <div className="chart">
        <Line legend={{ display: false }} options={{ maintainAspectRatio: false }} data={chartData} />
      </div>
      {props.boughtStock &&
        <span>
          <div style={{ float: "left" }}>
            <h6>Bought for:</h6>
            <h6><strong>{props.boughFor}$</strong></h6>
          </div>
          <div style={{ float: "right" }}>
            <h6>Current value:</h6>
            <h6><strong>{props.amount * (props.realtimePrice[1] || props.latestPrice)}$</strong></h6>
          </div>
        </span>
      }
    </div>
  );
}