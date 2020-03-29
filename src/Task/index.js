import React from 'react';
import classNames from 'classnames';
import {Progress} from 'antd';
import TaskBody from './TaskBody';

const Task = props => {
    const {task, status, classes, onDoubleClick} = props;
    return (
        <div
            key={task.id}
            onDoubleClick={onDoubleClick}
            className={classNames('task', [`task_${task.id}`], [classes])}
        >
            <React.Fragment>
                <TaskBody task={task} status={status} />
                <Progress
                    strokeWidth={3}
                    percent={(task.elapsedTime / task.time.total) * 100}
                    showInfo={false}
                    strokeLinecap="square"
                />
            </React.Fragment>
        </div>
    );
};

export default Task;
