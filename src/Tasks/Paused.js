import React from 'react';

import PausedTaskStore from '../Stores/PausedTaskStore';
import {BEACON} from '../TaskActions/types';

import Tasks from './index';
import {TASK_STATES} from '../Utils/Constants';

class Paused extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: PausedTaskStore.getAll(),
        };
    }

    updateEvent = () => {
        this.setState({
            tasks: PausedTaskStore.getAll(),
        });
    };

    componentDidMount() {
        // listen to collection update
        PausedTaskStore.on(BEACON.PAUSED, this.updateEvent);
    }

    componentWillUnmount() {
        PausedTaskStore.removeListener(BEACON.PAUSED, this.updateEvent);
    }

    render() {
        const {tasks} = this.state;

        return (
            <Tasks
                header="Paused"
                status={TASK_STATES.PAUSED}
                // menu={[
                //     deleteAll(TASK_STATES.FINISHED),
                //     collapse(TASK_STATES.FINISHED),
                // ]}
                tasks={tasks}
            />
        );
    }
}

export default Paused;
