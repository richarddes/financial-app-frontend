import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../../components/Header";

test("should render props correctly", () => {
  render (
    <Header cash={1000} />
  );

  expect(screen.queryByTestId("username").innerHTML).toBe("1000$");
})