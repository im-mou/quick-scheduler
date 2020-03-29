import EventEmitter from 'events';
import update from 'immutability-helper';
import dispatcher from '../Utils/Dispatcher';
import {ACTION, BEACON} from '../TaskActions/types';
import {TASK_STATES} from '../Utils/Constants';
import Util from '../Utils';

class ActiveTaskStore extends EventEmitter {
    constructor() {
        super();
        this.tasks = [];
        this.timers = [];

        // check if there is already a state in the localstorage
        if (localStorage.activeStore !== undefined) {
            const store = JSON.parse(localStorage.activeStore);
            this.tasks = store.tasks;
        } else {
            localStorage.activeStore = JSON.stringify({
                tasks: [],
            });
        }

        // start timers if refresh with active tasks
        let _tasks = this.tasks;
        (this.tasks || []).forEach((item, index) => {
            if (item.elapsedTime < item.time.total) {
                if (!item.isPaused) {
                    this.timers.push({
                        id: item.id,
                        interval: this.startTimer(item.id),
                    });
                }
            } else {
                // if the task is completed apply 'DONE' styling
                _tasks[index].status = TASK_STATES.DONE;
            }
        });
        this.tasks = _tasks;
    }

    getAll() {
        return this.tasks;
    }
    getActivetasks() {
        return this.timers.length;
    }

    startTimer = taskId => {
        let currItem = Util.GetItemWithIndex(taskId, this.tasks);

        // clear timer if item is already finished
        if (currItem.elapsedTime >= currItem.time.total) {
            this.stopTimer(taskId);
            return;
        }
        const interval = setInterval(() => {
            // update current item;
            // if we pause and remove an item, the items indices will be rearranged
            // and it will result in a crash.
            // It's not the best way to handle this, might fix it later
            // ToDo: fix intervals mess
            currItem = Util.GetItemWithIndex(taskId, this.tasks);

            // // clear timer if target is reached
            if (currItem.elapsedTime >= currItem.time.total) {
                this.stopTimer(taskId);
                this.emit(BEACON.TIMER_COMPLETE);
                this.tasks = Util.updateCollection(
                    this.tasks,
                    currItem,
                    {status: TASK_STATES.DONE},
                    false // do not sort (default: by id)
                );
            }

            //update elapsed time
            this.tasks = update(this.tasks, {
                [currItem.index]: {
                    // this is the index that I was refering to.
                    elapsedTime: {
                        $set: Date.now() - currItem.startTime,
                    },
                },
            });

            localStorage.activeStore = JSON.stringify({tasks: this.tasks});
            this.emit(BEACON.TIMER_UPDATE);
        }, 1000);

        return interval;
    };

    stopTimer = taskId => {
        const timer = Util.GetItemWithIndex(taskId, this.timers);
        if (timer) {
            clearInterval(timer.interval);

            this.timers = update(this.timers, {
                $splice: [[timer.index, 1]],
            });
        }
    };

    // sort tasks by status
    sortByStatus = () => {
        this.tasks.sort((a, b) =>
            a.status > b.status ? 1 : b.status > a.status ? -1 : 0
        );
    };

    handleActions(action) {
        let sendBeacon = false;
        let isItMyTask =
            action.data.status === TASK_STATES.ACTIVE ||
            action.data.status === TASK_STATES.DONE;
        switch (action.type) {
            case ACTION.PLAY:
                const updatedTask = {
                    ...action.data,
                    isPaused: false,
                    status: TASK_STATES.ACTIVE,
                    // set elapsedtime = 0 if new || update if resume
                    startTime: action.data.isPaused
                        ? Date.now() - action.data.elapsedTime
                        : Date.now(),
                };

                // Update if paused; push if new
                if (action.data.isPaused)
                    this.tasks = Util.updateCollection(
                        this.tasks,
                        action.data,
                        updatedTask,
                        false // do not sort (default: by id)
                    );
                else this.tasks.push(updatedTask);

                // push changes to the store
                this.timers.push({
                    id: action.data.id,
                    interval: this.startTimer(action.data.id),
                });

                // sort items by status
                this.sortByStatus();

                sendBeacon = true;
                break;

            case ACTION.PAUSE:
                if (!isItMyTask) break;

                // remove timer
                this.stopTimer(action.data.id);
                this.tasks = Util.updateCollection(this.tasks, action.data);
                sendBeacon = true;
                break;

            case ACTION.TRASH:
            case ACTION.RESET:
            case ACTION.COMPLETE:
                if (!isItMyTask) break;
                this.stopTimer(action.data.id);
                this.tasks = Util.updateCollection(this.tasks, action.data);
                sendBeacon = true;
                break;
            default:
                break;
        }

        // emit beacon if a change has taken place
        if (sendBeacon) this.emit(BEACON.ACTIVE);

        //save new data to localstorage
        const {tasks} = this;
        localStorage.activeStore = JSON.stringify({tasks});
    }
}
const activeTaskStore = new ActiveTaskStore();
activeTaskStore.dispatchToken = dispatcher.register(
    activeTaskStore.handleActions.bind(activeTaskStore)
);

export default activeTaskStore;
