import React from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import TaskBox from './TaskBox';
import Tasks from './Tasks';

import Pending from './Tasks/Pending';
import Completed from './Tasks/Completed';
import Trash from './Tasks/Trash';
import Active from './Tasks/Active';
import Paused from './Tasks/Paused';
import * as TaskActions from './TaskActions';

import Util from './Utils';
import EmptyState from './EmptyStates';
import {
    TASKS_PARAMS,
    TASK_STATES,
    TASK_ACTIONS_ICONS as ICON,
    TASK_ACTIONS as ACTIONS,
} from './Utils/Constants';

import {Icon, Row, Col} from 'antd';
import './App.css';

import {Beep1} from './Assets/Sounds/Beep';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timers: this.props.timers,
            pending: this.props.pending,
            active: this.props.active,
            finished: this.props.finished,
            editModeActive: this.props.editModeActive,
            stacked: {
                [TASK_STATES.FINISHED]: true,
                [TASK_STATES.PENDING]: false,
            },
            lastActivationTime: Date.now(), // timestamp of the last task activation
        };
    }


    _action = ({taskId, actionType, data}) => {
        this[actionType](taskId, data || {});
    };

    createTask = task => {
        // add new task in to the pending list
        const _task = {
            id: Math.floor(Date.now()),
            ...task, // { title, time : {total:(miliseconds), h:(hours), m:(minutes)} }
            isPaused: false,
            startTime: 0,
            elapsedTime: 0,
        };
        TaskActions.createTask(_task);
    };

    play = taskId => {
        // wait few 1sec before activating a new task
        if (Date.now() - this.state.lastActivationTime < 1000) return;

        // check if acive task are under the max limit
        if (this.state.active.length >= TASKS_PARAMS.ACTIVE.MAX) {
            // show message
            Util.Notificacion(
                "You've reach the maximim limit of active tasks",
                ICON[ACTIONS.PLAY]
            );
            return;
        }

        const currItem = Util.FindItem(taskId, this.state);
        const updatedTask = {
            ...currItem,
            status: TASK_STATES.ACTIVE,
            isPaused: false,
            startTime: currItem.isPaused
                ? Date.now() - currItem.elapsedTime
                : Date.now(),
            elapsedTime:
                currItem.status === TASK_STATES.FINISHED
                    ? 0
                    : currItem.elapsedTime, // if restart -> 0
        };

        // move task from pending -> active
        this.setState(
            {
                pending: update(this.state.pending, {
                    $splice: [[currItem.index, 1]],
                }),
                active: update(this.state.active, {$push: [updatedTask]}),
                lastActivationTime: Date.now(),
            },
            () => {
                // callback
                this.startTimer(taskId);
            }
        );
    };

    pause = taskId => {
        // clear interval
        this.stopTimer(taskId);

        // update task
        const currItem = Util.GetItemWithIndex(taskId, this.state.active);
        const updatedTask = {
            ...currItem,
            status: TASK_STATES.PENDING,
            isPaused: true,
        };

        // move task from active -> pending
        this.setState({
            pending: update(this.state.pending, {$push: [updatedTask]}),
            active: update(this.state.active, {
                $splice: [[currItem.index, 1]],
            }),
        });

        // show message
        Util.Notificacion(
            currItem.title + ' has been paused',
            ICON[ACTIONS.PAUSE]
        );
    };

    done = taskId => {
        const currItem = Util.FindItem(taskId, this.state);
        if (currItem.status === TASK_STATES.ACTIVE) {
            // clear interval
            this.stopTimer(taskId);
        }

        //const currItem = Util.GetItemWithIndex(taskId, this.state.active);
        const updatedTask = {
            ...currItem,
            status: TASK_STATES.FINISHED,
        };

        // move task from active|pending -> finished
        this.setState({
            [currItem.status]: update(this.state[currItem.status], {
                $splice: [[currItem.index, 1]],
            }),
            finished: update(this.state.finished, {$push: [updatedTask]}),
        });

        // show message
        Util.Notificacion(
            currItem.title + ' has been marked as completed',
            ICON[ACTIONS.DONE]
        );
    };

    restart = taskId => {
        this.play(taskId);
        // const currItem = Util.GetItemWithIndex(taskId, this.state.finished);

        // // move task from finished -> pending
        // this.setState(
        //     {
        //         finished: update(this.state.finished, {
        //             $splice: [[currItem.index, 1]],
        //         }),
        //         pending: update(this.state.pending, {$push: [currItem]}),
        //     },
        //     () => {
        //         this.play(taskId);
        //     }
        // );
    };

    reset = taskId => {
        const currItem = Util.FindItem(taskId, this.state);
        const updatedTask = {
            ...currItem,
            status: TASK_STATES.PENDING,
            isPaused: false,
            startTime: 0,
            elapsedTime: 0,
        };

        // move task from finished -> pending
        if (currItem.status === TASK_STATES.FINISHED) {
            this.setState({
                [TASK_STATES.FINISHED]: update(
                    this.state[TASK_STATES.FINISHED],
                    {
                        $splice: [[currItem.index, 1]],
                    }
                ),
                pending: update(this.state.pending, {$push: [updatedTask]}),
            });
            return;
        }

        // update task if it's already in pending state
        this.setState(state => {
            return {
                pending: update(state.pending, {
                    [currItem.index]: {$set: updatedTask},
                }),
                editModeActive: true,
            };
        });
    };

    remove = taskId => {
        const currItem = Util.FindItem(taskId, this.state);

        // remove task from state[pending|active|finished]
        this.setState({
            [currItem.status]: update(this.state[currItem.status], {
                $splice: [[currItem.index, 1]],
            }),
        });

        // show message
        Util.Notificacion(
            currItem.title + ' has been removed',
            ICON[ACTIONS.REMOVE]
        );
    };
    removeAll = status => {
        // remove all tasks
        this.setState({
            [status]: [],
            // diable editMode if pending tasks are removed
            editModeActive:
                status === TASK_STATES.PENDING
                    ? false
                    : this.state.editModeActive,
        });

        // show message
        Util.Notificacion(
            'All ' + status + ' tasks have been removed',
            ICON[ACTIONS.REMOVE]
        );
    };

    edit = taskId => {
        // check if active mode is active
        if (this.state.editModeActive) {
            // show notification
            Util.Notificacion(
                'Already a task in edit mode',
                'exclamation-circle'
            );
            return;
        }

        // get task object from id
        const currItem = Util.GetItemWithIndex(taskId, this.state.pending);

        this.setState(state => {
            return {
                pending: update(state.pending, {
                    [currItem.index]: {
                        status: {$set: TASK_STATES.EDITING},
                    },
                }),
                editModeActive: true,
            };
        });
    };

    saveEdit = (taskId, data) => {
        // get task object from id
        const currItem = Util.GetItemWithIndex(taskId, this.state.pending);

        // check is time is higher than the time elapsed
        if (data.time.total < currItem.elapsedTime) {
            // show notification
            Util.Notificacion(
                'New Time should be higher or equal than time elapsed',
                'exclamation-circle'
            );
            return;
        }

        this.setState(state => {
            return {
                pending: update(state.pending, {
                    [currItem.index]: {
                        status: {$set: TASK_STATES.PENDING},
                        title: {$set: data.title},
                        time: {$set: data.time},
                    },
                }),
                editModeActive: false,
            };
        });
    };

    cancleEdit = taskId => {
        // get task object from id
        const currItem = Util.GetItemWithIndex(taskId, this.state.pending);

        this.setState(state => {
            return {
                pending: update(state.pending, {
                    [currItem.index]: {
                        status: {$set: TASK_STATES.PENDING},
                    },
                }),
                editModeActive: false,
            };
        });
    };

    startTimer = taskId => {
        const interval = setInterval(() => {
            const currItem = Util.GetItemWithIndex(taskId, this.state.active);

            // clear timer if target is reached
            if (currItem.elapsedTime >= currItem.time.total) {
                // play sound
                Beep1.play();

                return this.done(taskId);
            }

            // update elapsed time
            this.setState(state => {
                return {
                    active: update(state.active, {
                        [currItem.index]: {
                            elapsedTime: {
                                $set: Date.now() - currItem.startTime,
                            },
                        },
                    }),
                };
            });
        }, 1000);

        // push interval -> state.timers[]
        this.setState(state => {
            return {
                timers: [...state.timers, {id: taskId, interval: interval}],
            };
        });
    };

    stopTimer = taskId => {
        const timer = Util.GetItemWithIndex(taskId, this.state.timers);
        clearInterval(timer.interval);

        this.setState({
            timers: update(this.state.timers, {
                $splice: [[timer.index, 1]],
            }),
        });
    };

    toggleStack = (taskState, value) => {
        // update stack state
        this.setState(state => {
            const status =
                value === undefined ? !state.stacked[taskState] : value;
            return {
                stacked: update(state.stacked, {
                    [taskState]: {$set: status},
                }),
            };
        });
    };

    render() {
        const {active, pending, finished, stacked} = this.state;
        const areThereAnyTasks = !(
            active.length ||
            finished.length ||
            pending.length
        );
        const mobile = Util.mobileCheck();

        // tasks header menu parameters
        const deleteAll = taskState => ({
            confirm: {
                value: true,
                title: 'Are you sure delete all ' + taskState + ' tasks?',
            },
            hidden: this.state[taskState].length < 2,
            icon: ICON[ACTIONS.REMOVE],
            // hide tooltip if mobile
            tooltip: mobile ? null : 'Delete All',
            // if device is mobile, show label
            value: mobile ? 'Delete All' : null,
            action: () => this.removeAll(taskState),
        });

        const collapse = taskState => ({
            hidden: this.state[taskState].length < 2,
            icon: this.state.stacked[taskState] ? 'folder-open' : 'folder',
            tooltip: mobile // hide tooltip if mobile
                ? null
                : this.state.stacked[taskState]
                ? 'Show all'
                : 'Collapse',
            value: mobile // if device is mobile, show label
                ? this.state.stacked[taskState]
                    ? 'Show all'
                    : 'Collapse'
                : null,
            action: () => this.toggleStack(taskState),
        });

        return (
            <div className="App">
                <Row className="main-menu">
                    <Col span={12}>
                        <img alt="Quick Scheduler" src="logo.png" width={120} />
                    </Col>
                    <Col className="right" span={12}>
                        <Icon type="menu" />
                    </Col>
                </Row>
                <TaskBox save={this.createTask} />
                <div className="task-wrapper">
                    <Active />
                    <Paused />
                    <Pending />
                    <Completed />
                    <Trash />
                </div>
                {/* <div className="task-wrapper">
                    <EmptyState.TasksPanel visible={areThereAnyTasks}>
                        <span>No tasks at the moment</span>
                    </EmptyState.TasksPanel>
                    <Tasks
                        header="Active Tasks"
                        tasks={active}
                        action={this._action}
                    />
                    <Tasks
                        header="Pending"
                        subHeader={pending.length > 3 ? pending.length : null}
                        menu={
                            pending.length > 2
                                ? [deleteAll(TASK_STATES.PENDING)]
                                : []
                        }
                        stacked={stacked[TASK_STATES.PENDING]}
                        tasks={pending}
                        action={this._action}
                    />
                    <Tasks
                        header="Completed"
                        subHeader={finished.length}
                        menu={[
                            deleteAll(TASK_STATES.FINISHED),
                            collapse(TASK_STATES.FINISHED),
                        ]}
                        stacked={stacked[TASK_STATES.FINISHED]}
                        tasks={finished}
                        action={this._action}
                    />
                </div> */}
            </div>
        );
    }
}


App.defaultProps = {
    timers: [],
    active: [],
    pending: [],
    finished: [],
    editModeActive: false,
};

App.propTypes = {
    timers: PropTypes.array,
    active: PropTypes.array,
    pending: PropTypes.array,
    finished: PropTypes.array,
    editModeActive: PropTypes.bool,
};

export default App;
