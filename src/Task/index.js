import React from 'react';
import {TASK_STATES as STATUS, TASK_ACTIONS} from '../Utils/Constants';
import {Progress} from 'antd';
import TaskBody from './TaskBody';
import TaskBox from '../TaskBox';

const Task = props => {
    const {task, action} = props;
    const inEditMode = task.status === STATUS.EDITING;
    const stacked =
        props.stacked.value || false
            ? ' stacked n' + props.stacked.layers // attach layers class 'nX'
            : '';

    return (
        <div
            key={task.id}
            onDoubleClick={() => {
                // enable double click only if status is 'pending'
                if (task.status === STATUS.PENDING) {
                    props.action({
                        taskId: task.id,
                        actionType: TASK_ACTIONS.EDIT,
                    });
                }
            }}
            className={'task ' + task.status + ' task_' + task.id + stacked}
        >
            {!inEditMode ? ( 
                // default task body
                <React.Fragment>
                    <TaskBody {...props} />
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
                    save={data =>
                        action({
                            taskId: task.id,
                            actionType: TASK_ACTIONS.SAVE,
                            data: data,
                        })
                    }
                    cancle={() =>
                        action({
                            taskId: task.id,
                            actionType: TASK_ACTIONS.CANCLE,
                        })
                    }
                    data={task}
                />
            )}
        </div>
    );
};

export default Task;
