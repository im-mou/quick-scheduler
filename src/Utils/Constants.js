export const TASK_STATES = {
  ACTIVE: 'active',
  PENDNING: 'pending',
  FINISHED: 'finished',
};

export const TASK_ACTIONS = {
  PLAY: 'play',
  MORE: 'more',
  PAUSE: 'pause',
  DONE: 'done',
  RESTART: 'restart',
  REMOVE: 'remove',
  RENAME: 'rename',
  NEW: 'new',
};

export const TASK_ACTIONS_ICONS = {
  [TASK_ACTIONS.MORE]: 'ellipsis',
  [TASK_ACTIONS.PLAY]: 'play-circle',
  [TASK_ACTIONS.PAUSE]: 'pause',
  [TASK_ACTIONS.DONE]: 'check',
  [TASK_ACTIONS.RESTART]: 'undo',
  [TASK_ACTIONS.REMOVE]: 'delete',
  [TASK_ACTIONS.NEW]: 'download',
};

export const TASK_ACTIONS_DESC = {
  [TASK_ACTIONS.MORE]: 'Options',
  [TASK_ACTIONS.PLAY]: 'Start',
  [TASK_ACTIONS.PAUSE]: 'Pause',
  [TASK_ACTIONS.DONE]: 'Mark as completed',
  [TASK_ACTIONS.RESTART]: 'Restart',
  [TASK_ACTIONS.REMOVE]: 'Remove',
  [TASK_ACTIONS.RENAME]: 'Rename',
};

export const TASK_ACTIONS_LIST = {
  [TASK_STATES.ACTIVE]: [
    TASK_ACTIONS.PAUSE,
    TASK_ACTIONS.DONE,
  ],
  [TASK_STATES.PENDNING]: [
    TASK_ACTIONS.MORE,
    TASK_ACTIONS.PLAY,
  ],
  [TASK_STATES.FINISHED]: [
    TASK_ACTIONS.RESTART,
    TASK_ACTIONS.REMOVE,
  ],
};

export const TASK_ACTIONS_MORE_OPTIONS = {
  [TASK_STATES.PENDNING]: [
    TASK_ACTIONS.RENAME,
    TASK_ACTIONS.REMOVE,
  ],
};
