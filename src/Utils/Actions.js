import { TASK_STATES } from "./Constants";
function more() {}
function play(state) {
  return {
    ...state,
    ...{ state: TASK_STATES.ACTIVE, isPaused: false }
  };
}
function pause(state) {
  return {
    ...state,
    ...{ state: TASK_STATES.PENDNING, isPaused: true }
  };
}
function done(state) {
  return {
    ...state,
    ...{ state: TASK_STATES.FINISHED, isPaused: false }
  };
}
function restart(state) {
  return {
    ...state,
    ...{ state: TASK_STATES.ACTIVE, isPaused: false, timeElapsed: 0 }
  };
}
function remove(task) {
    // user filter to remove the task
}

const Actions = {
  more,
  play,
  pause,
  done,
  restart,
  remove
};

export default Actions;
