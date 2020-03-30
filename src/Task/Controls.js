import React from 'react';
import {
    TASK_ACTIONS as ACTION,
    TASK_ACTIONS_LIST as ACTIONS,
    TASK_ACTIONS_ICONS as ICON,
    TASK_ACTIONS_DESC as ACTION_NAME,
    TASK_ACTIONS_MORE_OPTIONS as MORE_OPTIONS,
} from '../Utils/Constants';
import {Tooltip, Button, Menu, Dropdown, Icon} from 'antd';

import * as TaskActions from '../TaskActions';

const actionStyles = {fontSize: '20px', color: '#8a8a8a'};

const Controls = function({status, task}) {
    return (
        <div className="controls">
            {ACTIONS[status].map((actionType,key) => (
                <Tooltip
                    key={key}
                    placement="top"
                    title={ACTION_NAME[actionType]}
                >
                    {actionType === ACTION.MORE ? ( // check if button type is a dropdown
                        <DropdownItem
                            {...{task}}
                            options={MORE_OPTIONS[status]}
                            icon={ICON[actionType]}
                        />
                    ) : (
                        <Button
                            type="link"
                            icon={ICON[actionType]}
                            style={actionStyles}
                            onClick={() => TaskActions[actionType](task)}
                        />
                    )}
                </Tooltip>
            ))}
        </div>
    );
};

const DropdownItem = ({task, options, icon}) => {
    // generate sub-menu options
    const optionsButtons = options.map((_option, key) => (
        <Menu.Item
            key={key}
            onClick={() => TaskActions[_option](task)}
        >
            <Icon type={ICON[_option]} theme="outlined" />
            <span>{ACTION_NAME[_option]}</span>
        </Menu.Item>
    ));

    // create menu element
    return (
        <Dropdown overlay={<Menu>{optionsButtons}</Menu>} trigger={['click']}>
            <Button type="link" icon={icon} style={actionStyles} />
        </Dropdown>
    );
};

export default Controls;
