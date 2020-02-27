import React, {useState, useEffect} from 'react';
import TimeSlider from '../TimeSlider';
import {Button, Menu, Icon, Input, Row, Col} from 'antd';
import Util from '../Utils';
import Anim from '../Utils/animations';
import {TASK_ACTIONS_ICONS, TASK_ACTIONS} from '../Utils/Constants';


const ControlBar = function(props) {
    const [title, setTitle] = useState('');
    const [timer, setTimer] = useState(Math.pow(60, 2) * 1000); // 1hour by default
    const [selectedTime, setselectedTime] = useState('1h');
    const [minutes, setMinutes] = useState(15);
    const [optionsVisibility, setOptionsVisibility] = useState(false);

    const handleTitleChange = function(e) {
        setTitle(e.currentTarget.value);
    };

    const handleCustomTimer = function(value) {
        //setMinutes(Math.floor(value * 60 * 1000)); /* mili seconds */
        setMinutes(value); /* mili seconds */
    };

    const chooseTime = function(e, time) {
        //setTimer(time * Math.pow(60, 2) * 1000); /* mili seconds */
        setTimer(time);
        if (e) {
            animate(e.domEvent, '#F64040');
        }
    };

    const handleHoursClick = function(e) {
        setselectedTime(e.key);
    };
    const createTask = function(e) {
        if (title === '' || timer === '') {
            // show message
            Util.Notificacion(
                'Title or Timer cannot be empty',
                'exclamation-circle'
            );
            return;
        }
        props.createTask({title: title, totalTime: timer + minutes});
        setTitle('');
        chooseTime(null, 1);
        setselectedTime('1h');
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
                                        <strong>{selectedTime} </strong>{' '}
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
                                onClick={handleHoursClick}
                                selectedKeys={[selectedTime]}
                                mode="horizontal"
                            >
                                <Menu.Item
                                    onClick={e => chooseTime(e, 1)}
                                    key="1h"
                                >
                                    <span>1h</span>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={e => chooseTime(e, 2)}
                                    key="2h"
                                >
                                    <span>2h</span>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={e => chooseTime(e, 3)}
                                    key="3h"
                                >
                                    <span>3h</span>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={e => chooseTime(e, 5)}
                                    key="4h"
                                >
                                    <span>5h</span>
                                </Menu.Item>
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
                    onChange={handleCustomTimer}
                    visible={optionsVisibility}
                />
            </div>
        </>
    );
};

export default ControlBar;
