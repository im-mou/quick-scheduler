import React from "react";
import PropTypes from "prop-types";
import "./App.css";

import ControlBar from "./ControlBar";
import Tasks from "./Tasks";
import { TASK_STATES } from "./Utils/Constants";
import Actions from "./Utils/Actions";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: this.props.tasks,
      pending: this.props.pending,
      active: this.props.active,
      finished: this.props.finished
    };
    this.createTask = this.createTask.bind(this);
  }

  componentDidMount() {
    this.createTask();
  }

  _action = ({taskId, status, actionType}) => {
    console.log(taskId, status, actionType)
    this.updateState(Actions[actionType](taskId, this.state));
  };

  updateState = newState => {
    this.setState(newState);
  };

  createTask(task) {
    // add new task in to the pending list
    const _task = {
      //...task,
      id: Date.now(),
      title: "task name",
      timer: Number(60 * 60),
      status: TASK_STATES.PENDNING,
      timeElapsed: 0,
      isPaused: false
    };

    this.setState(state => {
      const newTasks = [...state.tasks, _task];
      return { tasks: newTasks };
    });
  }

  render() {
    return (
      <div className="App">
        <ControlBar createTask={this.createTask} />
        <Tasks
          header="Active Task"
          tasks={this.state.tasks}
          status={TASK_STATES.ACTIVE}
          action={this._action}
        />
        <Tasks
          header="Pending"
          tasks={this.state.tasks}
          status={TASK_STATES.PENDNING}
          action={this._action}
        />
        <Tasks
          header="Completed"
          tasks={this.state.tasks}
          status={TASK_STATES.FINISHED}
          action={this._action}
        />
      </div>
    );
  }
}

App.defaultProps = {
  tasks: [],
  active: {},
  pending: [],
  finished: []
};

App.propTypes = {
  tasks: PropTypes.array,
  active: PropTypes.object,
  pending: PropTypes.array,
  finished: PropTypes.array
};

export default App;
