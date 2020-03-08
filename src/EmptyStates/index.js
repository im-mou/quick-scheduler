import React from 'react';
import {Empty} from 'antd';

const TasksPanel = props => {
    if (props.visible) {
        return (
            <Empty
                style={{marginTop: 130}}
                className="noselect"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={props.children}
            />
        );
    };
    return null;
};

const EmptyState = {
    TasksPanel,
};

export default EmptyState;
