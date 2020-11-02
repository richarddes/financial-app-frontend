import React from "react";
import { useHistory } from "react-router-dom";
import "./NewsCard.css";
import { NewsProps } from "../types";

interface NewsCardProps extends NewsProps { };

export default function NewsCard(props: NewsCardProps): JSX.Element {
  const history = useHistory();

  return (
    <div role="gridcell" className="card" onClick={() => {
      history.push({
        pathname: `/news/article/${props.Title.replace(" ", "-").toLowerCase()}`,
        state: {
          url: props.URL
        }
      })
    }}>
      <img alt={props.URLToImage} width="100%" height="auto" src={props.URLToImage} />
      <div className="newsInfo">
        <h5>
          {props.Source}
          <span style={{ float: "right" }}>
            {props.PublishedAt}
          </span>
        </h5>
        <h4><strong>{props.Title}</strong></h4>
      </div>
    </div>
  )
}