import React from 'react';
import Controls from './Controls';
import {TASK_STATES as STATUS} from '../Utils/Constants';
import {Progress, Statistic} from 'antd';

const {Countdown} = Statistic;

const Timer = function(props) {
    // exit if visible -> false
    if (!props.visible && typeof props.visible === 'boolean') {
        return '';
    }
    return <Countdown value={props.value} format="HH:mm:ss" />;
};

const Task = function({task, status, action}) {
    // check if it's an active task
    const isActive = status === STATUS.ACTIVE;

    return (
        <div key={task.id} className={'item ' + status}>
            <div className="row">
                <div className="item-content">
                    <div className="row pre-header">
                        {task.time.h ? task.time.h + 'h ' : ''}
                        {task.time.m ? task.time.m + 'm' : ''}
                    </div>
                    <div className="row">
                        <div className="col title">{task.title}</div>
                        <div className={isActive ? 'row footer' : 'footer'}>
                            <div className="col timer">
                                <Timer
                                    visible={isActive}
                                    value={
                                        Date.now() +
                                        task.time.total -
                                        task.elapsedTime +
                                        1000 // add an extra second
                                    }
                                />
                            </div>
                            <div className="col right">
                                <Controls
                                    status={status}
                                    action={action}
                                    taskId={task.id}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Progress
                    strokeWidth={3}
                    percent={(task.elapsedTime / task.time.total) * 100}
                    showInfo={false}
                />
            </div>
        </div>
    );
};

export default Task;
