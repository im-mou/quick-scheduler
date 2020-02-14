import { TASK_STATES } from "./Constants";
function more() {}
function play(taskId, state) {

  const newObj = {
    ...getItembyId(taskId, state.tasks),
    status: TASK_STATES.ACTIVE,
    isPaused: false
  };
  // return {
  //   ...state,
  //   ...{ status: TASK_STATES.ACTIVE, isPaused: false },
  //   ...getItembyId(taskId, state.tasks)
  // };

  console.log(getItembyId(taskId, state.tasks))
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

function getItembyId(id, object) {
  return object.filter(item => {
    return item.id === id;
  });
}

export const Actions = {
  more,
  play,
  pause,
  done,
  restart,
  remove
};

export const FilterTasks = (tasks, status) => {
  return tasks.filter(item => {
    return item.status === status;
  });
};
