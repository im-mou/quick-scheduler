import React from 'react';
import Controls from './Controls';
import {TASK_STATES as STATUS, TASK_ACTIONS} from '../Utils/Constants';
import {Progress, Statistic, Row, Col} from 'antd';
import TaskBox from '../TaskBox';

const {Countdown} = Statistic;

const Timer = props => {
    return (
        <Countdown value={props.value} format="HH:mm:ss" suffix={props.text} />
    );
};

const Task = props => {
    const {task, action} = props;

    return (
        <div key={task.id} className={'task ' + task.status + ' task_' + task.id}>
            {task.status !== STATUS.EDITING ? (  // default body
                <React.Fragment>
                    <TaskBody {...props} />
                    <Progress
                        strokeWidth={3}
                        percent={(task.elapsedTime / task.time.total) * 100}
                        showInfo={false}
                        strokeLinecap="square"
                    />
                </React.Fragment>
            ) : ( // edit body
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

const TaskBody = props => {
    const {task, action} = props;
    const isActive = task.status === STATUS.ACTIVE;

    return (
        <React.Fragment>
            <div className="task-content">
                <Row className="pre-header">
                    {task.time.h ? task.time.h + 'h ' : ''}
                    {task.time.m ? task.time.m + 'm' : ''}
                </Row>
                <Row>
                    <Col span={isActive ? 24 : 16} className="title">
                        {task.title}
                    </Col>
                    <Col hidden={!isActive} span={16} className="timer">
                        <Timer
                            value={
                                Date.now() +
                                task.time.total -
                                task.elapsedTime +
                                1000 // add an extra second
                            }
                            text="remaining..."
                        />
                    </Col>
                    <Col span={8} className="right">
                        <Controls
                            status={task.status}
                            action={action}
                            taskId={task.id}
                        />
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default Task;
