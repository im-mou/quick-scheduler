import React, { useState } from "react";
import { Button } from "antd";

const ControlBar = function(props) {
  const [title, setTitle] = useState("");
  const [timer, setTimer] = useState(0);
  const handleInputChange = function(e) {
    setTitle(e.currentTarget.value);
  };
  const selectTimer = function(time) {
    setTimer(time * Math.pow(60,2) * 1000); /* mili seconds */
  };
  const timerInput = function(e) {
    const timer = e.currentTarget.value;
    setTimer(Math.floor(timer*60 * 1000)); /* mili seconds */
  };
  const createTask = function() {
    props.createTask({ title: title, totalTime: timer });
    setTitle("");
    setTimer(0);
  };
  return (
    <div>
      <div>
        <input
          value={title}
          onChange={handleInputChange}
          type="text"
          placeholder="Create a new task"
        />
      </div>
      <div>
        <button onClick={() => selectTimer(1)}>1h</button>
        <button onClick={() => selectTimer(2)}>2h</button>
        <button onClick={() => selectTimer(3)}>3h</button>
        <button onClick={() => selectTimer(5)}>5h</button>
        <input onChange={timerInput} type="number" placeholder="Minutes..." />
      </div>
      <div>
        <Button onClick={createTask}>Create</Button>
      </div>
    </div>
  );
};

export default ControlBar;
