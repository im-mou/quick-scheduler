import React from 'react';
import * as TaskActions from './TaskActions';
import EmptyState from './EmptyStates';
import TaskBox from './TaskBox';
import Pending from './Tasks/Pending';
import Completed from './Tasks/Completed';
import Active from './Tasks/Active';
import {BEACON} from './TaskActions/types';
import TrashTaskStore from './Stores/TrashTaskStore';
import MainMenu from './MainMenu';

import './App.css';
import './App-dark.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        let _taskCount = 0;
        // check if there is already a state in the localstorage
        if (localStorage.taskCount !== undefined) {
            _taskCount = JSON.parse(localStorage.taskCount);
        } else {
            localStorage.taskCount = JSON.stringify(0);
        }

        // update state
        this.state = {
            taskCount: _taskCount,
        };
    }

    componentDidMount() {
        // listen to collection update
        TrashTaskStore.on(BEACON.INCREASE_TASKCOUNT, () =>
            this.updateEvent(true)
        );
        TrashTaskStore.on(BEACON.DECREASE_TASKCOUNT, count =>
            this.updateEvent(false, count)
        );
    }

    updateEvent = (cond, count) => {
        const value = cond
            ? this.state.taskCount + 1
            : this.state.taskCount - 1;
        // update count
        this.updateTaskCounter(count || value);
    };

    updateTaskCounter = value => {
        if (value < 0) return;
        this.setState({
            taskCount: value,
        });
        localStorage.taskCount = JSON.stringify(value);
    };

    createTask = task => {
        // dispatch new task
        TaskActions.createTask(task);

        // update count
        this.updateTaskCounter(this.state.taskCount + 1);
    };

    render() {
        return (
            <div className="App">
                <MainMenu />
                <TaskBox save={this.createTask} />
                <div className="task-wrapper">
                    <EmptyState.TasksPanel visible={!this.state.taskCount}>
                        <span>No tasks at the moment</span>
                    </EmptyState.TasksPanel>
                    <Active />
                    <Pending />
                    <Completed />
                </div>
            </div>
        );
    }
}

export default App;
