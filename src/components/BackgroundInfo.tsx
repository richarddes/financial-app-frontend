import React from "react";
import "./BackgroundInfo.css";

export default function NotImplemented(props: { infoText: string }) {
  return (
    <div data-testid="background-info" id="background-info">
      {props.infoText}
    </div>
  );
}