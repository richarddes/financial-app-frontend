import React, {
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./Modal.css";

export default function Modal({ isOpen, children }) {
  // localIsOpen is responsible for triggering animations while
  // showModal acutally triggers the HTML elements. We need both since we want to play
  // a fade-in & fade-out animation. We slow down the showModal state when we close
  // the modal so that we get enough time to show the fade-out
  const [localÍsOpen, setLocalIsOpen] = useState(isOpen);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setLocalIsOpen(true);
    } else {
      setLocalIsOpen(false);
      setTimeout(() => {
        setShowModal(false);
      }, 200);
    }
  }, [isOpen]);

  return ReactDOM.createPortal(
    <>
      <CSSTransition in={localÍsOpen} timeout={200} classNames="halfFade">
        {showModal ? (
          <div className="blur" onClick={() => setLocalIsOpen(false)}></div>
        ) : (
          <div></div>
        )}
      </CSSTransition>
      <CSSTransition in={localÍsOpen} timeout={200} classNames="fromTop">
        {showModal ? (
          <div className="container centered-container modal" role="dialog">
            {children}
          </div>
        ) : (
          <div></div>
        )}
      </CSSTransition>
    </>,
    document.getElementById("modal-root")
  );
}
