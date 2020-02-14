import React from "react";
import { TASK_STATES } from "../Utils/Constants";

const Items = function(props) {
  return (props.tasks || []).map(task => (
    <div key={task.id} className={"item " + props.status}>
      <div className="pre-header">{task.timer / 60 / 60 + "h"}</div>
      <div className="title">{task.title}</div>
      <div className="row footer">
        <div className="col">
          <div className="timer">{task.timer / 60}</div>
        </div>
        <div className="col right">
          <Controls status={props.status} action={props.action} taskId={task.id} />
        </div>
      </div>
    </div>
  ));
};

const Controls = function(props) {
  let controlItems = [];
  switch (props.status) {
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

  return controlItems.map((actionType, index) => (
    <button onClick={() => props.action({...props,actionType})} key={index}>
      {actionType}
    </button>
  ));
};
export default Items;
