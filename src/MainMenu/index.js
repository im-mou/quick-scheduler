import React, {useState} from 'react';
import Trash from '../Tasks/Trash';
import SettingsMenu from './SettingsMenu';
import Util from '../Utils';

import {Icon, Row, Col, Button, Tooltip, Drawer, Popover} from 'antd';

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

export default MainMenu;
