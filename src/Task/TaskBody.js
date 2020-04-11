import React from 'react';
import Controls from './Controls';
import {TASK_STATES as STATUS} from '../Utils/Constants';
import {Statistic, Row, Col, Tooltip} from 'antd';
import moment from 'moment';

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

    let date = null;
    const totalTime = moment.duration(task.time.total);
    const hours = totalTime.hours();
    const minutes = totalTime.minutes();

    // create the remaining time stting for the paused task
    let formattedTime = moment(new Date())
        .startOf('day')
        .seconds((task.time.total - task.elapsedTime + 1000) / 1000)
        .format('HH:mm:ss');

    // get task date
    if (task.date) {
        let t = moment(task.date);

        date = (
            <Tooltip // show date on hover
                placement="left"
                title={moment(task.date).format('DD/MM/YYYY')}
            >
                {t.date() === moment(new Date()).date()
                    ? (date = 'Today')
                    : (date = t.format('dddd') + ', ' + t.fromNow())}
            </Tooltip>
        );
    }

    return (
        <React.Fragment>
            <div className="task-content">
                <Row className="pre-header">
                    <Col span={12}>
                        {hours ? hours + 'h ' : null}
                        {minutes ? minutes + 'm' : null}
                    </Col>
                    <Col span={12} className="right">
                        {isPaused ? 'Paused' : date}
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
                        <Statistic value={formattedTime} suffix="left..." />
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
