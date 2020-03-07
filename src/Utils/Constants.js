export const TASK_STATES = {
    ACTIVE: 'active',
    PENDING: 'pending',
    FINISHED: 'finished',
    EDITING: 'edit',
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
    CREATE: 'create',
    EDIT: 'edit',
    SAVE: 'saveEdit',
    CANCLE: 'cancleEdit',
};

export const TASK_ACTIONS_ICONS = {
    [TASK_ACTIONS.MORE]: 'ellipsis',
    [TASK_ACTIONS.PLAY]: 'play-circle',
    [TASK_ACTIONS.PAUSE]: 'pause',
    [TASK_ACTIONS.DONE]: 'check',
    [TASK_ACTIONS.RESTART]: 'undo',
    [TASK_ACTIONS.REMOVE]: 'delete',
    [TASK_ACTIONS.NEW]: 'download',
    [TASK_ACTIONS.CREATE]: 'download',
    [TASK_ACTIONS.EDIT]: 'highlight',
    [TASK_ACTIONS.SAVE]: 'check',
    [TASK_ACTIONS.CANCLE]: 'close-circle',
};

export const TASK_ACTIONS_DESC = {
    [TASK_ACTIONS.MORE]: 'Options',
    [TASK_ACTIONS.PLAY]: 'Start',
    [TASK_ACTIONS.PAUSE]: 'Pause',
    [TASK_ACTIONS.DONE]: 'Mark as completed',
    [TASK_ACTIONS.RESTART]: 'Restart',
    [TASK_ACTIONS.REMOVE]: 'Remove',
    [TASK_ACTIONS.RENAME]: 'Rename',
    [TASK_ACTIONS.CREATE]: 'Create',
    [TASK_ACTIONS.EDIT]: 'Edit',
    [TASK_ACTIONS.SAVE]: 'Save changes',
    [TASK_ACTIONS.CANCLE]: 'Discard changes',
};

export const TASK_ACTIONS_LIST = {
    [TASK_STATES.ACTIVE]: [TASK_ACTIONS.PAUSE, TASK_ACTIONS.DONE],
    [TASK_STATES.PENDING]: [TASK_ACTIONS.MORE, TASK_ACTIONS.EDIT, TASK_ACTIONS.PLAY],
    [TASK_STATES.FINISHED]: [TASK_ACTIONS.RESTART, TASK_ACTIONS.REMOVE],
};

export const TASK_ACTIONS_MORE_OPTIONS = {
    [TASK_STATES.PENDING]: [
        TASK_ACTIONS.REMOVE,
    ],
};
