import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import "./Navigation.css"

function NavItem(props: { to: string, imgSrc: string, content: string, isExtended: boolean, toggleExtended: (val: boolean) => void }): JSX.Element {
  return (
    <NavLink activeClassName="active" to={props.to}>
      <div onClick={() => props.isExtended && props.toggleExtended(!props.isExtended)}>
        <img src={props.imgSrc} alt="" width="15px" height="15px" />
        <CSSTransition in={props.isExtended} timeout={200} classNames="fade">
          {props.isExtended ? <h5>{props.content}</h5> : <div></div>}
        </CSSTransition>
      </div>
    </NavLink>
  );
}

export default function Navigation(): JSX.Element {
  const [isExtended, toggleExtended] = useState<boolean>(false);

  return (
    <CSSTransition in={isExtended} timeout={200} classNames="navigation">
      <nav>
        <div className="row">
          <div data-testid="menu-btn" className={isExtended ? "active-cross" : ""} id="extendedMenuButton" onClick={() => toggleExtended(!isExtended)}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div data-testid="links" id="links">
          <NavItem to="/" imgSrc="./images/homeIcon.svg" content="Home" isExtended={isExtended} toggleExtended={toggleExtended} />
          <NavItem to="/stocks" imgSrc="/images/stockIcon.svg" content="Stocks" isExtended={isExtended} toggleExtended={toggleExtended} />
          <NavItem to="/news" imgSrc="./images/newsIcon.svg" content="News" isExtended={isExtended} toggleExtended={toggleExtended} />
          <NavItem to="/account" imgSrc="./images/accountIcon.svg" content="Your Account" isExtended={isExtended} toggleExtended={toggleExtended} />
        </div>
      </nav>
    </CSSTransition>
  );
}