import React, { useState } from "react";
import update from "immutability-helper";
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

import { Modal, Input, Empty } from "antd";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timers: this.props.timers,
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
      elapsedTime: 0,
    };
    this.setState(state => {
      const updatedTasks = [...state.pending, _task];
      return { pending: updatedTasks };
    });
    // show message
    //Util.Notificacion(task.title + " has been created", ICON[ACTIONS.NEW]);
  };

  play = taskId => {
    let currItem = Util.GetItemWithIndex(taskId, this.state.pending);

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
        pending: update(this.state.pending, {
          $splice: [[currItem.index, 1]]
        }),
        active: update(this.state.active, { $push: [updatedTask] })
      },
      () => {
        // callback
        this.startTimer(taskId);
      }
    );
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
      pending: update(this.state.pending, { $push: [updatedTask] }),
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
        pending: update(this.state.pending, { $push: [currItem] })
      },
      () => {
        this.play(taskId);
      }
    );
  };

  remove = taskId => {
    let currItem = Util.FindItem(taskId, this.state);

    // remove task from state[pending|active|finished]
    this.setState({
      [currItem.status]: update(this.state[currItem.status], {
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
        renameTask: Util.GetItemWithIndex(param, this.state.pending)
      });
    }
    // hide modal
    if (typeof param === "boolean" && !param) {
      this.setState({ renameModal: false, renameTask: {} });
    }
  };

  updateName = newTitle => {
    // hide modal and update task name
    let updatedtask = { ...this.state.renameTask, title: newTitle };
    this.setState({
      pending: update(this.state.pending, {
        [this.state.renameTask.index]: { $set: updatedtask }
      }),
      renameModal: false,
      renameTask: {}
    });
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
            tasks={this.state.pending}
            visible={this.state.renameModal}
            task={this.state.renameTask}
            save={this.updateName}
            hide={this.rename}
          />
        ) : (
          ""
        )}
        <Logo />
        <ControlBar createTask={this.createTask} />
        <div className="task-wrapper">
          <EmptyState {...this.state} />
          <Tasks
            className={!this.state.active.length ? "hidden" : ""}
            header="Active Tasks"
          >
            <Items
              tasks={Util.FilterTasks(this.state.active, TASK_STATES.ACTIVE)}
              status={TASK_STATES.ACTIVE}
              action={this._action}
            />
          </Tasks>
          <Tasks
            className={!this.state.pending.length ? "hidden" : ""}
            header="Pending"
          >
            <Items
              tasks={Util.FilterTasks(this.state.pending, TASK_STATES.PENDNING)}
              status={TASK_STATES.PENDNING}
              action={this._action}
            />
          </Tasks>
          <Tasks
            className={!this.state.finished.length ? "hidden" : ""}
            header="Completed"
          >
            <Items
              tasks={Util.FilterTasks(this.state.finished, TASK_STATES.FINISHED)}
              status={TASK_STATES.FINISHED}
              action={this._action}
            />
          </Tasks>
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  timers: [],
  active: [],
  pending: [],
  finished: [],
  renameModal: false,
  renameTask: {}
};

App.propTypes = {
  timers: PropTypes.array,
  active: PropTypes.array,
  pending: PropTypes.array,
  finished: PropTypes.array,
  renameModal: PropTypes.bool,
  renameTask: PropTypes.object
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

// Todo: Create separate file for this method
const EmptyState = props => {
  if (!props.pending.length && !props.active.length && !props.finished.length) {
    return (
      <Empty
        style={{ marginTop: 130 }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<span>No tasks at the moment</span>}
      />
    );
  } else {
    return null;
  }
};

// Todo: Create separate file for this method
const Logo = () => {
  return (
    <div className="logo">
      <img alt="Quick Scheduler" src="logo.png" width={120} />
    </div>
  );
};
