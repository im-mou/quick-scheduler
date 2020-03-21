import EventEmitter from 'events';
import dispatcher from '../Utils/Dispatcher';
import {ACTION, BEACON} from '../TaskActions/types';
import {TASK_STATES} from '../Utils/Constants';
import Util from '../Utils';

class PausedTaskStore extends EventEmitter {
    constructor() {
        super();
        this.tasks = [];

        // check if there is already a state in the localstorage
        if (localStorage.pausedTasks !== undefined) {
            this.tasks = JSON.parse(localStorage.pausedTasks);
        } else {
            localStorage.pausedTasks = JSON.stringify([]);
        }
    }

    getAll() {
        return this.tasks;
    }

    handleActions(action) {
        let sendBeacon = false;
        let isItMyTask = action.data.status === TASK_STATES.PAUSED;
        switch (action.type) {
            case ACTION.PAUSE:
                const updatedTask = {
                    ...action.data,
                    isPaused: true,
                    status:TASK_STATES.PAUSED,
                };
                this.tasks.push(updatedTask);
                sendBeacon = true;
                break;

            case ACTION.PLAY:
            case ACTION.TRASH:
            case ACTION.COMPLETE:
            case ACTION.RESET:
                if (!isItMyTask) break;
                this.tasks = Util.updateCollection(this.tasks, action.data);
                sendBeacon = true;
                break;
            default:
                break;
        }

        // emit beacon if a change has taken place
        if (sendBeacon) this.emit(BEACON.PAUSED);

        //save new data to localstorage
        localStorage.pausedTasks = JSON.stringify(this.tasks);
    }
}

const pausedTaskStore = new PausedTaskStore();
pausedTaskStore.dispatchToken = dispatcher.register(
    pausedTaskStore.handleActions.bind(pausedTaskStore)
);

export default pausedTaskStore;
