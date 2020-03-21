import React from 'react';

import CompletedTaskStore from '../Stores/CompletedTaskStore';
import {BEACON} from '../TaskActions/types';

import Tasks from './index';
import {TASK_STATES} from '../Utils/Constants';

class CompletedTasks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: CompletedTaskStore.getAll(),
            stacked: false,
        };
    }

    updateEvent = () => {
        this.setState({
            tasks: CompletedTaskStore.getAll(),
        });
    };

    componentDidMount() {
        // listen to collection update
        CompletedTaskStore.on(BEACON.COMPLETE, this.updateEvent);
    }

    componentWillUnmount() {
        CompletedTaskStore.removeListener(BEACON.COMPLETE, this.updateEvent);
    }

    render() {
        const {tasks, stacked} = this.state;

        return (
            <Tasks
                header="Completed"
                subHeader={tasks.length}
                status={TASK_STATES.FINISHED}
                // menu={[
                //     deleteAll(TASK_STATES.FINISHED),
                //     collapse(TASK_STATES.FINISHED),
                // ]}
                stacked={stacked}
                tasks={tasks}
            />
        );
    }
}

export default CompletedTasks;
