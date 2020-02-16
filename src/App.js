import React from "react";
import PropTypes from "prop-types";
import "./App.css";

import ControlBar from "./ControlBar";
import Items from "./Items";
import Tasks from "./Tasks";
import { TASK_STATES } from "./Utils/Constants";
import Util from "./Utils";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timers: this.props.timers,
      tasks: this.props.tasks,
      pending: this.props.pending,
      active: this.props.active,
      finished: this.props.finished
    };
    this.createTask = this.createTask.bind(this);
  }
  timer = [];

  componentDidMount() {
    //this.createTask();
  }

  _action = ({ taskId, actionType }) => {
    this[actionType](taskId);
    //this.updateState(newState);
  };

  createTask = task => {
    // add new task in to the pending list
    const _task = {
      id: Math.floor(Date.now()),
      ...task, // { title, totalTime }
      status: TASK_STATES.PENDNING,
      isPaused: false,
      startTime: null,
      elapsedTime: null
    };
    this.setState(state => {
      const newTasks = [...state.tasks, _task];
      return { tasks: newTasks };
    });
  };

  async updateState(newTasks) {
    this.setState({
      tasks: newTasks
    });
  }

  tick = taskId => {
    const currItem = Util.GetItem(taskId, this.state.tasks);
    const filtereditem = Util.FilterItem(taskId, this.state.tasks);

    const interval = setInterval(() => {
      const newTasks = [
        ...filtereditem,
        {
          ...currItem,
          elapsedTime: Date.now() - currItem.startTime
        }
      ];
      this.setState({
        tasks: newTasks
      });
    }, 1000);

    this.timer.push({taskId:interval})
    this.setState(state=>{
      return {timers : state.timers.push(interval)}
    })
  };

  play = taskId => {
    if (Util.GetItem(taskId, this.state.tasks).status === TASK_STATES.ACTIVE) {
      return;
    }

    let newTasks = Util.UpdateItem(taskId, this.state.tasks, {
      status: TASK_STATES.ACTIVE,
      isPaused: false,
      startTime: Date.now()
    });

    this.updateState(newTasks).then(() => {
      this.tick(taskId);
    });
  };
  pause = taskId => {
    let newTasks = Util.UpdateItem(taskId, this.state.tasks, {
      isPaused: true,
      status: TASK_STATES.PENDNING
    });

    this.updateState(newTasks);
  };
  done = taskId => {
    let newTasks = Util.UpdateItem(taskId, this.state.tasks, {
      isPaused: false,
      status: TASK_STATES.FINISHED
    });

    this.updateState(newTasks);
  };
  restart = taskId => {
    let newTasks = Util.UpdateItem(taskId, this.state.tasks, {
      isPaused: false,
      suspended: 0,
      status: TASK_STATES.ACTIVE
    });

    this.updateState(newTasks);
  };
  remove = taskId => {
    this.updateState(
      this.state.tasks.filter(item => {
        return item.id !== taskId;
      })
    );
  };

  // TODO: Use React Context API to render the items and share state.
  render() {
    return (
      <div className="App">
        <ControlBar createTask={this.createTask} />
        <Tasks header="Active Task">
          <Items
            tasks={Util.FilterTasks(this.state.tasks, TASK_STATES.ACTIVE)}
            status={TASK_STATES.ACTIVE}
            action={this._action}
          />
        </Tasks>
        <Tasks header="Pending">
          <Items
            tasks={Util.FilterTasks(this.state.tasks, TASK_STATES.PENDNING)}
            status={TASK_STATES.PENDNING}
            action={this._action}
          />
        </Tasks>
        <Tasks header="Completed">
          <Items
            tasks={Util.FilterTasks(this.state.tasks, TASK_STATES.FINISHED)}
            status={TASK_STATES.FINISHED}
            action={this._action}
          />
        </Tasks>
      </div>
    );
  }
}

App.defaultProps = {
  timers: [],
  tasks: [],
  active: {},
  pending: [],
  finished: []
};

App.propTypes = {
  timers: PropTypes.array,
  tasks: PropTypes.array,
  active: PropTypes.object,
  pending: PropTypes.array,
  finished: PropTypes.array
};

export default App;
