import { TASK_STATES } from "./Constants";
function more() {}
function play(taskId, state) {
  return {
    ...state,
    ...{status: TASK_STATES.ACTIVE, isPaused: false },
    ...getItembyId(taskId,state.tasks)
  };
}
function pause(taskId, state) {
  return {
    ...state,
    ...{ state: TASK_STATES.PENDNING, isPaused: true }
  };
}
function done(taskId, state) {
  return {
    ...state,
    ...{ state: TASK_STATES.FINISHED, isPaused: false }
  };
}
function restart(taskId, state) {
  return {
    ...state,
    ...{ state: TASK_STATES.ACTIVE, isPaused: false, timeElapsed: 0 }
  };
}
function remove(taskId, state) {
    // user filter to remove the task
}

function getItembyId(id,object){
  return object.filter(item => {
    return item.id === id
  })
}

const Actions = [
  more,
  play,
  pause,
  done,
  restart,
  remove
];

export default Actions;
