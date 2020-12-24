import React, { useContext, useState } from "react";
import { AuthContext } from "../auth/auth";
import { apiFetch, isSuccess } from "../utils/utils";
import "./PublisherCard.css";

export default function PublisherCard(props: {
  id: string,
  name: string,
  description: string,
  isSubscribed: boolean,
  addSubscribedPublisherID: (id: string) => void,
  removeSubscribedPublisherID: (id: string) => void,
}) {

  const [isSubscribed, setIsSubscribed] = useState<boolean>(props.isSubscribed);

  const auth = useContext(AuthContext);

  const handleSubscription = () => {
    apiFetch(`/users/${isSubscribed ? "unsubscribe-from-publisher" : "subscribe-to-publisher"}`, "POST", { publisherID: props.id })
      .then((res: Response) => {
        if (isSuccess(res.status)) {
          return res.json();
        } else if (res.status === 401) {
          auth.toggleAuth();
          return;
        } else {
          alert(`An unexpected error has occured while performing the action. Status code ${res.status}`);
          return;
        }
      });

    setIsSubscribed(!isSubscribed);

    isSubscribed ? props.removeSubscribedPublisherID(props.id) : props.addSubscribedPublisherID(props.id);
  }

  return (
    <div className="card publisherCard">
      <h2>{props.name}</h2>
      <p>{props.description}</p>
      <button onClick={() => handleSubscription()} className={isSubscribed ? "subscribed-btn" : "unsubscribed-btn"}>{isSubscribed ? "Subscribed ✔" : "Subscribe"}</button>
    </div>
  );
}