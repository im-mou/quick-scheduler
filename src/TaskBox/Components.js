import React from 'react';
import {Button, Icon, Menu, Row, Col, Popover, DatePicker} from 'antd';
import StepCounter from './StepCounter';
import moment from 'moment';

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

function disabledDate(current) {
    // Can not select days before today
    return current < moment().startOf('day');
}

const TaskDatePicker = props => (
    <DatePicker
        className="newtask-datepicker"
        bordered={false}
        format="DD/MM/YYYY"
        disabledDate={disabledDate}
        value={props.defaultDate ? moment(props.defaultDate) : null}
        onChange={props.onDateChange}
    />
);

export const NewTaskActions = props => (
    <Menu mode="horizontal">
        <Menu.Item style={props.style[0]}>
            <Popover
                title="Choose Date"
                content={<TaskDatePicker {...props.date} />}
                placement="bottom"
                trigger="click"
            >
                <Button
                    style={
                        props.date.defaultDate
                            ? {backgroundColor: '#1890ff'}
                            : {}
                    }
                    shape="circle"
                    type="dashed"
                >
                    <Icon type="calendar" />
                </Button>
            </Popover>
        </Menu.Item>

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
                <Icon type={props.icons.submit} />
                {props.text || null}
            </Button>
        </Menu.Item>
    </Menu>
);
