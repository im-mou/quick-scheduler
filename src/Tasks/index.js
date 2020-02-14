import React from "react";
import Items from "../Items";

const Tasks = function(props) {
  const newProps = { ...props, ...filterTasks(props) };
  return (
    <div className="section">
      <div className="header">{props.header}</div>
      <div className="items">
        <Items {...newProps} />
      </div>
    </div>
  );
};

const filterTasks = function({ tasks, status }) {
  const filteredItems = tasks.filter(item => {
    return item.status === status;
  });
  return { tasks: filteredItems };
};

export default Tasks;