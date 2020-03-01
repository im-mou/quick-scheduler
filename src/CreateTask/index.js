import React, {useState} from 'react';
import TimeSlider from '../TimeSlider';
import {Button, Menu, Icon, Input, Row, Col} from 'antd';
import Util from '../Utils';
import Anim from '../Utils/animations';
import StepCounter from './StepCounter';
import {TASK_ACTIONS_ICONS, TASK_ACTIONS} from '../Utils/Constants';

const menuItems = [1, 2, 3, 5];

const CreateTask = function(props) {
    const [title, setTitle] = useState(props.title || '');
    const [hours, setHours] = useState(props.hours || 1); // 1hour by default
    const [minutes, setMinutes] = useState(props.minutes || 15);
    const [pop, setPop] = useState({h: false, m: false});
    const [optionsVisible, setOptionsVisible] = useState(
        props.visible || false
    );

    const handleTitleChange = function(e) {
        setTitle(e.currentTarget.value);
    };

    const handleTimeChange = minutes => {
        setMinutes(minutes);
    };

    const chooseHour = function(e, time) {
        // set min|max requirment
        if (time >= 0 && time <= 23) {
            setHours(time);
        }
        if (e) {
            Anim.animate(e, '#F64040', Anim.pop);
        }

        // animate
        blink({h: true, m: false});
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
        const total = _hours + (optionsVisible ? _minutes : 0); //ms
        props.createTask({
            title: title,
            time: {
                total: total,
                h: hours,
                m: optionsVisible ? minutes : 0, // add minutes if options panel is open
            },
        });

        // reset state
        reset();
    };

    const reset = function() {
        setTitle('');
    };

    // create task if "enter" is pressed
    const handleKeyDown = function(e) {
        if (e.key === 'Enter') {
            createTask();
        }
    };

    const toggleOptions = function(e) {
        if (!hours) {
            setHours(1);
        }
        if (optionsVisible && hours > 5) {
            setHours(5);
        }

        // update state
        setOptionsVisible(!optionsVisible);
        Anim.animate(e.domEvent, null, Anim.pop);
    };

    const blink = obj => {
        // animate
        setPop(obj);
        setTimeout(() => {
            setPop({h: false, m: false});
        }, 200);
    };

    return (
        <div className="new-task">
            <React.Fragment>
                <Input
                    size="large"
                    value={title}
                    onChange={handleTitleChange}
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Create a new task"
                />
            </React.Fragment>
            <Row>
                <Col span={16}>
                    {optionsVisible ? (
                        <Row
                            style={{paddingLeft: 13, paddingTop: 7}}
                            gutter={[8, 8]}
                        >
                            <Col>
                                <StepCounter
                                    decDisabled={hours ? false : true}
                                    onInc={() => chooseHour(null, hours + 1)}
                                    onDec={() => chooseHour(null, hours - 1)}
                                >
                                    <Button shape="round" type="dashed">
                                        <strong className={pop.h ? 'pop' : ''}>
                                            {hours + 'h '}{' '}
                                        </strong>
                                        <span className={pop.m ? 'pop' : ''}>
                                            {minutes + ' min'}
                                        </span>
                                    </Button>
                                </StepCounter>
                            </Col>
                        </Row>
                    ) : (
                        <Menu
                            className="noselect"
                            selectedKeys={[hours + 'h']}
                            mode="horizontal"
                        >
                            {menuItems.map(item => (
                                <Menu.Item
                                    onClick={e => chooseHour(e.domEvent, item)}
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
                                        optionsVisible
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
                                disabled={hours + minutes ? false : true}
                                icon={TASK_ACTIONS_ICONS[TASK_ACTIONS.CREATE]}
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
                onChange={handleTimeChange}
                visible={optionsVisible}
            />
        </div>
    );
};

export default CreateTask;
