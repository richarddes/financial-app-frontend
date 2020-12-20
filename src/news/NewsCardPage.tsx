import React, { useState, useEffect, useContext } from "react";
import { NewsProps, PageName } from "../types";

import NewsCard from "./NewsCard";
import Select from "../components/Select";
import { AuthContext } from "../auth/auth";
import BackgroundInfo from "../components/BackgroundInfo";
import { apiFetch, isSuccess } from "../utils/utils";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export default function NewsCardPage(props: {
  setPageName: (pageName: PageName) => void
}): JSX.Element {
  const [newsData, setNewsData] = useState<[]>([]);
  const [displayedNewsOpt, setDisplayedNewsOpt] = useState<string>("Top Headlines");
  const [fetchStatus, setFetchStatus] = useState<number>(200);
  const [infoTxt, setInfoTxt] = useState<string>("");

  const auth = useContext(AuthContext);

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
          .then((newsArticles: any) => {
            if (!newsArticles) {
              setInfoTxt("There are no news to be fetched");
              return;
            }

            setNewsData(newsArticles);

            if (newsData.length < 1) {
              isSuccess(fetchStatus) ? setInfoTxt("There are no news to be fetched") : setInfoTxt(`There has been an error while fetching the stocks data. Status code ${fetchStatus}`);
            }
          });
        break;
      case "Recommended":
        break;
      case "Subscribed":
        break;
      case "Publisher":
        break;
      default:
        setInfoTxt("Not Implemented");
        break;
    }
  }, []);


  return (
    <>
      <Select opts={["Top Headlines", "Recommended", "Subscribed", "Publisher"]}
        currentOptState={displayedNewsOpt}
        setCurrentOptState={setDisplayedNewsOpt} />
      {newsData.length < 1 && <BackgroundInfo infoText={infoTxt} />}
      <TransitionGroup className="grid">
        {newsData.map((article: NewsProps) => (
          <CSSTransition key={article.URL} timeout={200} classNames="fullFade">
            <NewsCard key={article.URL}
              Source={article.Source}
              Title={article.Title}
              PublishedAt={article.PublishedAt}
              URL={article.URL}
              URLToImage={article.URLToImage}
              Author={article.Author}
              Description={article.Description}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
      <span className="copyright">Powered by
        <strong>
          <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer"> NewsAPI.org</a>
        </strong>
      </span>
    </>
  );
}