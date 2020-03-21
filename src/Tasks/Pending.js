import React from 'react';

import PendingTaskStore from '../Stores/PendingTaskStore';
import {BEACON} from '../TaskActions/types';

import Tasks from './index';
import Util from '../Utils';
import {TASK_STATES} from '../Utils/Constants';

class PendingTasks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: PendingTaskStore.getAll(),
            editModeActive: PendingTaskStore.getEditMode(),
        };
    }

    updateEvent = () => {
        this.setState({
            tasks: PendingTaskStore.getAll(),
            editModeActive: PendingTaskStore.getEditMode(),
        });
    };
    editModeEvent = () => {
        // show message
        Util.Notificacion('Already a task in edit mode', 'exclamation-circle');
    };

    componentDidMount() {
        // listen to collection update
        PendingTaskStore.on(BEACON.PENDING, this.updateEvent);
        // listen to editmode
        PendingTaskStore.on(BEACON.EDIT_MODE_ACTIVE, this.editModeEvent);
    }

    componentWillUnmount() {
        console.log('destoryed');
        PendingTaskStore.removeListener(BEACON.PENDING, this.updateEvent);
        PendingTaskStore.removeListener(
            BEACON.EDIT_MODE_ACTIVE,
            this.editModeEvent
        );
    }

    render() {
        const {tasks} = this.state;

        return (
            <Tasks
                header="Pending"
                subHeader={tasks.length > 3 ? tasks.length : null}
                status={TASK_STATES.PENDING}
                // menu={tasks.length > 2 ? [deleteAll(TASK_STATES.PENDING)] : []}
                tasks={tasks}
            />
        );
    }
}

export default PendingTasks;
