import EventEmitter from 'events';
import dispatcher from '../Utils/Dispatcher';
import {ACTION, BEACON} from '../TaskActions/types';
import {TASK_STATES} from '../Utils/Constants';
import Util from '../Utils';

class TrashTaskStore extends EventEmitter {
    constructor() {
        super();
        this.tasks = [];

        // check if there is already a state in the localstorage
        if (localStorage.trashTasks !== undefined) {
            this.tasks = JSON.parse(localStorage.trashTasks);
        } else {
            localStorage.trashTasks = JSON.stringify([]);
        }
    }

    getAll() {
        return this.tasks;
    }

    handleActions(action) {
        let sendBeacon = false;
        let isItMyTask = action.data.status === TASK_STATES.TRASH;
        switch (action.type) {
            case ACTION.TRASH:
                this.tasks.push({
                    ...action.data,
                    status: TASK_STATES.TRASH,
                });

                sendBeacon = true;
                break;

            case ACTION.DELETE:
            case ACTION.RESET:
                if (!isItMyTask) break;
                this.tasks = Util.updateCollection(this.tasks, action.data);
                sendBeacon = true;
                break;
            default:
                break;
        }

        // emit beacon if a change has taken place
        if (sendBeacon) this.emit(BEACON.TRASH);

        //save new data to localstorage
        localStorage.trashTasks = JSON.stringify(this.tasks);
    }
}

const trashTaskStore = new TrashTaskStore();
trashTaskStore.dispatchToken = dispatcher.register(trashTaskStore.handleActions.bind(trashTaskStore));

export default trashTaskStore;