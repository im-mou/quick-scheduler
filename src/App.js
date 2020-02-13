import React from 'react';
import './App.css';

import ControlBar from './ControlBar';
import Tasks from './Tasks';

const TASK_STATES = {
  ACTIVE: 'active',
  PENDNING: 'pending',
  FINISHED: 'finished',
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      activeTask: [],
      finishedTasks: []
    }

    this.createTask = this.createTask.bind(this)
  }

  createTask(task) {
    // add new task to pending bulk
    const _task = {
      ...task,
      state: TASK_STATES.PENDNING,
      timeElapsed: 0,
      isPaused: false,
    }

    this.setState((state) => {
      const newTasks = [...state.tasks, _task];
      return { tasks: newTasks }
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
    )
  }
}

export default App;
