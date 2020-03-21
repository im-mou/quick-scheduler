import React from 'react';
import Task from '../Task';
import TaskHeaderMenu from './TaskHeaderMenu';
import {Row, Col} from 'antd';

const Tasks = function(props) {
    let tasks;
    let _tasks = props.tasks || [];
    let _stacked = props.stacked || false;

    // select one task if stacked => true
    if (props.stacked && _tasks.length > 0) {
        // dont stack if length is 1
        _stacked = !(_tasks.length === 1);
        _tasks = [_tasks[0]];
    } else {
        _tasks = props.tasks;
    }

    // generate regular tasks
    tasks = _tasks.map((task, key) => (
        <Task
            key={key}
            // send length to apply stack layers class
            stacked={{value: _stacked, layers: props.tasks.length}}
            task={task}
            status={props.status}
        />
    ));

    return (
        <div className={'section ' + (!props.tasks.length ? 'hidden' : '')}>
            <Row justify="space-around" align="middle" className="header">
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
