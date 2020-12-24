import React, { useState, useContext, useLayoutEffect } from "react";
import { NewsProps, PageName } from "../types";

import NewsCard from "./NewsCard";
import Select from "../components/Select";
import { AuthContext } from "../auth/auth";
import BackgroundInfo from "../components/BackgroundInfo";
import { apiFetch, isSuccess } from "../utils/utils";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import PublisherCard from "./PublisherCard";

export default function NewsCardPage(props: {
  setPageName: (pageName: PageName) => void
}): JSX.Element {
  const [displayData, setDisplayData] = useState<any>([]);
  const [displayedNewsOpt, setDisplayedNewsOpt] = useState<string>("Top Headlines");
  const [fetchStatus, setFetchStatus] = useState<number>(200);
  const [infoTxt, setInfoTxt] = useState<string>("");
  const [subscribedPublisherIDs, setSubscribedPublisherIDs] = useState<Array<string>>([]);

  const auth = useContext(AuthContext);

  const combinePublisherData = (publishers: Array<Object>, publisherIDs: Array<string>) => {
    publishers.forEach((publisher: any) => {
      if (!publisherIDs) return;

      publisherIDs.includes(publisher.ID) ? publisher.isSubscribed = true : publisher.isSubscribed = false;
    });

    setSubscribedPublisherIDs(publisherIDs || []);
    setDisplayData(publishers);
  }

  const getPublisherData = () => {
    apiFetch("/news/publishers")
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
      .then((publishers: any) => {
        if (!publishers) {
          setInfoTxt("There are no publishers to be fetched");
          return;
        }

        if (publishers.length < 1) {
          isSuccess(fetchStatus) ? setInfoTxt("There are no news to be fetched") : setInfoTxt(`There has been an error while fetching the news data. Status code ${fetchStatus}`);
        } else {
          if (subscribedPublisherIDs.length < 1) {
            apiFetch("/users/subscribed-publishers")
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
              .then((publisherIDs: any) => {
                combinePublisherData(publishers, publisherIDs);
              });
          } else {
            combinePublisherData(publishers, subscribedPublisherIDs);
          }
        }
      });
  }

  const fetchArticles = (route: string, body?: Object) => {
    apiFetch(route, body ? "POST" : "GET", body && body)
      .then((res: Response) => {
        if (isSuccess(res.status)) {
          setFetchStatus(200);
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

        setDisplayData(newsArticles);

        if (displayData.length < 1) {
          isSuccess(fetchStatus) ? setInfoTxt("There are no news to be fetched") : setInfoTxt(`There has been an error while fetching the news data. Status code ${fetchStatus}`);
        }
      });
  }

  const addSubscribedPublisherID = (id: string) => {
    setSubscribedPublisherIDs([...subscribedPublisherIDs, id]);
  }

  const removeSubscribedPublisherID = (id: string) => {
    const publisherIdx = subscribedPublisherIDs.indexOf(id);
    const temp = subscribedPublisherIDs;
    if (publisherIdx > -1) {
      temp.splice(publisherIdx, 1);
      setSubscribedPublisherIDs(temp);
    }
  }

  useLayoutEffect(() => {
    props.setPageName("News");

    setDisplayData([]);
    switch (displayedNewsOpt) {
      case "Top Headlines":
        fetchArticles("/news/top-headlines");

        break;
      case "Recommended":
        setInfoTxt("Not Implemented");

        break;
      case "Subscribed":
        const getSubscribedPublishers = async () => {
          const res = await apiFetch("/users/subscribed-publishers")
          const publisherIDs = await res.json();

          return publisherIDs;
        }

        // We assume that the user hasn't entered the "Publishers" page when the subscribedPublisherIDs array is empty. 
        // Therefore we don't know to which publishers he is subscribed to. So we fetch.
        if (subscribedPublisherIDs.length < 1) {
          getSubscribedPublishers()
            .then((publisherIDs: Array<string>) => {
              setSubscribedPublisherIDs(publisherIDs || []);
              fetchArticles("/news/publisher-news", subscribedPublisherIDs);
            });
        } else {
          fetchArticles("/news/publisher-news", subscribedPublisherIDs);
        }

        break;
      case "Publishers":
        getPublisherData();

        break;
      default:
        setInfoTxt("Not Implemented");
        break;
    }
  }, [displayedNewsOpt]);

  const renderChildren = (displayOpt: string): React.ReactElement => {
    switch (displayOpt) {
      case "Top Headlines":
      case "Subscribed":
        if (displayData) {
          return displayData.map((article: NewsProps) => (
            <CSSTransition key={article.URL} timeout={200} classNames="fullFade">
              <NewsCard key={article.URL}
                PublisherName={article.PublisherName}
                Title={article.Title}
                PublishedAt={article.PublishedAt}
                URL={article.URL}
                URLToImage={article.URLToImage}
                Author={article.Author}
                Description={article.Description}
              />
            </CSSTransition>
          ));
        }
      case "Recommended":
        break;
      case "Publishers":
        if (displayData) {
          return displayData.map((publisher: any) => (
            <CSSTransition key={publisher.ID} timeout={200} classNames="fullFade">
              <PublisherCard
                key={publisher.ID}
                id={publisher.ID}
                name={publisher.Name}
                description={publisher.Description}
                isSubscribed={publisher.isSubscribed || false}
                addSubscribedPublisherID={addSubscribedPublisherID}
                removeSubscribedPublisherID={removeSubscribedPublisherID}
              />
            </CSSTransition>
          ));
        }
      default:
        setInfoTxt("Not Implemented");
        return <div></div>
    }
  }


  return (
    <>
      <Select opts={["Top Headlines", "Recommended", "Subscribed", "Publishers"]}
        currentOptState={displayedNewsOpt}
        setCurrentOptState={setDisplayedNewsOpt} />
      {displayData.length < 1 && <BackgroundInfo infoText={infoTxt} />}
      <TransitionGroup className="grid">
        {renderChildren(displayedNewsOpt)}
      </TransitionGroup>
      <span className="copyright">Powered by
        <strong>
          <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer"> NewsAPI.org</a>
        </strong>
      </span>
    </>
  );
}