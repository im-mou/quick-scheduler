import React from 'react';
import TimeSlider from '../TimeSlider';
import Tags from '../Tags';
import {Input, Row, Col, Button, Icon} from 'antd';
import Util from '../Utils';
import Anim from '../Utils/animations';
import {TimeDialSelector, DefaultTimeMenu, NewTaskActions} from './Components';
import {
    TASK_ACTIONS_ICONS as ICON,
    TASK_ACTIONS as ACTION,
    TASK_STATES as STATE,
} from '../Utils/Constants';
import classNames from 'classnames';

// Less hours options if mobile
const mobile = Util.mobileCheck();
const defaultTimeOptions = mobile ? [1, 2, 3] : [1, 2, 3, 5];
const actionStyle = {
    default: {
        paddingLeft: 8,
        paddingRight: 0,
    },
    last: {
        paddingLeft: 8,
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
            mode = props.mode || STATE.NEW,
            selectedTags = [],
            initialDate = undefined;

        // props.data contains the task object if mode=edit
        // check if there is initial data present
        if (props.data) {
            initialTitle = props.data.title;
            initialTime = props.data.time;
            initialDate = props.data.date;
            selectedTags = props.data.tags;
        }

        this.state = {
            title: initialTitle,
            hours: initialTime.h,
            minutes: initialTime.m,
            expanded: expanded,
            pop: {h: false, m: false},
            mode: mode,
            date: initialDate,
            tags: [],
            tagsPanelOpen: false,
            inputFocused: false,
            tagButtonHover: false,
            selectedTags: selectedTags,
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
            date: this.state.date,
            tags: this.state.tags,
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

    selectDate = dateString => {
        this.setValue('date', dateString);
    };

    closeTagsPanel = () => {
        if (this.state.tagsPanelOpen) {
            this.setValue('inputFocused', false);
        }
        this.setValue('tagsPanelOpen', !this.state.tagsPanelOpen);
    };

    selectTags = tags => {
        this.setState({tags});
    };

    render() {
        const {
            title,
            hours,
            minutes,
            expanded,
            pop,
            mode,
            date,
            tagsPanelOpen,
            inputFocused,
            tagButtonHover,
            selectedTags,
        } = this.state;
        const inEditMode = mode === STATE.EDITING;
        const newTaskActions = {
            style: [actionStyle.default, actionStyle.last],
            expanded: expanded,
            hours: hours,
            minutes: minutes,
            date: {
                onDateChange: this.selectDate,
                defaultDate: date,
            },
        };

        return (
            <div className={'new-task ' + mode}>
                <React.Fragment>
                    <Input
                        className="newtask-input"
                        size="large"
                        value={title}
                        onChange={this.handleTitleChange}
                        onKeyDown={this.handleKeyDown}
                        onFocus={() => this.setValue('inputFocused', true)}
                        onBlur={() =>
                            this.setValue(
                                'inputFocused',
                                tagButtonHover || tagsPanelOpen
                            )
                        }
                        type="text"
                        placeholder="Create a new task"
                    />
                </React.Fragment>
                <Button
                    hidden={!inputFocused}
                    shape="circle"
                    className={classNames('tags-toggle', {open: tagsPanelOpen})}
                    onClick={this.closeTagsPanel}
                    onMouseEnter={() => this.setValue('tagButtonHover', true)}
                    onMouseLeave={() => this.setValue('tagButtonHover', false)}
                >
                    {!tagsPanelOpen ? (
                        <Icon type="tags" />
                    ) : (
                        <Icon type="close-circle" />
                    )}
                </Button>
                <Tags
                    visible={tagsPanelOpen}
                    selectedTags={selectedTags}
                    onTagsChange={this.selectTags}
                />
                <Row>
                    <Col span={mobile ? 12 : expanded ? 10 : 12}>
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

                    <Col
                        span={mobile ? 12 : expanded ? 14 : 12}
                        className="newtask-actions right"
                    >
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
                                text={mobile ? null : 'Create'}
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
                                text={mobile ? null : 'Save'}
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
