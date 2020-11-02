import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navigation from "../../components/Navigation";

test("navigation column should have 4 options", () => {
  render (
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  expect(screen.queryByTestId("links").children.length).toBe(4);
})

test("should extend when menu button is clicked", () => {
  render (
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  fireEvent.click(screen.queryByTestId("menu-btn"));

  expect(screen.queryByRole("navigation").classList.contains("extended"));
})
