import React from 'react';
import ActiveTaskStore from '../Stores/ActiveTaskStore';
import {BEACON} from '../TaskActions/types';
import Tasks from './index';
import {Beep1} from '../Assets/Sounds/Beep';

class Active extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: ActiveTaskStore.getAll(),
        };
    }

    updateEvent = () => {
        this.setState({
            tasks: ActiveTaskStore.getAll(),
        });
    };
    completeEvent = () => {
        // play sound
        Beep1.play();
    };

    componentDidMount() {
        // listen to collection update
        ActiveTaskStore.on(BEACON.ACTIVE, this.updateEvent);
        ActiveTaskStore.on(BEACON.TIMER_UPDATE, this.updateEvent);
        ActiveTaskStore.on(BEACON.TIMER_COMPLETE, this.completeEvent);
    }

    componentWillUnmount() {
        ActiveTaskStore.removeListener(BEACON.ACTIVE, this.updateEvent);
        ActiveTaskStore.removeListener(BEACON.TIMER_UPDATE, this.updateEvent);
        ActiveTaskStore.removeListener(
            BEACON.TIMER_COMPLETE,
            this.completeEvent
        );
    }

    render() {
        const {tasks} = this.state;

        return tasks && tasks.length ? ( // continue if count(tasks) > 0
            <Tasks
                header="Active Tasks"
                // menu={[
                //     deleteAll(TASK_STATES.FINISHED),
                //     collapse(TASK_STATES.FINISHED),
                // ]}
                tasks={tasks}
            />
        ) : null;
    }
}

export default Active;
