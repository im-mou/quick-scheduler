export const TASKS_PARAMS = {
    ACTIVE: {
        MAX: 4,
    },
    PENDING: {
        MAX: 4,
    },
    FINISHED: {
        MAX: 4,
    },
};
export const TASK_STATES = {
    ACTIVE: 'active',
    PENDING: 'pending',
    FINISHED: 'finished',
    EDITING: 'edit',
    TRASH: 'trash',
    NEW: 'new',
    PAUSED: 'paused',
    DONE: 'done',
};

export const TASK_ACTIONS = {
    PLAY: 'playTask',
    RESUME: 'resumeTask',
    MORE: 'more',
    PAUSE: 'pauseTask',
    DONE: 'completeTask',
    NEW: 'createTask',
    CREATE: 'createTask',
    EDIT: 'editTask',
    SAVE: 'saveEditTask',
    CANCLE: 'cancleEditTask',
    TRASH: 'sendToTrashTask',
    DELETE: 'deleteTask',
    RESET: 'resetTask',
};

export const TASK_ACTIONS_ICONS = {
    [TASK_ACTIONS.MORE]: 'ellipsis',
    [TASK_ACTIONS.PLAY]: 'play-circle',
    [TASK_ACTIONS.RESUME]: 'caret-right',
    [TASK_ACTIONS.PAUSE]: 'pause',
    [TASK_ACTIONS.DONE]: 'check',
    [TASK_ACTIONS.TRASH]: 'delete',
    [TASK_ACTIONS.DELETE]: 'delete',
    [TASK_ACTIONS.NEW]: 'download',
    [TASK_ACTIONS.CREATE]: 'download',
    [TASK_ACTIONS.EDIT]: 'highlight',
    [TASK_ACTIONS.SAVE]: 'check',
    [TASK_ACTIONS.CANCLE]: 'close-circle',
    [TASK_ACTIONS.RESET]: 'undo',
};

export const TASK_ACTIONS_DESC = {
    [TASK_ACTIONS.MORE]: 'Options',
    [TASK_ACTIONS.PLAY]: 'Start',
    [TASK_ACTIONS.RESUME]: 'Resume',
    [TASK_ACTIONS.PAUSE]: 'Pause',
    [TASK_ACTIONS.DONE]: 'Mark as completed',
    [TASK_ACTIONS.TRASH]: 'Move to trash',
    [TASK_ACTIONS.DELETE]: 'Delete permanently',
    [TASK_ACTIONS.CREATE]: 'Create',
    [TASK_ACTIONS.EDIT]: 'Make changes',
    [TASK_ACTIONS.SAVE]: 'Save changes',
    [TASK_ACTIONS.CANCLE]: 'Discard changes',
    [TASK_ACTIONS.RESET]: 'Reset task',
};

export const TASK_ACTIONS_LIST = {
    [TASK_STATES.ACTIVE]: [TASK_ACTIONS.PAUSE, TASK_ACTIONS.DONE],
    [TASK_STATES.PENDING]: [TASK_ACTIONS.MORE, TASK_ACTIONS.PLAY],
    [TASK_STATES.FINISHED]: [TASK_ACTIONS.RESET, TASK_ACTIONS.TRASH],
    [TASK_STATES.TRASH]: [TASK_ACTIONS.RESET, TASK_ACTIONS.DELETE],
    [TASK_STATES.PAUSED]: [TASK_ACTIONS.MORE, TASK_ACTIONS.RESUME],
    [TASK_STATES.DONE]: [TASK_ACTIONS.RESET, TASK_ACTIONS.DONE],
};

export const TASK_ACTIONS_MORE_OPTIONS = {
    [TASK_STATES.PENDING]: [
        TASK_ACTIONS.EDIT,
        TASK_ACTIONS.DONE,
        TASK_ACTIONS.TRASH,
    ],
    [TASK_STATES.PAUSED]: [
        TASK_ACTIONS.EDIT,
        TASK_ACTIONS.RESET,
        TASK_ACTIONS.DONE,
        TASK_ACTIONS.TRASH,
    ],
};
