import React, { useState } from "react";
import update from "react-addons-update";
import PropTypes from "prop-types";

import ControlBar from "./ControlBar";
import Items from "./Items";
import Tasks from "./Tasks";

import Util from "./Utils";
import {
  TASK_STATES,
  TASK_ACTIONS_ICONS as ICON,
  TASK_ACTIONS as ACTIONS
} from "./Utils/Constants";

import { Modal, Input } from "antd";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timers: this.props.timers,
      tasks: this.props.tasks,
      pending: this.props.pending,
      active: this.props.active,
      finished: this.props.finished,
      renameModal: this.props.renameModal,
      renameTask: this.props.renameTask
    };
  }

  _action = ({ taskId, actionType }) => {
    this[actionType](taskId);
  };

  createTask = task => {
    // add new task in to the pending list
    const _task = {
      id: Math.floor(Date.now()),
      ...task, // { title, totalTime }
      status: TASK_STATES.PENDNING,
      isPaused: false,
      startTime: 0,
      elapsedTime: 0
    };
    this.setState(state => {
      const updatedTasks = [...state.tasks, _task];
      return { tasks: updatedTasks };
    });
    // show message
    Util.Notificacion(task.title + " has been created", ICON[ACTIONS.NEW]);
  };

  play = taskId => {
    let currItem = Util.GetItemWithIndex(taskId, this.state.tasks);

    const updatedTask = {
      ...currItem,
      status: TASK_STATES.ACTIVE,
      isPaused: false,
      startTime: currItem.isPaused
        ? Date.now() - currItem.elapsedTime
        : Date.now(),
      elapsedTime:
        currItem.status === TASK_STATES.FINISHED ? 0 : currItem.elapsedTime // if restart -> 0
    };

    // move task from pending -> active
    this.setState(
      {
        tasks: update(this.state.tasks, {
          $splice: [[currItem.index, 1]]
        }),
        active: update(this.state.active, { $push: [updatedTask] })
      },
      () => {
        // callback
        this.startTimer(taskId);
      }
    );
    // show message
    Util.Notificacion(currItem.title + " has been started", ICON[ACTIONS.PLAY]);
  };

  pause = taskId => {
    // clear interval
    this.stopTimer(taskId);

    // update task
    const currItem = Util.GetItemWithIndex(taskId, this.state.active);
    const updatedTask = {
      ...currItem,
      status: TASK_STATES.PENDNING,
      isPaused: true
    };

    // move task from active -> pending
    this.setState({
      tasks: update(this.state.tasks, { $push: [updatedTask] }),
      active: update(this.state.active, {
        $splice: [[currItem.index, 1]]
      })
    });

    // show message
    Util.Notificacion(currItem.title + " has been paused", ICON[ACTIONS.PAUSE]);
  };

  done = taskId => {
    // clear interval
    this.stopTimer(taskId);

    let currItem = Util.GetItemWithIndex(taskId, this.state.active);
    const updatedTask = {
      ...currItem,
      status: TASK_STATES.FINISHED
    };

    // move task from active -> finished
    this.setState({
      active: update(this.state.active, {
        $splice: [[currItem.index, 1]]
      }),
      finished: update(this.state.finished, { $push: [updatedTask] })
    });

    // show message
    Util.Notificacion(
      currItem.title + " has been marked as completed",
      ICON[ACTIONS.DONE]
    );
  };

  restart = taskId => {
    let currItem = Util.GetItemWithIndex(taskId, this.state.finished);

    // move task from finished -> pending
    this.setState(
      {
        finished: update(this.state.finished, {
          $splice: [[currItem.index, 1]]
        }),
        tasks: update(this.state.tasks, { $push: [currItem] })
      },
      () => {
        this.play(taskId);
      }
    );
    // show message
    Util.Notificacion(
      currItem.title + " has been restarted",
      ICON[ACTIONS.RESTART]
    );
  };

  // Dirty approach
  // Todo: re-write this method
  remove = taskId => {
    let currItem = Util.FindItem(taskId, this.state);

    // remove task from state[tasks|active|finished]
    this.setState({
      active: update(this.state.active, {
        $splice: [[currItem.index, 1]]
      }),
      tasks: update(this.state.tasks, {
        $splice: [[currItem.index, 1]]
      }),
      finished: update(this.state.finished, {
        $splice: [[currItem.index, 1]]
      })
    });

    // show message
    Util.Notificacion(
      currItem.title + " has been removed",
      ICON[ACTIONS.REMOVE]
    );
  };

  rename = param => {
    // show modal
    if (typeof param === "number") {
      this.setState({
        renameModal: true,
        renameTask: Util.GetItemWithIndex(param, this.state.tasks)
      });
    }
    // hide modal
    if (typeof param === "boolean" && !param) {
      this.setState({ renameModal: false, renameTask: {} });
    }
  };

  updateName = newTitle => {
    let updatedtask = { ...this.state.renameTask, title: newTitle };
    this.setState({
      tasks: update(this.state.tasks, {
        [this.state.renameTask.index]: { $set: updatedtask }
      }),
      renameModal: false,
      renameTask: {}
    });

    // hide modal and update task name
    this.setState({ renameModal: false, renameTaskId: null });
  };

  startTimer = taskId => {
    let interval = setInterval(() => {
      let currItem = Util.GetItemWithIndex(taskId, this.state.active);

      // clear timer if target is reached
      if (currItem.elapsedTime >= currItem.totalTime) {
        return this.done(taskId);
      }

      // update elapsed time
      this.setState(state => {
        return {
          active: update(state.active, {
            [currItem.index]: {
              elapsedTime: { $set: Date.now() - currItem.startTime }
            }
          })
        };
      });
    }, 1000);

    //push interval -> state.timers[]
    this.setState(state => {
      return { timers: [...state.timers, { id: taskId, interval: interval }] };
    });
  };

  stopTimer = taskId => {
    const timer = Util.GetItemWithIndex(taskId, this.state.timers);
    clearInterval(timer.interval);

    this.setState({
      timers: update(this.state.timers, {
        $splice: [[timer.index, 1]]
      })
    });
  };

  // TODO: Use React Context API to render the items and share state.
  render() {
    return (
      <div className="App">
        {this.state.renameModal ? (
          <RenameModal
            tasks={this.state.tasks}
            visible={this.state.renameModal}
            task={this.state.renameTask}
            save={this.updateName}
            hide={this.rename}
          />
        ) : (
          ""
        )}
        <ControlBar createTask={this.createTask} />
        <Tasks header="Active Task">
          <Items
            tasks={Util.FilterTasks(this.state.active, TASK_STATES.ACTIVE)}
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
            tasks={Util.FilterTasks(this.state.finished, TASK_STATES.FINISHED)}
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
  active: [],
  pending: [],
  finished: [],
  renameModal: false,
  renameTask: {}
};

App.propTypes = {
  timers: PropTypes.array,
  tasks: PropTypes.array,
  active: PropTypes.array,
  pending: PropTypes.array,
  finished: PropTypes.array,
  renameModal: PropTypes.bool,
  renameMorenameTaskdal: PropTypes.object
};

export default App;

// Todo: Create separate file for this method
const RenameModal = props => {
  const [title, setTitle] = useState(props.task.title);
  const handleInputChange = function(e) {
    setTitle(e.currentTarget.value);
  };

  // return if no task is selected for rename
  if (props.task === {}) return;

  return (
    <Modal
      title={"Rename task: " + props.task.title}
      centered
      visible={props.visible}
      onOk={() => props.save(title)}
      onCancel={() => props.hide(false)} // hide modal
    >
      <p>
        <Input
          placeholder="Task title..."
          onChange={handleInputChange}
          value={title}
        />
      </p>
    </Modal>
  );
};
