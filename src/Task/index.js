import React from 'react';
import {TASK_STATES as STATUS} from '../Utils/Constants';
import {Progress} from 'antd';
import TaskBody from './TaskBody';
import TaskBox from '../TaskBox';

import * as TaskActions from '../TaskActions';

const Task = props => {
    const {task, status} = props;
    const inEditMode = task.status === STATUS.EDITING;
    // enable edit mode only if status is pending
    const doubleClickFunc = (status === STATUS.PENDING) ? () => {
        TaskActions.editTask(task);
    } : null;

    const stacked =
        props.stacked.value || false
            ? ' stacked n' + props.stacked.layers // attach layers class 'nX'
            : '';

    return (
        <div
            key={task.id}
            onDoubleClick={doubleClickFunc}
            className={
                'task ' + (task.status || status) + ' task_' + task.id + stacked
            }
        >
            {!inEditMode ? (
                // default task body
                <React.Fragment>
                    <TaskBody task={task} status={status} />
                    <Progress
                        strokeWidth={3}
                        percent={(task.elapsedTime / task.time.total) * 100}
                        showInfo={false}
                        strokeLinecap="square"
                    />
                </React.Fragment>
            ) : (
                // edit body
                <TaskBox
                    mode={STATUS.EDITING}
                    expanded={true}
                    save={data => TaskActions.saveEditTask(task, data)}
                    cancle={() => TaskActions.cancleEditTask(task)}
                    data={task}
                />
            )}
        </div>
    );
};

export default Task;
