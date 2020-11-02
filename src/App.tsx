import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import { AuthContext } from "./auth/auth";
import { PageName } from "./types";
import "./App.css";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import StockCardPage from "./stocks/StockCardPage";
import NewsCardPage from "./news/NewsCardPage";
import AccountPage from "./account/AccountPage";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import ExtendedNewsCard from "./news/ExtendedNewsCard";
import ExtendedStockCard from "./stocks/ExtendedStockCard";
import BuySellMenu from "./stocks/BuySellMenu";
import BackgroundInfo from "./components/BackgroundInfo";

export default function App() : JSX.Element {
  const [isAuthenticated, toggleIsAuthenticated] = useState<boolean>(false);
  const [pageName, setPageName] = useState<PageName>("Your Stocks")
  const [cash, setCash] = useState<number>(0);

  const changeCash = (cash: number) => {
    setCash(cash);
  }


  const changePageName = (pageName: PageName) => {
    setPageName(pageName);;
  }

  return (
    <div id="app">
      <AuthContext.Provider value={{
        isAuth: isAuthenticated,
        toggleAuth: () => {
          toggleIsAuthenticated(!isAuthenticated)
        }
      }}>
        {isAuthenticated && 
          <>
            <Header pageName={pageName} cash={cash} />
            <Navigation />
          </>
        }
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignupPage />
          </Route>
          <Route path="/reset-pwd/email">
            <BackgroundInfo infoText="Not Implemented" />
          </Route>
          <Route path="/reset-pwd/pwd">
            <BackgroundInfo infoText="Not Implemented" />
          </Route>
          <PrivateRoute exact path="/">
            <StockCardPage boughtStocksPage={true} setCash={changeCash} setPageName={changePageName} />          
          </PrivateRoute>
          <PrivateRoute exact path="/stocks">
            <StockCardPage boughtStocksPage={false} setCash={changeCash} setPageName={changePageName} />          
          </PrivateRoute>
          <PrivateRoute path="/stocks/stock/:stockid/buy-sell">
            <BuySellMenu cash={cash} setPageName={changePageName} />
          </PrivateRoute>
          <PrivateRoute path="/stocks/stock/:stockid">
            <ExtendedStockCard setPageName={changePageName} />          
          </PrivateRoute>
          <PrivateRoute exact path="/news">
            <NewsCardPage setPageName={changePageName} />          
          </PrivateRoute>
          <PrivateRoute exact path="/news/article/:title">
            <ExtendedNewsCard setPageName={changePageName} />          
          </PrivateRoute>
          <PrivateRoute path="/account">
            <AccountPage setPageName={changePageName} />          
          </PrivateRoute>
        </Switch>
      </AuthContext.Provider>
    </div>
  )
}