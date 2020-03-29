import React from 'react';
import {Button, Icon, Menu, Row, Col} from 'antd';
import StepCounter from './StepCounter';

// time step selector
export const TimeDialSelector = props => (
    <Row style={props.style} gutter={[8, 8]}>
        <Col>
            <StepCounter
                decDisabled={!props.hours}
                onInc={() => props.action(props.hours + 1)}
                onDec={() => props.action(props.hours - 1)}
            >
                <Button shape="round" type="dashed">
                    <strong className={props.pop.h ? 'pop' : ''}>
                        {props.hours}h
                    </strong>
                    <span>{props.minutes}min</span>
                </Button>
            </StepCounter>
        </Col>
    </Row>
);

// default time options menu
export const DefaultTimeMenu = props => (
    <Menu
        className="noselect"
        selectedKeys={[props.hours + 'h']}
        mode="horizontal"
    >
        {props.menu.map(item => (
            <Menu.Item
                key={item + 'h'}
                onClick={e => props.action(item, e.domEvent)}
            >
                <span>{item}h</span>
            </Menu.Item>
        ))}
    </Menu>
);

export const NewTaskActions = props => (
    <Menu mode="horizontal">
        <Menu.Item style={props.style[0]} onClick={props.cancle}>
            <Button shape="circle" type="dashed">
                <Icon type={props.icons.cancle} />
            </Button>
        </Menu.Item>
        <Menu.Item
            style={props.style[1]}
            className={props.submitElClass || null}
            onClick={props.submit}
        >
            <Button
                type="dashed"
                shape="round"
                disabled={!(props.hours + props.minutes)}
            >
                <Icon type={props.icons.submit} />{props.text || null}
            </Button>
        </Menu.Item>
    </Menu>
);
