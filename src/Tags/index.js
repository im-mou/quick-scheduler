import React from 'react';
import {Slider, Divider} from 'antd';
import {Icon, Tag, Input, Tooltip, Row, Col, Button} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {motion, AnimatePresence} from 'framer-motion';

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

        this.state = {
            tags: ['Unremovable', 'Tag 2', 'Tag 3'],
            inputVisible: false,
            inputValue: '',
            editInputIndex: -1,
            editInputValue: '',
        };
    }

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({tags});
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
        console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };

    handleEditInputChange = e => {
        this.setState({editInputValue: e.target.value});
    };

    handleEditInputConfirm = () => {
        this.setState(({tags, editInputIndex, editInputValue}) => {
            const newTags = [...tags];
            newTags[editInputIndex] = editInputValue;

            return {
                tags: newTags,
                editInputIndex: -1,
                editInputValue: '',
            };
        });
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
        } = this.state;
        return (
            <AnimatePresence initial={true}>
                {/* {this.props.visible && ( */}
                {true && (
                    <motion.section
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={variants}
                        transition={transition}
                    >
                        <Row className="tags-wrapper">
                            <Col span={22} className="tags-container">
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
                                            className="edit-tag"
                                            key={tag}
                                            closable={index !== 0}
                                            onClose={() =>
                                                this.handleClose(tag)
                                            }
                                        >
                                            <span
                                                onDoubleClick={e => {
                                                    if (index !== 0) {
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
                                                    }
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
                            </Col>

                            <Col span={2} className="tags-close">
                                <Button
                                    icon={<Icon type="close-circle" />}
                                />
                            </Col>
                        </Row>
                    </motion.section>
                )}
            </AnimatePresence>
        );
    }
}

export default Tags;
