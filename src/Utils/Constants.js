export const TASK_STATES = {
  ACTIVE: "active",
  PENDNING: "pending",
  FINISHED: "finished"
};

export const TASK_ACTIONS = {
  PLAY: "play",
  MORE: "more",
  PAUSE: "pause",
  DONE: "done",
  RESTART: "restart",
  REMOVE: "remove"
};

export const TASK_ACTIONS_ICONS = {
  [TASK_ACTIONS.MORE]: "ellipsis",
  [TASK_ACTIONS.PLAY]: "play-circle",
  [TASK_ACTIONS.PAUSE]: "pause",
  [TASK_ACTIONS.DONE]: "check",
  [TASK_ACTIONS.RESTART]: "undo",
  [TASK_ACTIONS.REMOVE]: "delete"
};

export const TASK_ACTIONS_LIST = {
  [TASK_STATES.ACTIVE]: [
    TASK_ACTIONS.MORE,
    TASK_ACTIONS.PAUSE,
    TASK_ACTIONS.DONE
  ],
  [TASK_STATES.PENDNING]: [
    TASK_ACTIONS.MORE, 
    TASK_ACTIONS.PLAY
  ],
  [TASK_STATES.FINISHED]: [
    TASK_ACTIONS.MORE,
    TASK_ACTIONS.RESTART,
    TASK_ACTIONS.REMOVE
  ]
};
