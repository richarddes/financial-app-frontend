import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import BackgroundInfo from "../../components/BackgroundInfo";

test("should render props correctly", () => {
  render(
    <BackgroundInfo infoText={"Some Info"} />
  )

  expect(screen.queryByTestId("background-info").innerHTML).toBe("Some Info");
})