import React from 'react';
import TrashTaskStore from '../Stores/TrashTaskStore';
import {BEACON} from '../TaskActions/types';
import * as TaskActions from '../TaskActions';
import EmptyState from '../EmptyStates';
import Tasks from './index';
import {TASK_STATES} from '../Utils/Constants';
import Util from '../Utils';

class Trash extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: TrashTaskStore.getTasks(),
            stacked: TrashTaskStore.getStacked(),
        };
    }

    updateEvent = () => {
        this.setState({
            tasks: TrashTaskStore.getTasks(),
            stacked: TrashTaskStore.getStacked(),
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

        return tasks && tasks.length ? ( // continue if count(tasks) > 0
            <Tasks
                header="Trash"
                subHeader={tasks.length}
                menu={[
                    Util.menuItemDeleteAll({
                        status: TASK_STATES.TRASH,
                        hidden: tasks.length < 2,
                        action: () => {
                            TaskActions.deleteAllTask(TASK_STATES.TRASH);
                        },
                    }),
                    Util.menuItemCollapse({
                        stacked: stacked,
                        hidden: tasks.length < 2,
                        action: () => {
                            TaskActions.ToggleCollapse(TASK_STATES.TRASH);
                        },
                    }),
                ]}
                stacked={stacked}
                tasks={tasks}
            />
        ) : (
            <EmptyState.TrashDrawerPanel visible={true}>
                <span>Trash Bin is empty!</span>
            </EmptyState.TrashDrawerPanel>
        );
    }
}

export default Trash;
