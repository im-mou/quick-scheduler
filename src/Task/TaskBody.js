import React from 'react';
import Controls from './Controls';
import {TASK_STATES as STATUS} from '../Utils/Constants';
import {Statistic, Row, Col} from 'antd';

const {Countdown} = Statistic;

const Timer = props => {
    return (
        <Countdown value={props.value} format="HH:mm:ss" suffix={props.text} />
    );
};

const TaskBody = props => {
    const {task, status} = props;
    const isActive = task.status === STATUS.ACTIVE;
    const isPaused = task.status === STATUS.PAUSED;
    const hours = task.time.h // +1 hour if min->60
        ? (task.time.m === 60 ? task.time.h + 1 : task.time.h) + 'h'
        : null;
    const minutes =
        task.time.m && task.time.m !== 60 ? task.time.m + 'm' : null;

    let _elapsedTime = new Date(task.time.total - task.elapsedTime);
    let formattedTime =
        '0' +
        String(_elapsedTime.getHours() - 1) +
        ':' +
        ('0' + _elapsedTime.getMinutes()).substr(-2) +
        ':' +
        ('0' + _elapsedTime.getSeconds()).substr(-2);

    return (
        <React.Fragment>
            <div className="task-content">
                <Row className="pre-header">
                    <Col span={12}>
                        {hours} {minutes}
                    </Col>
                    <Col span={12} className="right">
                        {isPaused ? 'Paused' : ''}
                    </Col>
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
                    <Col hidden={!isPaused} span={16} className="timer">
                        <Statistic
                            value={formattedTime}
                            suffix="left..."
                        />
                    </Col>
                    <Col span={8} className="right">
                        <Controls status={status} task={task} />
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default TaskBody;
