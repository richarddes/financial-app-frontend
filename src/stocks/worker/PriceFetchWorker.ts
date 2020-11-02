/* eslint-disable */

import io from "socket.io-client";
import ChartWorker from "worker-loader!./ChartFetchWorker";

const socket = io("https://ws-api.iextrading.com/1.0/last");

const ctx: Worker = self as any;

const cw = new ChartWorker();

async function fetchRoute(stockDisplayOpt: string): Promise<any> {
  return new Promise((resolve) => {
    fetch(`/api/stocks/opt/${stockDisplayOpt}`)
      .then((res) => res.json())
      .then((data) => {
        ctx.postMessage(["fetchData", data]);
        resolve(data);
      });
  });
}

async function fetchChart(symbols: any) {
  cw.postMessage(symbols);

  let expectedSymbols = symbols.length,
    data = {};

  cw.onmessage = (event: MessageEvent) => {
    data = Object.assign(data, event.data);
    expectedSymbols--;
    if (expectedSymbols === 0) ctx.postMessage(["chartData", data]);
  }
}

function establishSocketConnection(symbols: any) {
  socket.emit("subscribe", symbols.toString());
  socket.addEventListener("message", (message: string) => {
    const messageObj = JSON.parse(message);
    ctx.postMessage(["socketData", [messageObj.symbol, messageObj.price]]);
  });
}

ctx.onmessage = (event: MessageEvent) => {
  if (event.data.boughtStocksPage) {
    if (event.data.symbols === undefined) return;
    establishSocketConnection(event.data.symbols);
    fetchChart(event.data.symbols);
  } else {
    let data,
      symbols: any = [];
    switch (event.data.option) {
      case "Gainers":
        data = fetchRoute("gainers");
        data.then((stockData) => {
          stockData.forEach((stockInfo: any) => symbols.push(stockInfo.symbol));
          establishSocketConnection(symbols);
        });
        break;
      case "Losers":
        data = fetchRoute("losers");
        data.then((stockData) => {
          stockData.forEach((stockInfo: any) => symbols.push(stockInfo.symbol));
          establishSocketConnection(symbols);
        });
        break;
      case "Most Active":
        data = fetchRoute("most-active");
        data.then((stockData) => {
          stockData.forEach((stockInfo: any) => symbols.push(stockInfo.symbol));
          establishSocketConnection(symbols);
        });
        break;
    }
  }
};

export default null as any;
