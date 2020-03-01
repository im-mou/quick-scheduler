import React, {useState} from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import CreateTask from './CreateTask';
import Tasks from './Tasks';

import Util from './Utils';
import {
    TASK_STATES,
    TASK_ACTIONS_ICONS as ICON,
    TASK_ACTIONS as ACTIONS,
} from './Utils/Constants';

import {Modal, Input, Empty, Icon, Row, Col} from 'antd';
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
            renameModal: this.props.renameModal,
            renameTask: this.props.renameTask,
        };
    }

    _action = ({taskId, actionType}) => {
        this[actionType](taskId);
    };

    createTask = task => {
        // add new task in to the pending list
        const _task = {
            id: Math.floor(Date.now()),
            ...task, // { title, time : {total:(miliseconds), h:(hours), m:(minutes)} }
            status: TASK_STATES.PENDNING,
            isPaused: false,
            startTime: 0,
            elapsedTime: 0,
            editMode: true,
        };
        this.setState(state => {
            const updatedTasks = [...state.pending, _task];
            return {pending: updatedTasks};
        });
    };

    play = taskId => {
        const currItem = Util.GetItemWithIndex(taskId, this.state.pending);

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
            status: TASK_STATES.PENDNING,
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
        // clear interval
        this.stopTimer(taskId);

        const currItem = Util.GetItemWithIndex(taskId, this.state.active);
        const updatedTask = {
            ...currItem,
            status: TASK_STATES.FINISHED,
        };

        // move task from active -> finished
        this.setState({
            active: update(this.state.active, {
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
        const currItem = Util.GetItemWithIndex(taskId, this.state.finished);

        // move task from finished -> pending
        this.setState(
            {
                finished: update(this.state.finished, {
                    $splice: [[currItem.index, 1]],
                }),
                pending: update(this.state.pending, {$push: [currItem]}),
            },
            () => {
                this.play(taskId);
            }
        );
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

    rename = param => {
        // show modal
        if (typeof param === 'number') {
            this.setState({
                renameModal: true,
                renameTask: Util.GetItemWithIndex(param, this.state.pending),
            });
        }
        // hide modal
        if (typeof param === 'boolean' && !param) {
            this.setState({renameModal: false, renameTask: {}});
        }
    };

    updateName = newTitle => {
        // hide modal and update task name
        const updatedtask = {...this.state.renameTask, title: newTitle};
        this.setState({
            pending: update(this.state.pending, {
                [this.state.renameTask.index]: {$set: updatedtask},
            }),
            renameModal: false,
            renameTask: {},
        });
    };

    edit = id => {
        // hide modal and update task name
        console.log('edit has been invocked')
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

    render() {
        return (
            <div className="App">
                {this.state.renameModal ? (
                    <RenameModal
                        tasks={this.state.pending}
                        visible={this.state.renameModal}
                        task={this.state.renameTask}
                        save={this.updateName}
                        hide={this.rename}
                    />
                ) : (
                    ''
                )}
                <Row style={{marginTop: 40, marginBottom: 25}}>
                    <Col span={12}>
                        <Logo />
                    </Col>
                    <Col className="right" span={12}>
                        <Icon type="menu" />
                    </Col>
                </Row>
                <CreateTask createTask={this.createTask} />
                <div className="task-wrapper">
                    <EmptyState {...this.state} />
                    <Tasks
                        header="Active Tasks"
                        tasks={this.state.active}
                        status={TASK_STATES.ACTIVE}
                        action={this._action}
                    />
                    <Tasks
                        header="Pending"
                        tasks={this.state.pending}
                        status={TASK_STATES.PENDNING}
                        action={this._action}
                    />
                    <Tasks
                        header="Completed"
                        tasks={this.state.finished}
                        status={TASK_STATES.FINISHED}
                        action={this._action}
                    />
                </div>
            </div>
        );
    }
}

App.defaultProps = {
    timers: [],
    active: [],
    pending: [],
    finished: [],
    renameModal: false,
    renameTask: {},
};

App.propTypes = {
    timers: PropTypes.array,
    active: PropTypes.array,
    pending: PropTypes.array,
    finished: PropTypes.array,
    renameModal: PropTypes.bool,
    renameTask: PropTypes.object,
};

export default App;

// Todo: Create separate file for this method
const RenameModal = props => {
    const [title, setTitle] = useState(props.task.title);
    const handleInputChange = function(e) {
        setTitle(e.currentTarget.value);
    };

    // return if no task is selected for rename
    if (props.task === {}) return;

    return (
        <Modal
            title={'Rename task: ' + props.task.title}
            centered
            visible={props.visible}
            onOk={() => props.save(title)}
            onCancel={() => props.hide(false)} // hide modal
        >
            <p>
                <Input
                    placeholder="Task title..."
                    onChange={handleInputChange}
                    value={title}
                />
            </p>
        </Modal>
    );
};

// Todo: Create separate file for this method
const EmptyState = props => {
    if (
        !props.pending.length &&
        !props.active.length &&
        !props.finished.length
    ) {
        return (
            <Empty
                style={{marginTop: 130}}
                className="noselect"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span>No tasks at the moment</span>}
            />
        );
    } else {
        return null;
    }
};

// Todo: Create separate file for this method
const Logo = () => {
    return (
        // <div className="logo">
        <img alt="Quick Scheduler" src="logo.png" width={120} />
        // </div>
    );
};
