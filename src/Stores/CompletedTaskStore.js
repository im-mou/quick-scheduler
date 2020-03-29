import EventEmitter from 'events';
import dispatcher from '../Utils/Dispatcher';
import {ACTION, BEACON} from '../TaskActions/types';
import {
    TASK_STATES,
    TASK_ACTIONS_ICONS as ICON,
    TASK_ACTIONS as ACTIONS,
} from '../Utils/Constants';
import Util from '../Utils';

class CompletedTaskStore extends EventEmitter {
    constructor() {
        super();
        this.tasks = [];
        this.stacked = false;

        // check if there is already a state in the localstorage
        if (localStorage.completedStore !== undefined) {
            const store = JSON.parse(localStorage.completedStore);
            this.tasks = store.tasks;
            this.stacked = store.stacked;
        } else {
            localStorage.completedStore = JSON.stringify({
                tasks: [],
                stacked: false,
            });
        }
    }

    getTasks() {
        return this.tasks;
    }

    getStacked() {
        return this.stacked;
    }

    handleActions(action) {
        let sendBeacon = false;
        let isItMyTask = action.data.status === TASK_STATES.FINISHED;
        switch (action.type) {
            case ACTION.COMPLETE:
                // show message
                Util.Notificacion(
                    action.data.title + ' has been marked as completed',
                    ICON[ACTIONS.DONE]
                );
                this.tasks.push({...action.data, status: TASK_STATES.FINISHED});
                sendBeacon = true;
                break;
            case ACTION.TOGGLE_COLLAPSE:
                if (action.data !== TASK_STATES.FINISHED) break;
                this.stacked = !this.stacked;
                sendBeacon = true;
                break;
            case ACTION.TRASH_ALL:
                if (action.data[0].status !== TASK_STATES.FINISHED) break;

                // show message
                Util.Notificacion(
                    'All completed tasks moved to trash',
                    ICON[ACTIONS.TRASH]
                );
                this.tasks = [];
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
        const {tasks, stacked} = this;
        localStorage.completedStore = JSON.stringify({tasks, stacked});
    }
}

const completedTaskStore = new CompletedTaskStore();
completedTaskStore.dispatchToken = dispatcher.register(
    completedTaskStore.handleActions.bind(completedTaskStore)
);

export default completedTaskStore;
