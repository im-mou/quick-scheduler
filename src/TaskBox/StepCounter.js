import React from 'react';
import {Button, Icon} from 'antd';

const StepCounter = props => {
    return (
        <div className="step-counter">
            <Button
                disabled={props.decDisabled || false}
                type="link"
                onClick={props.onDec}
            >
                <Icon type="minus-circle" />
                {props.decText || null}
            </Button>
            {props.children}
            <Button
                disabled={props.incDisabled || false}
                type="link"
                onClick={props.onInc}
            >
                <Icon type="plus-circle" />
                {props.incText || null}
            </Button>
        </div>
    );
};

export default StepCounter;
