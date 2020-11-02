import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ExtendedNewsCard.css";
import { PageName } from "../types";

export default function ExtendedNewsCard(props: {
  setPageName: (pageName: PageName) => void
}): JSX.Element {
  const location = useLocation();
  const locationState: any = location.state;

  useEffect(() => {
    props.setPageName("News Article");
  }, [])

  return (
    <>
      <div id="extendedNewsCard" className="container max-container">
        <iframe src={locationState.url} sandbox="allow-top-navigation allow-same-origin"></iframe>
      </div>
      <h5>
        Source: <a data-testid="source-field" href={locationState.url} target="_blank">{locationState.url}</a>
      </h5>
    </>
  );
}
