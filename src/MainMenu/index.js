import React, {useState} from 'react';
import Trash from '../Tasks/Trash';
import Util from '../Utils';
import {
    Icon,
    Row,
    Col,
    Button,
    Tooltip,
    Drawer,
    Popover,
    List,
    Switch,
} from 'antd';

const MainMenu = () => {
    let _darkMode = 0;
    const [drawer, setDrawer] = useState(false);

    // check if there is already a state in the localstorage
    if (localStorage.darkMode !== undefined) {
        _darkMode = JSON.parse(localStorage.darkMode);
    } else {
        localStorage.darkMode = JSON.stringify(_darkMode);
    }
    // apply initial darkMode class
    document.body.classList[_darkMode ? 'add' : 'remove']('dark');

    return (
        <React.Fragment>
            <Row className="main-menu">
                <Col span={12} md={16}>
                    <img
                        className="logo-img"
                        alt="Quick Scheduler"
                        src="logo.png"
                        width={120}
                    />
                </Col>
                <Col span={12} md={8}>
                    <Row className={!Util.mobileCheck() ? 'right' : 'center'}>
                        <Col span={8}></Col>
                        <Col span={8}>
                            <Tooltip title="Show Trash Bin">
                                <Button
                                    type="dashed"
                                    shape="circle"
                                    onClick={() => setDrawer(true)}
                                >
                                    <Icon type="delete" />
                                </Button>
                            </Tooltip>
                        </Col>
                        <Col span={8}>
                            <Popover
                                content={<SettingsMenu />}
                                title="Settings"
                                trigger="click"
                                placement="bottomRight"
                            >
                                <Button type="dashed" shape="circle">
                                    <Icon type="setting" />
                                </Button>
                            </Popover>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Drawer
                title="Trash bin"
                width={!Util.mobileCheck() ? '400' : '100%'}
                placement="right"
                closable={true}
                onClose={() => setDrawer(false)}
                visible={drawer}
            >
                <Trash />
            </Drawer>
        </React.Fragment>
    );
};

const SettingsMenu = () => {
    let _sound = 0;
    // check if there is already a state in the localstorage
    if (localStorage.sound !== undefined) {
        _sound = JSON.parse(localStorage.sound);
    } else {
        localStorage.sound = JSON.stringify(_sound);
    }

    const [darkmode, setDarkmode] = useState(JSON.parse(localStorage.darkMode));
    // ToDo
    // const [sound, setSound] = useState(_sound);
    const toggleDarkMode = () => {
        let mode = 1;
        if (darkmode === mode) {
            mode = 0;
        }
        setDarkmode(mode);
        localStorage.darkMode = JSON.stringify(mode);
        document.body.classList[mode ? 'add' : 'remove']('dark');
    };

    // Todo: implement this
    // const toggleSound = () => {
    //     let _sound = 1;
    //     if (sound === _sound) {
    //         _sound = 0;
    //     }
    //     setSound(_sound);
    //     localStorage.sound = JSON.stringify(_sound);
    // };

    return (
        <List>
            <List.Item>
                <span style={{marginRight: 10}}>Dark Mode</span>
                <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={toggleDarkMode}
                    checked={!!darkmode}
                />
            </List.Item>
            <List.Item>
                <span>More options to come...</span>
            </List.Item>
            <List.Item>
                <span>
                    <a href="https://github.com/im-mou/quick-scheduler" target="_blank" rel="noopener noreferrer">
                        <Icon type="github" /> Github
                    </a>
                </span>
            </List.Item>
            <List.Item>
                <span className="copyright">© 2020 Mohsin Riaz</span>
            </List.Item>
            {/* Todo:
            <List.Item>
                <span style={{marginRight: 10}}>Beep on completion</span>
                <Switch
                    checked={!!sound}
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={toggleSound}
                />
            </List.Item> */}
        </List>
    );
};

export default MainMenu;
