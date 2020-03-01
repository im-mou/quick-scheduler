import React from 'react';
import Controls from './Controls';
import TimeSlider from '../TimeSlider';
import {TASK_STATES as STATUS} from '../Utils/Constants';
import {Progress, Statistic, Row, Col} from 'antd';

const {Countdown} = Statistic;

const Timer = function(props) {
    return (
        <Countdown
            value={props.value}
            format="HH:mm:ss"
            suffix={props.text}
        />
    );
};

const Task = function({task, status, action}) {
    // check if it's an active task
    const isActive = status === STATUS.ACTIVE;

    return (
        <div key={task.id} className={'task ' + status}>
            <div className="task-content">
                <Row className="pre-header">
                    {task.time.h ? task.time.h + 'h ' : ''}
                    {task.time.m ? task.time.m + 'm' : ''}
                </Row>
                <Row>
                    <Col span={24} className="title">
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
                    <Col span={isActive ? 8 : 24} className="right">
                        <Controls
                            status={status}
                            action={action}
                            taskId={task.id}
                        />
                    </Col>
                </Row>
            </div>
            {task.editMode ? (
                <Progress
                    strokeWidth={3}
                    percent={(task.elapsedTime / task.time.total) * 100}
                    showInfo={false}
                    strokeLinecap="square"
                />
            ) : (
                <TimeSlider
                    value={task.time.m}
                    //onChange={setMinutes}
                    visible={true}
                />
            )}
        </div>
    );
};

export default Task;
