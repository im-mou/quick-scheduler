import React from "react";
import {
  TASK_STATES as STATUS,
  TASK_ACTIONS_LIST as ACTIONS,
  TASK_ACTIONS_ICONS as ICON
} from "../Utils/Constants";
import { Button, Progress } from "antd";

const Items = function(props) {
  const isActive = props.status === STATUS.ACTIVE;
  return (props.tasks || []).map(task => (
    <div key={task.id} className={"row item " + props.status}>
      <div className="item-content">
        <div className="row pre-header">{task.totalTime}</div>
        <div className="row">
          <div className="col title">{task.title}</div>
          <div className={isActive ? "row footer" : "footer"}>
            {isActive ? <Timer timer={task.totalTime} /> : ""}
            <Controls
              status={props.status}
              action={props.action}
              taskId={task.id}
            />
          </div>
        </div>
      </div>
      <Progress
        strokeWidth={3}
        percent={(task.elapsedTime / task.totalTime) * 100}
        showInfo={false}
      />
    </div>
  ));
};

const Timer = function(props) {
  return <div className="col timer">{props.timer}</div>;
};

// const Progress = function(props) {
//   return <div style={{flex: props.width}} className="progress"></div>;
// };

const Controls = function(props) {
  const ControlButtons = ACTIONS[props.status].map((actionType, index) => (
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
      <div className="controls">{ControlButtons}</div>
    </div>
  );
};

export default Items;
