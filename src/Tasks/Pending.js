import React from 'react';

import PendingTaskStore from '../Stores/PendingTaskStore';
import {BEACON} from '../TaskActions/types';

import Tasks from './index';
import Util from '../Utils';
import {TASK_STATES} from '../Utils/Constants';
import * as TaskActions from '../TaskActions';

class PendingTasks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // PENDING and PAUSED tasks reside in the same pool
            tasks: PendingTaskStore.getTasks(),
            editModeActive: PendingTaskStore.getEditMode(),
            stacked: PendingTaskStore.getStacked(),
        };
    }

    updateEvent = () => {
        this.setState({
            tasks: PendingTaskStore.getTasks(),
            editModeActive: PendingTaskStore.getEditMode(),
            stacked: PendingTaskStore.getStacked(),
        });
    };
    editModeEvent = () => {
        // show message
        Util.Notificacion('Already a task in edit mode', 'exclamation-circle');
    };

    componentDidMount() {
        // listen to collection update
        PendingTaskStore.on(BEACON.PENDING, this.updateEvent);
    }

    componentWillUnmount() {
        PendingTaskStore.removeListener(BEACON.PENDING, this.updateEvent);
    }

    render() {
        const {tasks, stacked} = this.state;
        return tasks && tasks.length ? ( // continue if count(tasks) > 0
            <React.Fragment>
                {/* paused tasks */}
                <Tasks tasks={tasks.filter(v => v.isPaused)} />
                {/* pending tasks */}
                <Tasks
                    header="Pending"
                    subHeader={tasks.length > 3 ? tasks.length : null}
                    tasks={tasks.filter(v => !v.isPaused)}
                    stacked={stacked}
                    menu={[
                        Util.menuItemDeleteAll({
                            status: TASK_STATES.PENDING,
                            hidden: tasks.length < 2,
                            action: () => TaskActions.sendAllToTrashTask(tasks),
                        }),
                        Util.menuItemCollapse({
                            stacked: stacked,
                            hidden: tasks.length < 2,
                            action: () =>
                                TaskActions.ToggleCollapse(TASK_STATES.PENDING),
                        }),
                    ]}
                />
            </React.Fragment>
        ) : null;
    }
}

export default PendingTasks;
