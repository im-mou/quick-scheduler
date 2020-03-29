import React from 'react';
import CompletedTaskStore from '../Stores/CompletedTaskStore';
import {BEACON} from '../TaskActions/types';
import * as TaskActions from '../TaskActions';

import Tasks from './index';
import {TASK_STATES} from '../Utils/Constants';
import Util from '../Utils';

class CompletedTasks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: CompletedTaskStore.getTasks(),
            stacked: CompletedTaskStore.getStacked(),
        };
    }

    updateEvent = () => {
        this.setState({
            tasks: CompletedTaskStore.getTasks(),
            stacked: CompletedTaskStore.getStacked(),
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

        return tasks && tasks.length ? ( // continue if count(tasks) > 0
            <Tasks
                header="Completed"
                subHeader={tasks.length}
                menu={[
                    Util.menuItemDeleteAll({
                        status: TASK_STATES.FINISHED,
                        hidden: tasks.length < 2,
                        action: () => TaskActions.sendAllToTrashTask(tasks),
                    }),
                    Util.menuItemCollapse({
                        stacked: stacked,
                        hidden: tasks.length < 2,
                        action: () =>
                            TaskActions.ToggleCollapse(TASK_STATES.FINISHED),
                    }),
                ]}
                stacked={stacked}
                tasks={tasks}
            />
        ) : null;
    }
}

export default CompletedTasks;
