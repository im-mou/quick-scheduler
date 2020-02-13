import React from 'react';
import './App.css';

import ControlBar from './ControlBar';
import Item from './Item';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
    }

    this.createTask = this.createTask.bind(this)
  }

  createTask(task) {
    const newTasks = { ...this.state.tasks, task };
    this.setState({
      tasks: newTasks
    })
  }

  render() {
    return (
      <>
        <ControlBar createTask={this.createTask} />
        <Item tasks={this.state.tasks} />
      </>
    )
  }
}

export default App;
