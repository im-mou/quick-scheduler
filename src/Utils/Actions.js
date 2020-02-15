import { TASK_STATES } from "./Constants";

function play(taskId, state) {
  let newTasks = updateItem(taskId, state.tasks, {
    status: TASK_STATES.ACTIVE,
    isPaused: false
  });

  return {
    ...state,
    tasks: newTasks
  };
}
function pause(taskId, state) {
  let newTasks = updateItem(taskId, state.tasks, {
    isPaused: true,
    status: TASK_STATES.PENDNING
  });

  return {
    ...state,
    tasks: newTasks
  };
}
function done(taskId, state) {
  let newTasks = updateItem(taskId, state.tasks, {
    isPaused: false,
    status: TASK_STATES.FINISHED
  });

  return {
    ...state,
    tasks: newTasks
  };
}
function restart(taskId, state) {
  let newTasks = updateItem(taskId, state.tasks, {
    isPaused: false,
    timeElapsed: 0,
    status: TASK_STATES.ACTIVE
  });

  return {
    ...state,
    tasks: newTasks
  };
}
function remove(taskId, state) {
  return {
    ...state,
    tasks: state.tasks.filter(item => {
      return item.id !== taskId;
    })
  };
}

function updateItem(id, object, data) {
  return object.map(item => {
    if (item.id === id) {
      return { ...item, ...data };
    }
    return item;
  });
}

export const FilterTasks = (tasks, status) => {
  return tasks.filter(item => {
    return item.status === status;
  });
};

export const Actions = {
  play,
  pause,
  done,
  restart,
  remove
};
