import React, { useState } from "react";
import { Button, Menu, InputNumber, Input } from "antd";
import Util from "../Utils";

const ControlBar = function(props) {
  const [title, setTitle] = useState("");
  const [timer, setTimer] = useState(Math.pow(60, 2) * 1000); // 1hour by default
  const [selectedTime, setselectedTime] = useState("1h");

  const handleTitleChange = function(e) {
    setTitle(e.currentTarget.value);
  };

  const handleCustomTimer = function(value) {
    setTimer(Math.floor(value * 60 * 1000)); /* mili seconds */
  };

  const chooseTime = function(time) {
    setTimer(time * Math.pow(60, 2) * 1000); /* mili seconds */
  };

  const handleHoursClick = function(e) {
    setselectedTime(e.key);
  };
  const createTask = function() {
    if(title === "" || timer === "") {
      // show message
      Util.Notificacion("Title or Timer cannot be empty", "exclamation-circle");
      return;
    }
    props.createTask({ title: title, totalTime: timer });
    setTitle("");
    chooseTime(1);
    setselectedTime("1h");
  };
  return (
    <>
      <div className="control-bar">
        <div>
          <Input
            size="large"
            value={title}
            onChange={handleTitleChange}
            type="text"
            placeholder="Create a new task"
          />
        </div>
        <div>
          <Menu
            onClick={handleHoursClick}
            selectedKeys={[selectedTime]}
            mode="horizontal"
          >
            <Menu.Item onClick={() => chooseTime(1)} key="1h">
              1h
            </Menu.Item>
            <Menu.Item onClick={() => chooseTime(2)} key="2h">
              2h
            </Menu.Item>
            <Menu.Item onClick={() => chooseTime(3)} key="3h">
              3h
            </Menu.Item>
            <Menu.Item onClick={() => chooseTime(5)} key="4h">
              5h
            </Menu.Item>
            <Menu.Item style={{ padding: 0 }} key="custom">
              <InputNumber
                style={{ width: 80 }}
                placeholder="...min"
                min={1}
                max={1440}
                onChange={handleCustomTimer}
              />
            </Menu.Item>
            <Menu.Item style={{ padding: 0 ,paddingLeft: 10}}>
              <Button onClick={createTask}>Create</Button>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default ControlBar;
