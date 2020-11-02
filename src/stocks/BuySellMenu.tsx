import React, { useState, FormEvent, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiFetch, isSuccess } from "../utils/utils";
import { invalidateCSRFToken, updateCSRFToken, AuthContext } from "../auth/auth";
import "./BuySellMenu.css";
import { PageName } from "../types";

export default function BuySellMenu(props: {
  cash: number,
  setPageName: (pageName: PageName) => void
}): JSX.Element {
  const history = useHistory();
  const locationState: any = history.location.state;

  const [amount, setAmount] = useState<number>(0);
  const [value, setValue] = useState<number>(amount * locationState.price);
  const [showErrMsg, setShowErrMsg] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("There's been an unexpetced error while processing your request. Please try again later.")

  const auth = useContext(AuthContext);

  useEffect(() => {
    if (locationState.action === "sell") {
      props.setPageName("Sell Stock");
    } else  {
      props.setPageName("Buy Stock");
    }
  }, [])

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();

    if (locationState.action === "buy") {
      if (locationState.price * amount > props.cash) {
        setErrMsg("You don't have enough money to buy that many shares");
        setShowErrMsg(true);

        setTimeout(() => {
          setShowErrMsg(false);

        }, 2000);
        return;
      }
    } else if (locationState.action === "sell") {
      if (amount > locationState.amount) {
        setErrMsg("You can't sell more shares than you own");
        setShowErrMsg(true);

        setTimeout(() => {
          setShowErrMsg(false);

        }, 2000);
        return;
      }
    } else {
      setErrMsg(`Couldn't handle action: ${locationState.action}`)
      setShowErrMsg(true);

      setTimeout(() => {
        setShowErrMsg(false);

      }, 2000);
      return;
    }

    const body = { symbol: locationState.symbol, amount: amount, price: locationState.price };

    apiFetch(`/users/${locationState.action}-stock`, "POST", body)
      .then((res: Response) => {
        if (isSuccess(res.status)) {
          history.push("/")
          invalidateCSRFToken();
          updateCSRFToken(res.headers.get("X-CSRF-Token"));
        } else if (res.status === 401) {
          alert("You're session expired. Please login again to perform this action.");
          auth.toggleAuth();
          return;
        }
      })
  }

  return (
    <>
      <div className="container min-container centered-container" id="buy-sell-menu">
        <h4><strong>{locationState.action == "buy" ? "Buy" : "Sell"} Stock</strong></h4>
        {locationState.ownedStock &&
          <h5>You already own {locationState.amount} {locationState.symbol} shares</h5>
        }
        <h5 role="alert" data-testid="info-alert" className="errText" style={{ opacity: showErrMsg ? 1 : 0 }}>{errMsg}</h5>
        <form data-testid="form" role="form" onSubmit={handleSubmit}>
          <input role="textbox" type="number" placeholder="Amount" value={amount} min="0" max={locationState.action === "sell" && locationState.amount} onChange={e => {
            setAmount(e.target.valueAsNumber);
            setValue(Math.round(e.target.valueAsNumber * locationState.price * 100) / 100);
          }} />
          <h5>Value: {value}$</h5>
          <h4><strong>{locationState.action === "buy" ? "Buy" : "Sell"} at {locationState.price}$</strong></h4>
          <button data-testid="submit" type="submit" className="big-btn">
            {locationState.action == "buy" ? "Buy" : "Sell"}
          </button>
        </form>
      </div>
    </>
  );
}