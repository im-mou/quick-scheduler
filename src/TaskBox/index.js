import React from 'react';
import TimeSlider from '../TimeSlider';
import {Input, Row, Col} from 'antd';
import Util from '../Utils';
import Anim from '../Utils/animations';
import {TimeDialSelector, DefaultTimeMenu, NewTaskActions} from './Components';
import {
    TASK_ACTIONS_ICONS as ICON,
    TASK_ACTIONS as ACTION,
    TASK_STATES as STATE,
} from '../Utils/Constants';

// Less hours options if mobile
const mobile = Util.mobileCheck();
const defaultTimeOptions = mobile ? [1, 2, 3] : [1, 2, 3, 5];
const actionStyle = {
    default: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    last: {
        paddingLeft: 0,
        paddingRight: 10,
    },
};

class TaskBox extends React.Component {
    constructor(props) {
        super(props);

        // define default values
        let initialTitle = '',
            initialTime = {h: 1, m: 15},
            expanded = props.expanded || false,
            mode = props.mode || STATE.NEW;

        // check if there is initial data present
        if (props.data) {
            initialTitle = props.data.title;
            initialTime = props.data.time;
        }

        this.state = {
            title: initialTitle,
            hours: initialTime.h,
            minutes: initialTime.m,
            expanded: expanded,
            pop: {h: false, m: false},
            mode: mode,
        };
    }

    setValue = (el, value) => {
        this.setState({
            [el]: value,
        });
    };

    handleTitleChange = e => {
        this.setValue('title', e.currentTarget.value);
    };

    handleTimeChange = minutes => {
        this.setValue('minutes', minutes);
    };

    chooseHour = (time, event) => {
        // set min|max requirment
        if (time >= 0 && time <= 23) {
            this.setValue('hours', time);
        }
        if (event) {
            Anim.animate(event, '#F64040', Anim.pop);
        }

        // animate
        this.blink({h: true, m: false});
    };

    // create task if "enter" is pressed
    handleKeyDown = e => {
        if (e.key === 'Enter') {
            this.saveTask();
        }
    };

    saveTask = () => {
        if (
            this.state.title === '' ||
            this.state.hours + this.state.minutes <= 0
        ) {
            // show message
            Util.Notificacion(
                'Title or hours cannot be empty',
                'exclamation-circle'
            );
            return;
        }

        // execute method -> miliseconds
        const _minutes = Math.floor(this.state.minutes * 60 * 1000);
        const _hours = this.state.hours * Math.pow(60, 2) * 1000;
        const total = _hours + (this.state.expanded ? _minutes : 0); //ms
        this.props.save({
            title: this.state.title,
            time: {
                total: total,
                h: this.state.hours,
                m: this.state.expanded ? this.state.minutes : 0, // add minutes if options panel is open
            },
        });

        // reset state
        if (this.state.mode === STATE.NEW) this.reset();
    };

    reset = () => {
        this.setValue('title', '');
    };

    toggleOptions = e => {
        if (!this.state.hours) {
            this.setValue('hours', 1);
        }

        if (this.state.expanded && this.state.hours >= 4) {
            this.setValue('hours', 5);
        }

        // update state
        this.setValue('expanded', !this.state.expanded);
        Anim.animate(e.domEvent, null, Anim.pop);
    };

    blink = obj => {
        // animate

        this.setValue('pop', obj);
        setTimeout(() => {
            this.setValue('pop', {h: false, m: false});
        }, 200);
    };

    render() {
        const {title, hours, minutes, expanded, pop, mode} = this.state;
        const inEditMode = mode === STATE.EDITING;
        const newTaskActions = {
            style: [actionStyle.default, actionStyle.last],
            expanded: expanded,
            hours: hours,
            minutes: minutes,
        };

        return (
            <div className={'new-task ' + mode}>
                <React.Fragment>
                    <Input
                        size="large"
                        value={title}
                        onChange={this.handleTitleChange}
                        onKeyDown={this.handleKeyDown}
                        type="text"
                        placeholder="Create a new task"
                    />
                </React.Fragment>
                <Row>
                    <Col span={mobile ? 12 : 16}>
                        {// toggle default menu and settings menu
                        !expanded ? (
                            <DefaultTimeMenu
                                hours={hours}
                                menu={defaultTimeOptions}
                                action={this.chooseHour}
                            />
                        ) : (
                            <TimeDialSelector
                                style={{paddingTop: 7}}
                                hours={hours}
                                minutes={minutes}
                                pop={pop}
                                action={this.chooseHour}
                            />
                        )}
                    </Col>

                    <Col span={mobile ? 12 : 8} className="right">
                        {// toggle between edit and create actions
                        !inEditMode ? (
                            <NewTaskActions
                                {...newTaskActions}
                                cancle={this.toggleOptions}
                                submit={this.saveTask}
                                submitElClass="mobile-create-button-main"
                                icons={{
                                    cancle: expanded
                                        ? ICON[ACTION.CANCLE]
                                        : 'setting',
                                    submit: ICON[ACTION.CREATE],
                                }}
                                text="Create"
                            />
                        ) : (
                            <NewTaskActions
                                {...newTaskActions}
                                cancle={this.props.cancle}
                                submit={this.saveTask}
                                icons={{
                                    cancle: ICON[ACTION.CANCLE],
                                    submit: ICON[ACTION.SAVE],
                                }}
                                text="Save"
                            />
                        )}
                    </Col>
                </Row>

                <TimeSlider
                    value={minutes}
                    onChange={this.handleTimeChange}
                    visible={expanded}
                />
            </div>
        );
    }
}

export default TaskBox;
