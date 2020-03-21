import EventEmitter from 'events';
import dispatcher from '../Utils/Dispatcher';
import {ACTION, BEACON} from '../TaskActions/types';
import {TASK_STATES} from '../Utils/Constants';
import Util from '../Utils';

class PendingTaskStore extends EventEmitter {
    constructor() {
        super();
        this.tasks = [];
        this.editmode = false;

        if (localStorage.pendingTasks !== undefined) {
            this.tasks = JSON.parse(localStorage.pendingTasks);
        } else {
            localStorage.pendingTasks = JSON.stringify([]);
        }
    }

    getAll() {
        return this.tasks;
    }

    getEditMode() {
        return this.editmode;
    }

    handleActions(action) {
        let sendBeacon = false;
        let isItMyTask = action.data.status === TASK_STATES.PENDING;
        switch (action.type) {
            case ACTION.CREATE:
                this.tasks.push({
                    ...action.data,
                    status: TASK_STATES.PENDING,
                });

                sendBeacon = true;
                break;

            case ACTION.RESET:
                // reset elapseed time
                this.tasks = Util.updateCollection(this.tasks, action.data, {
                    elapsedTime: 0,
                });
                sendBeacon = true;
                break;

            case ACTION.EDIT:
                // dont proceed if there is a task in edit mode
                if (this.editmode) {
                    this.emit(BEACON.EDIT_MODE_ACTIVE);
                } else {
                    // change status to TASK_STATES.EDITING
                    this.tasks = Util.updateCollection(
                        this.tasks,
                        action.data,
                        {
                            status: TASK_STATES.EDITING,
                        }
                    );
                    this.editmode = true;
                    sendBeacon = true;
                }
                break;

            case ACTION.CANCLE_EDIT:
                // change status to TASK_STATES.PENDING
                this.tasks = Util.updateCollection(this.tasks, action.data, {
                    status: TASK_STATES.PENDING,
                });
                this.editmode = false;
                sendBeacon = true;
                break;

            case ACTION.SAVE_EDIT:
                // handle save edit
                this.tasks = Util.updateCollection(this.tasks, action.data, {
                    ...action.newData,
                    status: TASK_STATES.PENDING,
                });
                this.editmode = false;
                sendBeacon = true;
                break;

            case ACTION.PLAY:
            case ACTION.COMPLETE:
            case ACTION.TRASH:
                if (!isItMyTask) break;
                // remove item from this store
                this.tasks = Util.updateCollection(this.tasks, action.data);
                sendBeacon = true;
                break;

            default:
                break;
        }

        // emit beacon if a change has taken place
        if (sendBeacon) this.emit(BEACON.PENDING);

        // only save if edit mode not enable
        // this is to prevent saving the temporary task with editing state.
        if (!this.editmode) {
            //save new data to localstorage
            localStorage.pendingTasks = JSON.stringify(this.tasks);
        }
    }
}

const pendingTaskStore = new PendingTaskStore();
pendingTaskStore.dispatchToken = dispatcher.register(
    pendingTaskStore.handleActions.bind(pendingTaskStore)
);

export default pendingTaskStore;
