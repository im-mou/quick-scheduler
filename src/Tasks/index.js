import React from 'react';
import classNames from 'classnames';
import Task from '../Task';
import TaskHeaderMenu from './TaskHeaderMenu';
import {Row, Col} from 'antd';
import {TASK_STATES as STATUS} from '../Utils/Constants';
import TaskBox from '../TaskBox';
import * as TaskActions from '../TaskActions';

// enable edit mode only if status is pending
const doubleClickFunc = (status, task) => {
    if (status === STATUS.PENDING || status === STATUS.PAUSED)
        return TaskActions.editTask(task);
    else return null;
};

// task status class
const statusClass = taskStatus => {
    let status = taskStatus;
    if (taskStatus === STATUS.EDITING) status = STATUS.EDITING;
    if (taskStatus === STATUS.PAUSED) status = STATUS.PAUSED;

    return status;
};

// generate tasks
const Tasks = function(props) {
    let tasks;
    let _tasks = props.tasks || [];
    let _stacked = props.stacked || false;
    const hasHeader = props.header !== undefined;

    // select one task if stacked => true
    if (props.stacked && _tasks.length > 0) {
        // dont stack if length is 1
        _stacked = !(_tasks.length === 1);
        _tasks = [_tasks[0]];
    } else {
        _tasks = props.tasks;
    }

    // generate regular tasks
    tasks = _tasks.map((task, key) => {
        switch (task.status) {
            case STATUS.EDITING: // edit body
                return (
                    <TaskBox
                        key={key}
                        className="edit"
                        mode={STATUS.EDITING}
                        expanded={true}
                        save={data => TaskActions.saveEditTask(task, data)}
                        cancle={() => TaskActions.cancleEditTask(task)}
                        data={task}
                    />
                );
            default:
                // regular task body
                return (
                    <Task
                        key={key}
                        classes={classNames(
                            {[task.status]: true},
                            {[`stacked n${props.tasks.length}`]: _stacked}
                        )}
                        onDoubleClick={() => doubleClickFunc(task.status, task)}
                        // send length to apply stack layers class
                        stacked={{value: _stacked, layers: props.tasks.length}}
                        task={task}
                        status={statusClass(task.status)}
                    />
                );
        }
    });

    return (
        <div className={classNames('section', {hidden: !props.tasks.length})}>
            <Row hidden={!hasHeader} justify="space-around" align="middle" className={classNames({header:hasHeader})}>
                <Col span={8}>
                    {props.header +
                        (props.subHeader ? ' · ' + props.subHeader : '')}
                </Col>
                <Col className="right" span={16}>
                    <TaskHeaderMenu items={props.menu || []} />
                </Col>
            </Row>
            <div className="tasks">{tasks}</div>
        </div>
    );
};

export default Tasks;
