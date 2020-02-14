import React from "react";
import "./App.css";

import ControlBar from "./ControlBar";
import Tasks from "./Tasks";
import { TASK_STATES } from "./Utils/Constants";
import Actions from "./Utils/Actions";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      activeTask: [],
      finishedTasks: []
    };
    this.createTask = this.createTask.bind(this);
  }

  componentDidMount() {
    this.createTask();
  }

  action = (action) => {
    this.updateState(Actions.action(this.state));
  };

  updateState = newState => {
    this.setState(newState);
  }

  createTask(task) {
    // add new task in to the pending list
    const _task = {
      //...task,
      title: "task name",
      timer: Number(60 * 60),
      state: TASK_STATES.PENDNING,
      timeElapsed: 0,
      isPaused: false
    };

    this.setState(state => {
      const newTasks = [...state.tasks, _task];
      return { tasks: newTasks };
    });
    this.setState(state => {
      const newTasks = [...state.activeTask, _task];
      return { activeTask: newTasks };
    });
    this.setState(state => {
      const newTasks = [...state.finishedTasks, _task];
      return { finishedTasks: newTasks };
    });
  }

  render() {
    return (
      <div className="App">
        <ControlBar createTask={this.createTask} />
        <Tasks
          header="Active Task"
          tasks={this.state.activeTask}
          type={TASK_STATES.ACTIVE}
        />
        <Tasks
          header="Pending"
          tasks={this.state.tasks}
          type={TASK_STATES.PENDNING}
        />
        <Tasks
          header="Completed"
          tasks={this.state.finishedTasks}
          type={TASK_STATES.FINISHED}
        />
      </div>
    );
  }
}

export default App;
