import React from 'react';
import Task from '../Task';

const Tasks = function(props) {
    // generate tasks
    const tasks = (props.tasks || []).map((task, key) => (
        <Task key={key} task={task} status={props.status} action={props.action} />
    ));

    return (
        <div className={'section ' + (!props.tasks.length ? 'hidden' : '')}>
            <div className="header">{props.header}</div>
            <div className="tasks">{tasks}</div>
        </div>
    );
};

export default Tasks;
