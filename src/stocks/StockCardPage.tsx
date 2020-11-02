import React, { useState, useEffect, useContext } from "react";
import WorkerClient from "./worker/WorkerClient";
import StockCard from "./StockCard";
import Select from "../components/Select";
import BackgroundInfo from "../components/BackgroundInfo";
import { AuthContext } from "../auth/auth";
import { apiFetch, isSuccess } from "../utils/utils";
import { PageName } from "../types";

interface StockCardPageProps {
  boughtStocksPage: boolean,
  setCash: (cash: number) => void,
  setPageName: (pageName: PageName) => void
}

export default function StockCardPage(props: StockCardPageProps): JSX.Element {
  const [stocksData, setStocksData] = useState<{ data: any, chart: any }>({ data: [], chart: {} });
  const [displayedStockOpt, setDisplayedStockOpt] = useState<string>("Gainers");
  // realtimePrice is an array of form [symbol, price]. Every time a new price is recieved from
  // the web worker, this state is updated and passed on to every child component.
  // This logic will change at some point. 
  const [realtimePrice, setRealtimePrice] = useState<[string, number]>(["", 0]);
  const [fetchStatus, setFetchStatus] = useState<number>(200);

  const auth = useContext(AuthContext);

  useEffect(() => {
    if (props.boughtStocksPage) {
      props.setPageName("Your Stocks")
    } else {
      props.setPageName("Browse Stocks");
    }
  }, [props.boughtStocksPage])

  useEffect(() => {
    const priceWorker = new WorkerClient();

    apiFetch("/users/cash")
      .then((res: Response) => {
        if (isSuccess(res.status)) {
          return res.text();
        } else if (res.status === 401) {
          auth.toggleAuth();
          return;
        }
      })
      .then((cash: string) => props.setCash(cash as unknown as number));

    if (props.boughtStocksPage) {
      apiFetch("/users/owned-stocks")
        .then((res: Response) => {
          if (isSuccess(res.status)) {
            return res.json();
          } else if (res.status === 401) {
            auth.toggleAuth();
            return;
          } else {
            setFetchStatus(res.status);
          }
        })
        .then((stocks: any) => {
          setStocksData({ data: stocks.data, chart: {} });

          const symbols = Array.from(stocks.data, (stock: any) => stock.symbol);

          priceWorker.worker.postMessage({ boughtStocksPage: true, symbols: symbols });

          priceWorker.worker.onmessage = (message: MessageEvent) => {
            if (message.data[0] === "socketData") {
              setRealtimePrice(message.data[1]);
            } else if (message.data[0] === "chartData") {
              setStocksData({ data: stocks.data, chart: message.data[1] });
            }
          }
        })
    } else {
      priceWorker.worker.postMessage({ boughtStocksPage: false, option: displayedStockOpt });

      priceWorker.worker.onmessage = (message: MessageEvent) => {
        if (message.data[0] === "fetchData") {
          setStocksData(message.data[1]);
        } else if (message.data[0] === "socketData") {
          setRealtimePrice(message.data[1]);
        }
      }
    }

    return () => priceWorker.worker.terminate();
  }, [displayedStockOpt, props.boughtStocksPage])

  return (
    <>
      {!props.boughtStocksPage &&
        <Select opts={["Gainers", "Losers", "Most Active"]}
          currentOptState={displayedStockOpt}
          setCurrentOptState={setDisplayedStockOpt} />
      }
      {stocksData.data.length < 1 ?
        <BackgroundInfo infoText={
          props.boughtStocksPage
            ? "You haven't bought any stocks yet"
            : (
              isSuccess(fetchStatus)
                ? "There's no stock data to be fetched"
                : `There has been an error while fetching the news. Status code ${fetchStatus}`
            )}
        />
        :
        <div role="grid" className="grid">
          {stocksData.data.map((stock: any) => {
            return (
              <StockCard boughtStock={props.boughtStocksPage} key={stock.symbol} symbol={stock.symbol}
                latestPrice={stock.latestPrice}
                change={Math.round(stock.change * 100) / 100}
                boughFor={stock.boughtFor} amount={stock.amount} realtimePrice={realtimePrice} chartData={stocksData.chart === undefined ? [] : stocksData.chart[stock.symbol] || []} />
            );
          })}
        </div>
      }
      <span className="copyright">Powered by
        <strong>
          <a href="https://iexcloud.io/" target="_blank" rel="noopener noreferrer"> IEX Cloud</a>
        </strong>
      </span>
    </>
  );
}
