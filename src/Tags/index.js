import React from 'react';
import {Tag, Input, Tooltip, Row, Col, Typography} from 'antd';
import {PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import {motion, AnimatePresence} from 'framer-motion';
import classNames from 'classnames';

const {Text} = Typography;

const variants = {
    open: {opacity: 1, height: 'auto'},
    collapsed: {opacity: 0, height: 0},
};

const transition = {
    duration: 0.3,
    ease: [0.04, 0.62, 0.23, 0.98],
};

class Tags extends React.Component {
    constructor(props) {
        super(props);

        let tags = [];

        // check if there is already tags in the localstorage
        if (localStorage.tags !== undefined) {
            tags = JSON.parse(localStorage.tags);
        } else {
            localStorage.tags = JSON.stringify([]);
        }

        this.state = {
            tags: tags,
            selectedTags: [],
            inputVisible: false,
            inputValue: '',
            editInputIndex: -1,
            editInputValue: '',
            showDelete: false,
        };
    }

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        const selectedTags = this.state.selectedTags.filter(
            tag => tag !== removedTag
        );
        localStorage.tags = JSON.stringify(tags);
        this.setState({tags});
        this.setState({selectedTags});

        // send data to parent component
        this.props.onTagsChange(selectedTags);
    };

    showInput = () => {
        this.setState({inputVisible: true}, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({inputValue: e.target.value});
    };

    handleInputConfirm = () => {
        const {inputValue} = this.state;
        let {tags} = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState(
            {
                tags,
                inputVisible: false,
                inputValue: '',
            },
            () => (localStorage.tags = JSON.stringify(tags))
        );
    };

    handleEditInputChange = e => {
        this.setState({editInputValue: e.target.value});
    };

    handleEditInputConfirm = () => {
        this.setState(({tags, editInputIndex, editInputValue}) => {
            const newTags = [...tags];
            newTags[editInputIndex] = editInputValue;

            localStorage.tags = JSON.stringify(newTags);

            return {
                tags: newTags,
                editInputIndex: -1,
                editInputValue: '',
            };
        });
    };

    toggleSelect = _tag => {
        let selectedTags = [];
        if (this.state.selectedTags.indexOf(_tag) > -1) {
            selectedTags = this.state.selectedTags.filter(tag => tag !== _tag);
        } else {
            selectedTags = [...this.state.selectedTags, _tag];
        }
        this.setState({selectedTags});

        // send data to parent component
        this.props.onTagsChange(selectedTags);
    };

    saveInputRef = input => (this.input = input);

    saveEditInputRef = input => (this.editInput = input);

    render() {
        const {
            tags,
            inputVisible,
            inputValue,
            editInputIndex,
            editInputValue,
            selectedTags,
            showDelete,
        } = this.state;

        return (
            <AnimatePresence initial={true}>
                {this.props.visible && (
                    <motion.section
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={variants}
                        transition={transition}
                    >
                        <Row className="tags-wrapper">
                            <Col className="tags-container">
                                {tags.length ? (
                                    <Tag
                                        className="site-tag-delete"
                                        color={showDelete && 'red'}
                                        onClick={() =>
                                            this.setState({
                                                showDelete: !showDelete,
                                            })
                                        }
                                    >
                                        <DeleteOutlined />
                                    </Tag>
                                ) : null}

                                {tags.map((tag, index) => {
                                    if (editInputIndex === index) {
                                        return (
                                            <Input
                                                ref={this.saveEditInputRef}
                                                key={tag}
                                                size="small"
                                                className="tag-input"
                                                value={editInputValue}
                                                onChange={
                                                    this.handleEditInputChange
                                                }
                                                onBlur={
                                                    this.handleEditInputConfirm
                                                }
                                                onPressEnter={
                                                    this.handleEditInputConfirm
                                                }
                                            />
                                        );
                                    }

                                    const isLongTag = tag.length > 20;

                                    const tagElem = (
                                        <Tag
                                            className={classNames('edit-tag')}
                                            color={
                                                selectedTags.indexOf(tag) >
                                                    -1 && 'blue'
                                            }
                                            key={tag}
                                            closable={showDelete}
                                            onClick={() =>
                                                this.toggleSelect(tag)
                                            }
                                            onClose={() =>
                                                this.handleClose(tag)
                                            }
                                        >
                                            <span
                                                onDoubleClick={e => {
                                                    this.setState(
                                                        {
                                                            editInputIndex: index,
                                                            editInputValue: tag,
                                                        },
                                                        () => {
                                                            this.editInput.focus();
                                                        }
                                                    );
                                                    e.preventDefault();
                                                }}
                                            >
                                                {isLongTag
                                                    ? `${tag.slice(0, 20)}...`
                                                    : tag}
                                            </span>
                                        </Tag>
                                    );
                                    return isLongTag ? (
                                        <Tooltip title={tag} key={tag}>
                                            {tagElem}
                                        </Tooltip>
                                    ) : (
                                        tagElem
                                    );
                                })}
                                {inputVisible && (
                                    <Input
                                        ref={this.saveInputRef}
                                        type="text"
                                        size="small"
                                        className="tag-input"
                                        value={inputValue}
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleInputConfirm}
                                        onPressEnter={this.handleInputConfirm}
                                    />
                                )}
                                {!inputVisible && (
                                    <Tag
                                        className="site-tag-plus"
                                        onClick={this.showInput}
                                    >
                                        <PlusOutlined /> New Tag
                                    </Tag>
                                )}
                                <Text disabled>Double click tags to edit</Text>
                            </Col>
                        </Row>
                    </motion.section>
                )}
            </AnimatePresence>
        );
    }
}

export default Tags;
