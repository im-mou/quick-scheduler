import React from 'react';

import TrashTaskStore from '../Stores/TrashTaskStore';
import {BEACON} from '../TaskActions/types';

import Tasks from './index';
import {TASK_STATES} from '../Utils/Constants';

class Trash extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: TrashTaskStore.getAll(),
            stacked: true,
        };
    }

    updateEvent = () => {
        this.setState({
            tasks: TrashTaskStore.getAll(),
        });
    };

    componentDidMount() {
        // listen to collection update
        TrashTaskStore.on(BEACON.TRASH, this.updateEvent);
    }

    componentWillUnmount() {
        TrashTaskStore.removeListener(BEACON.TRASH, this.updateEvent);
    }

    render() {
        const {tasks, stacked} = this.state;

        return (
            <Tasks
                header="Trash"
                subHeader={tasks.length}
                status={TASK_STATES.TRASH}
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

export default Trash;
