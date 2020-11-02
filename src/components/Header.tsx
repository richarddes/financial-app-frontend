import React from "react";
import "./Header.css";

export default function Header(props: {pageName: string, cash: number}) : JSX.Element {
  return (
    <header>
      <div id="heading-txt">
        {props.pageName}
        <span data-testid="username" style={{float: "right"}}>
          {props.cash}$
        </span>
      </div>
    </header>
  );
}