import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Select from "../../components/Select";

const displayValues = {
  opts: ["option 1", "option  2", "option 3"],
  currentOptState: "option 1",
  setCurrentOptState: jest.fn(() => "")
}

test("should render props correctly", () => {
  render (
    <Select opts={displayValues.opts}
      currentOptState={displayValues.currentOptState}
      setCurrentOptState={displayValues.setCurrentOptState}
    />
  );

  // test that correct number of options is rendered
  const select = screen.queryByRole("list");

  expect(select.children.length).toBe(3);

  // test that the select value changes when another option is selected
  fireEvent.select(select, {target: {value: "option 3"}});

  expect(select.value).toBe("option 3")
})