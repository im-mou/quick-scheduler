import EventEmitter from 'events';
import dispatcher from '../Utils/Dispatcher';
import {ACTION, BEACON} from '../TaskActions/types';
import {
    TASK_STATES,
    TASK_ACTIONS_ICONS as ICON,
    TASK_ACTIONS as ACTIONS,
} from '../Utils/Constants';
import Util from '../Utils';

class TrashTaskStore extends EventEmitter {
    constructor() {
        super();
        this.tasks = new window.FlyJson();
        this.stacked = false;

        // check if there is already a state in the localstorage
        if (localStorage.trashStore !== undefined) {
            const store = JSON.parse(localStorage.trashStore);
            this.tasks.set(store.tasks);
            this.stacked = store.stacked;
        } else {
            localStorage.trashStore = JSON.stringify({
                tasks: [],
                stacked: false,
            });
        }
    }

    getTasks() {
        return this.tasks.exec();
    }

    getStacked() {
        return this.stacked;
    }

    handleActions(action) {
        let sendBeacon = false;
        let isItMyTask = action.data.status === TASK_STATES.TRASH;
        switch (action.type) {
            case ACTION.TRASH:
                // show message
                Util.Notificacion(
                    // action.data.title + ' has been moved to trash',
                    'kobe!!',
                    'crown'
                );
                this.tasks.insert({
                    ...action.data,
                    status: TASK_STATES.TRASH,
                });

                // send beacon to app to decrease task count
                this.emit(BEACON.DECREASE_TASKCOUNT);

                sendBeacon = true;
                break;

            case ACTION.TRASH_ALL:

                // add tasks into the trash
                action.data.foreach(task => {
                    this.tasks.insert({
                        ...task,
                        status: TASK_STATES.TRASH,
                    });
                });
                // emit tasks count to decrease total task count
                this.emit(BEACON.DECREASE_TASKCOUNT, action.data.length);

                sendBeacon = true;
                break;

            case ACTION.DELETE_ALL:
                if (!action.data === TASK_STATES.TRASH) break;

                // show message
                Util.Notificacion(
                    'Trash has been emptied',
                    ICON[ACTIONS.TRASH]
                );
                this.tasks.clean();
                sendBeacon = true;
                break;

            case ACTION.DELETE:
                if (!isItMyTask) break;
                this.tasks.delete('id', action.data.id);
                sendBeacon = true;
                break;

            case ACTION.RESET:
                if (!isItMyTask) break;
                // send beacon to app to increase task count
                this.emit(BEACON.INCREASE_TASKCOUNT);
                this.tasks.delete('id', action.data.id);
                sendBeacon = true;
                break;

            case ACTION.TOGGLE_COLLAPSE:
                if (action.data !== TASK_STATES.TRASH) break;
                this.stacked = !this.stacked;
                sendBeacon = true;
                break;

            default:
                break;
        }

        // emit beacon if a change has taken place
        if (sendBeacon) this.emit(BEACON.TRASH);

        //save new data to localstorage
        const {tasks, stacked} = this;
        const _tasks = tasks.exec();
        localStorage.trashStore = JSON.stringify({tasks: _tasks, stacked});
    }
}

const trashTaskStore = new TrashTaskStore();
trashTaskStore.dispatchToken = dispatcher.register(
    trashTaskStore.handleActions.bind(trashTaskStore)
);

export default trashTaskStore;
