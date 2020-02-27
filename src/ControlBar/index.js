import React, {useState, useEffect} from 'react';
import TimeSlider from '../TimeSlider';
import {Button, Menu, Icon, Input, Row, Col} from 'antd';
import Util from '../Utils';
import Anim from '../Utils/animations';
import {TASK_ACTIONS_ICONS, TASK_ACTIONS} from '../Utils/Constants';

const menuItems = [1, 2, 3, 5];

const ControlBar = function(props) {
    const [title, setTitle] = useState(props.title || 'title');
    const [hours, setHours] = useState(props.hours || 1); // 1hour by default
    const [selectedHour, setselectedHour] = useState('1h');
    const [minutes, setMinutes] = useState(props.minutes || 15);
    const [optionsVisibility, setOptionsVisibility] = useState(
        props.visible || false
    );

    const handleTitleChange = function(e) {
        setTitle(e.currentTarget.value);
    };

    const chooseMinutes = function(time) {
        setMinutes(time);
    };

    const chooseHour = function(e, time) {
        setHours(time);
        if (e) {
            animate(e.domEvent, '#F64040');
        }
    };

    const selectHoursMenuItem = function(e) {
        setselectedHour(e.key);
    };

    const createTask = function(e) {
        if (title === '' || hours + minutes <= 0) {
            // show message
            Util.Notificacion(
                'Title or hours cannot be empty',
                'exclamation-circle'
            );
            return;
        }

        // execute method -> miliseconds
        const _minutes = Math.floor(minutes * 60 * 1000);
        const _hours = hours * Math.pow(60, 2) * 1000;
        props.createTask({
            title: title,
            time: {total: _hours + _minutes, h: hours, m: minutes},
        });

        // reset state
        reset();
    };

    const reset = function() {
        setTitle('');
        setHours(1);
        setselectedHour('1h');
        setMinutes(15);
    };

    // create task if "enter" is pressed
    const handleKeyDown = function(e) {
        if (e.key === 'Enter') {
            createTask();
        }
    };

    const toggleOptions = function(e) {
        animate(e.domEvent);
        // update state
        setOptionsVisibility(!optionsVisibility);
    };

    const animate = function(e, color) {
        const pos = Util.getObjOffset(e.currentTarget);
        const size = Util.getObjSize(e.currentTarget);
        Anim.littleOptions(color)
            .tune({x: pos.left + size.w / 2, y: pos.top + size.h / 2})
            .replay();
    };

    return (
        <>
            <div className="control-bar">
                <div>
                    <Input
                        size="large"
                        value={title}
                        onChange={handleTitleChange}
                        onKeyDown={handleKeyDown}
                        type="text"
                        placeholder="Create a new task"
                    />
                </div>
                <Row>
                    <Col span={16}>
                        {optionsVisibility ? (
                            <Row
                                style={{paddingLeft: 13, paddingTop: 7}}
                                gutter={[8, 8]}
                            >
                                <Col>
                                    <Button shape="circle" type="dashed">
                                        <Icon type="minus" />
                                    </Button>
                                    <Button type="link">
                                        <strong>{selectedHour} </strong>{' '}
                                        <span className="muted">
                                            {minutes + ' min'}
                                        </span>
                                    </Button>
                                    <Button shape="round" type="dashed">
                                        <Icon type="plus" />
                                        1h
                                    </Button>
                                </Col>
                            </Row>
                        ) : (
                            <Menu
                                onClick={selectHoursMenuItem}
                                selectedKeys={[selectedHour]}
                                mode="horizontal"
                            >
                                {menuItems.map(item => (
                                    <Menu.Item
                                        onClick={e => chooseHour(e, item)}
                                        key={item + 'h'}
                                    >
                                        <span>{item + 'h'}</span>
                                    </Menu.Item>
                                ))}
                            </Menu>
                        )}
                    </Col>
                    <Col span={8} className="right">
                        <Menu mode="horizontal">
                            <Menu.Item
                                style={{paddingLeft: 5, paddingRight: 5}}
                                key="custom"
                                onClick={toggleOptions}
                            >
                                <Button shape="circle" type="dashed">
                                    <Icon
                                        type={
                                            optionsVisibility
                                                ? 'close-circle'
                                                : 'setting'
                                        }
                                    />
                                </Button>
                            </Menu.Item>
                            <Menu.Item
                                style={{paddingLeft: 5, paddingRight: 10}}
                                className="mobile-create-button-main"
                            >
                                <Button
                                    type="dashed"
                                    shape="round"
                                    icon={
                                        TASK_ACTIONS_ICONS[TASK_ACTIONS.CREATE]
                                    }
                                    onClick={createTask}
                                >
                                    Create
                                </Button>
                            </Menu.Item>
                        </Menu>
                    </Col>
                </Row>

                <TimeSlider
                    value={minutes}
                    onChange={chooseMinutes}
                    visible={optionsVisibility}
                />
            </div>
        </>
    );
};

export default ControlBar;
