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
        if (localStorage.activeTasks !== undefined) {
            this.tasks = JSON.parse(localStorage.activeTasks);
        } else {
            localStorage.activeTasks = JSON.stringify([]);
        }

        // start timers if refresh with active tasks
        (this.tasks || []).forEach(item => {
            this.timers.push({
                id: item.id,
                interval: this.startTimer(item.id),
            });
        });
    }

    getAll() {
        return this.tasks;
    }

    startTimer = taskId => {
        const currItem = Util.GetItemWithIndex(taskId, this.tasks);
        if (currItem.elapsedTime >= currItem.time.total) {
            this.stopTimer(taskId);
            return;
        }
        const interval = setInterval(() => {
            // update elapsed time
            this.tasks = update(this.tasks, {
                [currItem.index]: {
                    elapsedTime: {
                        $set: Date.now() - currItem.startTime,
                    },
                },
            });
            localStorage.activeTasks = JSON.stringify(this.tasks);
            this.emit(BEACON.TIMER_UPDATE);

            // clear timer if target is reached
            if (currItem.elapsedTime >= currItem.time.total) {
                this.stopTimer(taskId);
                this.emit(BEACON.TIMER_COMPLETE);
            }

        }, 1000);

        return interval;
    };

    stopTimer = taskId => {
        const timer = Util.GetItemWithIndex(taskId, this.timers);
        if(timer) {
            clearInterval(timer.interval);

            this.timers = update(this.timers, {
                $splice: [[timer.index, 1]],
            });
        }
    };

    handleActions(action) {
        let sendBeacon = false;
        let isItMyTask = action.data.status === TASK_STATES.ACTIVE;
        switch (action.type) {
            case ACTION.PLAY:
                const updatedTask = {
                    ...action.data,
                    isPaused: false,
                    status: TASK_STATES.ACTIVE,
                    startTime: action.data.isPaused
                        ? Date.now() - action.data.elapsedTime
                        : Date.now(),
                };
                this.tasks.push(updatedTask);
                this.timers.push({
                    id: action.data.id,
                    interval: this.startTimer(action.data.id),
                });
                sendBeacon = true;
                break;

            case ACTION.PAUSE:
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
        localStorage.activeTasks = JSON.stringify(this.tasks);
    }
}
const activeTaskStore = new ActiveTaskStore();
activeTaskStore.dispatchToken = dispatcher.register(
    activeTaskStore.handleActions.bind(activeTaskStore)
);

export default activeTaskStore;
