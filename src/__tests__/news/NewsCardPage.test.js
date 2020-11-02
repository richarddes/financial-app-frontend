import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NewsCardPage from "../../news/NewsCardPage";
import * as dependency from "../../utils/utils";
import { act } from "react-dom/test-utils";

const displayValues = [
  {
    Source: "bloomberg.com",
    URL: "https://bloomberg.com",
    URLToImage: "",
    Title: "some title",
    Description: "some description",
    Author: "A Person",
    PublishedAt: "2020-01-01",
  },
  {
    Source: "cnn.com",
    URL: "https://cnn.com",
    URLToImage: "",
    Title: "some other title",
    Description: "some other description",
    Author: "Another Person",
    PublishedAt: "2020-01-01",
  },
];

test("should include copyright information", () => {
  act(() => {
    render(
      <MemoryRouter>
        <NewsCardPage />
      </MemoryRouter>
    );
  });

  expect(screen.queryByText(/Powered by\w*/)).toBeInTheDocument();
});

test("should render info screen when no news are fetched", () => {
  act(() => {
    render(
      <MemoryRouter>
        <NewsCardPage />
      </MemoryRouter>
    );
  });

  expect(
    screen.queryByText("There are no news to be fetched")
  ).toBeInTheDocument();
});

test("should render correct number of items", () => {
  dependency.apiFetch = jest.fn(() =>
    Promise.resolve({
      status: 200,
      json: jest.fn(() => displayValues),
    })
  );

  act(() => {
    render(
      <MemoryRouter>
        <NewsCardPage />
      </MemoryRouter>
    );
  });

  return dependency
    .apiFetch()
    .then()
    .then(() => {
      expect(screen.queryByRole("grid").children.length).toBe(2);
    })
});
