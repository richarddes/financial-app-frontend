import React from "react";
import "./Select.css"

export default function Select(props: {opts : string[], currentOptState : string, setCurrentOptState : any}) {
  return (
    <div className="selectParent">
      <select role="list" value={props.currentOptState} onChange={event => props.setCurrentOptState(event.target.value)}>
        {props.opts.map((opt: string) => {
          return (
            <option key={opt} value={opt}>{opt}</option>
          );
        })}
      </select> 
    </div>
  )
}