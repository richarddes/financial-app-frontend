import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css"

export default function Modal({children}) {
  return ReactDOM.createPortal(
    <>
      <div className="blur"></div> 
      <div role="dialog" className="container centered-container modal">
        {children}
      </div>
    </>, document.getElementById("modal-root"));
}


