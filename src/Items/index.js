import React from "react";
import moment from "moment";
import {
  TASK_STATES as STATUS,
  TASK_ACTIONS as ACTION,
  TASK_ACTIONS_LIST as ACTIONS,
  TASK_ACTIONS_ICONS as ICON,
  TASK_ACTIONS_NAMES as ACTION_NAME,
  TASK_ACTIONS_MORE_OPTIONS as MORE_OPTIONS
} from "../Utils/Constants";
import { Button, Progress, Tooltip, Menu, Dropdown, Statistic } from "antd";
const { Countdown } = Statistic;

const Items = function(props) {
  const isActive = props.status === STATUS.ACTIVE;
  return (props.tasks || []).map(task => (
    <div key={task.id} className={"row item " + props.status}>
      <div className="item-content">
        <div className="row pre-header">{getTime(task.totalTime)}</div>
        <div className="row">
          <div className="col title">{task.title}</div>
          <div className={isActive ? "row footer" : "footer"}>
            {isActive ? (
              <Timer timer={Date.now() + task.totalTime - task.elapsedTime} />
            ) : (
              ""
            )}
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

const getTime = time => {
  if (time >= 3600000) {
    return moment(time - 1).toObject().hours + "h";
  } else {
    return moment(time).toObject().minutes + "m";
  }
};

const Timer = function(props) {
  return (
    <div className="col timer">
      <Countdown
        value={props.timer}
        format="HH:mm:ss"
      />
    </div>
  );
};

// dropdown menu
const menu = props => {
  const optionsButtons = MORE_OPTIONS[props.status].map((option, index) => (
    <Menu.Item
      key={index}
      onClick={() => props.action({ ...props, actionType: option })}
    >
      <span>{ACTION_NAME[option]}</span>
    </Menu.Item>
  ));

  return <Menu>{optionsButtons}</Menu>;
};

const Controls = function(props) {
  const ControlButtons = ACTIONS[props.status].map((actionType, index) => (
    <Tooltip placement="top" title={ACTION_NAME[actionType]} key={index}>
      {actionType !== ACTION.MORE ? (
        <Button
          type="link"
          icon={ICON[actionType]}
          style={{ fontSize: "20px", color: "#8a8a8a" }}
          onClick={() => props.action({ ...props, actionType })}
        />
      ) : (
        // if the control item is "MORE"
        <Dropdown overlay={menu(props)} trigger={["click"]}>
          <Button
            type="link"
            icon={ICON[actionType]}
            style={{ fontSize: "20px", color: "#8a8a8a" }}
          />
        </Dropdown>
      )}
    </Tooltip>
  ));

  return (
    <div className="col right">
      <div className="controls">{ControlButtons}</div>
    </div>
  );
};

export default Items;
