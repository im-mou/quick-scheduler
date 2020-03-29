import React from 'react';
import {Button, Popconfirm, Tooltip} from 'antd';

const TaskHeaderMenu = props => {
    return props.items.map((item, key) => {
        let button = (
            <Button
                className="menu-item"
                key={key}
                hidden={item.hidden || false}
                onClick={item.confirm ? null : item.action}
                type="link"
                size="small"
                icon={item.icon || ''}
            >
                {item.value || ''}
            </Button>
        );

        // if menu item has a tooltip
        if (item.tooltip) {
            button = (
                <Tooltip key={key} title={item.tooltip}>
                    {button}
                </Tooltip>
            );
        }

        // if item type is Popconfirm
        if (item.confirm && item.confirm.value) {
            return (
                <Popconfirm
                    key={key}
                    placement="leftBottom"
                    title={item.confirm.title || 'Are you sure?'}
                    okText={item.confirm.okText || 'Yes'}
                    cancelText={item.confirm.cancelText || 'No'}
                    onConfirm={item.action}
                >
                    {button}
                </Popconfirm>
            );
        }
        return button;
    });
};

export default TaskHeaderMenu;
