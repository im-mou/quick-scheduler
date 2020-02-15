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
    TASK_ACTIONS_ICONS.MORE,
    TASK_ACTIONS_ICONS.PAUSE,
    TASK_ACTIONS_ICONS.DONE
  ],
  [TASK_STATES.PENDNING]: [TASK_ACTIONS_ICONS.MORE, TASK_ACTIONS_ICONS.PLAY],
  [TASK_STATES.FINISHED]: [
    TASK_ACTIONS_ICONS.MORE,
    TASK_ACTIONS_ICONS.RESTART,
    TASK_ACTIONS_ICONS.REMOVE
  ]
};
