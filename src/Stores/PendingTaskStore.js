import EventEmitter from 'events';
import dispatcher from '../Utils/Dispatcher';
import {ACTION, BEACON} from '../TaskActions/types';
import {
    TASK_STATES,
    TASKS_PARAMS,
    TASK_ACTIONS_ICONS as ICON,
    TASK_ACTIONS as ACTIONS,
} from '../Utils/Constants';
import Util from '../Utils';
import ActiveTaskStore from './ActiveTaskStore';

class PendingTaskStore extends EventEmitter {
    constructor() {
        super();
        this.tasks = new window.FlyJson();
        this.editmode = false;
        this.stacked = false;

        // check if there is already a state in the localstorage
        if (localStorage.pendingStore !== undefined) {
            const store = JSON.parse(localStorage.pendingStore);
            this.tasks.set(store.tasks);
            this.stacked = store.stacked;
        } else {
            localStorage.pendingStore = JSON.stringify({
                tasks: [],
                stacked: false,
            });
        }
    }

    getTasks() {
        return this.tasks.exec();
    }

    getEditMode() {
        return this.editmode;
    }

    getStacked() {
        return this.stacked;
    }

    handleActions(action) {
        let sendBeacon = false;
        let isItMyTask =
            action.data.status === TASK_STATES.PENDING ||
            action.data.status === TASK_STATES.PAUSED;
        switch (action.type) {
            case ACTION.CREATE:
                // add new task in to the pending list
                this.tasks.insert({
                    id: Math.floor(Date.now()),
                    // action.data = { title, time : {total:(miliseconds), h:(hours), m:(minutes)} }
                    ...action.data,
                    isPaused: false,
                    status: TASK_STATES.PENDING,
                    startTime: 0,
                    elapsedTime: 0,
                });

                sendBeacon = true;
                break;

            case ACTION.RESET:
                const def_data = {
                    isPaused: false,
                    elapsedTime: 0,
                    status: TASK_STATES.PENDING,
                };
                if (isItMyTask) {
                    // reset elapseed time
                    this.tasks.modify('id', action.data.id, def_data);
                } else {
                    this.tasks.insert({
                        ...action.data,
                        ...def_data,
                    });
                }
                sendBeacon = true;
                break;

            case ACTION.EDIT:
                // dont proceed if there is a task in edit mode
                if (this.editmode) {
                    Util.Notificacion(
                        'Already a task in edit mode',
                        'exclamation-circle'
                    );
                    break;
                }

                // change status to TASK_STATES.EDITING
                this.tasks.modify('id', action.data.id, {
                    prevStatus: action.data.status,
                    status: TASK_STATES.EDITING,
                });

                this.editmode = true;
                sendBeacon = true;
                break;

            case ACTION.CANCLE_EDIT:
                // change status to TASK_STATES.PENDING
                this.tasks.modify('id', action.data.id, {
                    prevStatus: null,
                    status: action.data.prevStatus || TASK_STATES.PENDING,
                });

                this.editmode = false;
                sendBeacon = true;
                break;

            case ACTION.SAVE_EDIT:
                // check is time is higher than the time elapsed
                if (action.data.elapsedTime > action.newData.time.total) {
                    // show notification
                    Util.Notificacion(
                        'New Time should be higher or equal than time elapsed',
                        'exclamation-circle'
                    );
                    break;
                }

                // handle save edit
                this.tasks.modify('id', action.data.id, {
                    ...action.newData,
                    prevStatus: null,
                    status: action.data.prevStatus || TASK_STATES.PENDING,
                });

                this.editmode = false;
                sendBeacon = true;
                break;

            case ACTION.PLAY:
                const limit_reached =
                    ActiveTaskStore.getActivetasks() > TASKS_PARAMS.ACTIVE.MAX;
                if (limit_reached) {
                    Util.Notificacion(
                        "You've reach the maximim limit of active tasks",
                        ICON[ACTIONS.PLAY]
                    );
                } else {
                    // remove item from this store
                    this.tasks.delete('id', action.data.id);
                    sendBeacon = true;
                }
                break;

            case ACTION.PAUSE:
                if (!action.data.status === TASK_STATES.ACTIVE) break;

                // update task status -> paused
                this.tasks.insert({
                    ...action.data,
                    isPaused: true,
                    status: TASK_STATES.PAUSED,
                });

                sendBeacon = true;
                break;

            case ACTION.TRASH_ALL:
                if (!action.data === TASK_STATES.PENDING) break;

                // show message
                Util.Notificacion(
                    'All pending tasks moved to trash',
                    ICON[ACTIONS.TRASH]
                );
                this.tasks.clean();
                sendBeacon = true;
                break;

            case ACTION.TOGGLE_COLLAPSE:
                if (action.data !== TASK_STATES.PENDING) break;
                this.stacked = !this.stacked;
                sendBeacon = true;
                break;

            case ACTION.COMPLETE:
            case ACTION.TRASH:
                if (!isItMyTask) break;
                // remove item from this store
                this.tasks.delete('id', action.data.id);
                sendBeacon = true;
                break;

            default:
                break;
        }

        // emit beacon if a change has taken place
        if (sendBeacon) this.emit(BEACON.PENDING);

        //save new data to localstorage
        const {tasks, stacked} = this;
        const _tasks = tasks.orderBy('id').exec();

        // only save if edit mode not enable
        // this is to prevent saving the temporary task with editing state.
        if (!this.editmode) {
            localStorage.pendingStore = JSON.stringify({
                tasks: _tasks,
                stacked,
            });
        }
    }
}

const pendingTaskStore = new PendingTaskStore();
pendingTaskStore.dispatchToken = dispatcher.register(
    pendingTaskStore.handleActions.bind(pendingTaskStore)
);

export default pendingTaskStore;
