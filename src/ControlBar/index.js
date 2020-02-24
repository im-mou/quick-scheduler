import React, {useState, useEffect} from 'react';
import OptionsPanel from './OptionsPanel';
import {Button, Menu, InputNumber, Input} from 'antd';
import Util from '../Utils';
import {
    TASK_ACTIONS_ICONS,
    TASK_ACTIONS_DESC,
    TASK_ACTIONS,
} from '../Utils/Constants';

const ControlBar = function(props) {
    const [title, setTitle] = useState('');
    const [timer, setTimer] = useState(Math.pow(60, 2) * 1000); // 1hour by default
    const [selectedTime, setselectedTime] = useState('1h');
    const [minutes, setMinutes] = useState(0);

    const handleTitleChange = function(e) {
        setTitle(e.currentTarget.value);
    };

    const handleCustomTimer = function(value) {
        setMinutes(Math.floor(value * 60 * 1000)); /* mili seconds */
    };

    const chooseTime = function(time) {
        setTimer(time * Math.pow(60, 2) * 1000); /* mili seconds */
    };

    const handleHoursClick = function(e) {
        setselectedTime(e.key);
    };
    const createTask = function() {
        if (title === '' || timer === '') {
            // show message
            Util.Notificacion(
                'Title or Timer cannot be empty',
                'exclamation-circle'
            );
            return;
        }
        props.createTask({title: title, totalTime: timer});
        setTitle('');
        chooseTime(1);
        setselectedTime('1h');
    };

    // create task if "enter" is pressed
    const handleKeyDown = function(e) {
        if (e.key === 'Enter') {
            createTask();
        }
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
                <div>
                    <Menu
                        onClick={handleHoursClick}
                        selectedKeys={[selectedTime]}
                        mode="horizontal"
                    >
                        <Menu.Item onClick={() => chooseTime(1)} key="1h">
                            <span>1h</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => chooseTime(2)} key="2h">
                            <span>2h</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => chooseTime(3)} key="3h">
                            <span>3h</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => chooseTime(5)} key="4h">
                            <span>5h</span>
                        </Menu.Item>
                        <Menu.Item
                            style={{padding: 0}}
                            key="custom"
                            className="numberInput"
                        >
                            <span>
                                <InputNumber
                                    type="number"
                                    value={minutes}
                                    style={{width: 60, paddingRight:40}}
                                    min={1}
                                    max={1440}
                                    onChange={handleCustomTimer}
                                    onKeyDown={handleKeyDown}
                                />
                                <small className="muted">minutes</small>
                            </span>
                        </Menu.Item>
                        <Menu.Item
                            style={{padding: 0, paddingLeft: 47}}
                            className="hide-on-mobile mobile-create-button-main"
                        >
                            <Button
                                type="dashed"
                                shape="round"
                                icon={TASK_ACTIONS_ICONS[TASK_ACTIONS.CREATE]}
                                onClick={createTask}
                            >
                                Create
                            </Button>
                        </Menu.Item>
                    </Menu>

                    <OptionsPanel />

                    <Button
                        type="dashed"
                        shape="round"
                        size="large"
                        icon={TASK_ACTIONS_ICONS[TASK_ACTIONS.CREATE]}
                        className="mobile-create-button show-on-mobile"
                        onClick={createTask}
                    >
                        Create
                    </Button>
                </div>
            </div>
            {/* <div className="hide-on-mobile right">
                <small className="muted">Press enter to create task</small>
            </div> */}
        </>
    );
};

export default ControlBar;
