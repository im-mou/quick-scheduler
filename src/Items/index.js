import React from "react";
import {
  TASK_ACTIONS_LIST as ACTIONS,
  TASK_ACTIONS_ICONS as ICON
} from "../Utils/Constants";
import { Button } from "antd";

const Items = function(props) {
  return (props.tasks || []).map(task => (
    <div key={task.id} className={"item " + props.status}>
      <div className="pre-header">{task.timer / 60 / 60 + "h"}</div>
      <div className="title">{task.title}</div>
      <div className="row footer">
        <div className="col">
          <div className="timer">{task.timer / 60}</div>
        </div>
          <Controls
            status={props.status}
            action={props.action}
            taskId={task.id}
          />
      </div>
    </div>
  ));
};

const Timer = function(props) {};

const Controls = function(props) {
  let controlItems = ACTIONS[props.status];
  console.log(controlItems)

  const ControlButtons = controlItems.map((actionType, index) => (
    <Button
      type="link"
      icon={ICON[actionType]}
      style={{ fontSize: "20px", color: "#8a8a8a" }}
      onClick={() => props.action({ ...props, actionType })}
      key={index}
    />
  ));

  return (
    <div className="col right">
      <div className="controls">
        {ControlButtons}
      </div>
    </div>
  );
};
export default Items;
