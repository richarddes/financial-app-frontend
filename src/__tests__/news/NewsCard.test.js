import "@testing-library/jest-dom";

import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router, MemoryRouter } from "react-router-dom";
import NewsCard from "../../news/NewsCard";

const displayValues = {
  Source: "bloomberg.com",
  URL: "https://bloomberg.com",
  URLToImage: "",
  Title: "some title",
  Description: "some description",
  Author: "A Person", 
  PublishedAt: "2020-01-01"
}

test("should render correct values", () => {
  render (
    <MemoryRouter>
      <NewsCard 
        Source={displayValues.Source} 
        URL={displayValues.URL} 
        URLToImage={displayValues.URLToImage}
        Title={displayValues.Title}
        Description={displayValues.Description}
        Author={displayValues.Author}
        PublishedAt={displayValues.PublishedAt}
      />
    </MemoryRouter>
  );

  expect(screen.queryByAltText(displayValues.URLToImage)).toBeInTheDocument();
  expect(screen.queryByText(displayValues.PublishedAt)).toBeInTheDocument();
  expect(screen.queryByText(displayValues.Source)).toBeInTheDocument();
  expect(screen.queryByText(displayValues.Title)).toBeInTheDocument();
})

test("should switch url to expectedURL when clicked", () => {
  const history = createMemoryHistory();

  render (
    <Router history={history}>
      <NewsCard
        Source={displayValues.Source} 
        URL={displayValues.URL} 
        URLToImage={displayValues.URLToImage}
        Title={displayValues.Title}
        Description={displayValues.Description}
        Author={displayValues.Author}
        PublishedAt={displayValues.PublishedAt}
      />
    </Router>
  );

  fireEvent.click(screen.queryByRole("gridcell"))

  expect(history.location.pathname).toBe("/news/article/some-title");
})
