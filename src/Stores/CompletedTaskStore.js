import EventEmitter from 'events';
import dispatcher from '../Utils/Dispatcher';
import {ACTION, BEACON} from '../TaskActions/types';
import {TASK_STATES} from '../Utils/Constants';
import Util from '../Utils';

class CompletedTaskStore extends EventEmitter {
    constructor() {
        super();
        this.tasks = [];

        // check if there is already a state in the localstorage
        if (localStorage.completedTasks !== undefined) {
            this.tasks = JSON.parse(localStorage.completedTasks);
        } else {
            localStorage.completedTasks = JSON.stringify([]);
        }
    }

    getAll() {
        return this.tasks;
    }

    handleActions(action) {
        let sendBeacon = false;
        let isItMyTask = action.data.status === TASK_STATES.FINISHED;
        switch (action.type) {
            case ACTION.COMPLETE:
                this.tasks.push({...action.data, status: TASK_STATES.FINISHED});
                sendBeacon = true;
                break;
            case ACTION.RESET:
            case ACTION.TRASH:
                if (!isItMyTask) break;
                this.tasks = Util.updateCollection(this.tasks, action.data);
                sendBeacon = true;
                break;
            default:
                break;
        }

        // emit beacon if a change has taken place
        if (sendBeacon) this.emit(BEACON.COMPLETE);

        //save new data to localstorage
        localStorage.completedTasks = JSON.stringify(this.tasks);
    }
}

const completedTaskStore = new CompletedTaskStore();
completedTaskStore.dispatchToken = dispatcher.register(
    completedTaskStore.handleActions.bind(completedTaskStore)
);

export default completedTaskStore;
