import React, { useState, useEffect, useContext } from "react";
import { NewsProps, PageName } from "../types";

import NewsCard from "./NewsCard";
import Select from "../components/Select";
import { AuthContext } from "../auth/auth";
import BackgroundInfo from "../components/BackgroundInfo";
import { apiFetch, isSuccess } from "../utils/utils";

export default function NewsCardPage(props: {
  setPageName: (pageName: PageName) => void
}): JSX.Element {
  const [newsData, setNewsData] = useState<[]>([]);
  const [displayedNewsOpt, setDisplayedNewsOpt] = useState<string>("Top Headlines");
  const [fetchStatus, setFetchStatus] = useState<number>(200);

  const auth = useContext(AuthContext);

  let children;

  useEffect(() => {
    props.setPageName("News");

    switch (displayedNewsOpt) {
      case "Top Headlines":
        apiFetch("/news/top-headlines")
          .then((res: Response) => {
            if (isSuccess(res.status)) {
              return res.json();
            } else if (res.status === 401) {
              auth.toggleAuth();
              return;
            } else {
              setFetchStatus(res.status);
            }
          })
          .then(newsArticles => {
            if (newsArticles !== null) setNewsData(newsArticles)
          });
        break;
      case "Recommended":
        break;
      case "Subscribed":
        break;
      case "Publisher":
        break;
      default:
        break;
    }
  }, [])

  switch (displayedNewsOpt) {
    case "Top Headlines":
      if (newsData.length < 1) {
        let infoTxt;
        isSuccess(fetchStatus) ? infoTxt = "There are no news to be fetched" : infoTxt = `There has been an error while fetching the stocks data. Status code ${fetchStatus}`;

        children = <BackgroundInfo infoText={infoTxt} />
        break;
      }

      children = (
        <div role="grid" className="grid">
          {newsData.map((article: NewsProps) => {
            return (
              <NewsCard key={article.URL}
                Source={article.Source}
                Title={article.Title}
                PublishedAt={article.PublishedAt}
                URL={article.URL}
                URLToImage={article.URLToImage}
                Author={article.Author}
                Description={article.Description}
              />
            )
          })}
        </div>
      );
      break;
    default:
      children = <BackgroundInfo infoText="Not Implemented" />
      break;
  }


  return (
    <>
      <Select opts={["Top Headlines", "Recommended", "Subscribed", "Publisher"]}
        currentOptState={displayedNewsOpt}
        setCurrentOptState={setDisplayedNewsOpt} />
      {children}
      <span className="copyright">Powered by
        <strong>
          <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer"> NewsAPI.org</a>
        </strong>
      </span>
    </>
  );
}