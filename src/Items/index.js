import React from "react";
import { TASK_STATES } from "../Utils/Constants";
import Actions from '../Utils/Actions';

const Items = function(props) {
  return (props.tasks || []).map((task, index) => (
    <div key={index} className={"item " + props.type}>
      <div className="pre-header">{task.timer / 60 / 60 + "h"}</div>
      <div className="title">{task.title}</div>
      <div className="row footer">
        <div className="col">
          <div className="timer">{task.timer / 60}</div>
        </div>
        <div className="col right">
          <Controls type={props.type} />
        </div>
      </div>
    </div>
  ));
};

const Controls = function(props) {
  let controlItems = [];
  switch (props.type) {
    case TASK_STATES.PENDNING:
      controlItems = ["more", "play"];
      break;
    case TASK_STATES.ACTIVE:
      controlItems = ["more", "pause", "done"];
      break;
    case TASK_STATES.FINISHED:
      controlItems = ["restat", "remove"];
      break;
    default:
      controlItems = [];
      break;
  }

  return controlItems.map((item, index) => <button onClick={()=>Actions.item()} key={index}>{item}</button>);
};
export default Items;