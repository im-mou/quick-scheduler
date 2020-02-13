import React from 'react';

const Items = function (props) {
    return (
        (props.tasks || []).map((task, index) => (
            <div key={index} className={"item "+props.type}>
                <div className="pre-header">{task.timer/60/60 + 'h'}</div>
                <div className="title">{task.title}</div>
                <div className="footer">
                    <div className="timer">{task.timer/60}</div>
                </div>
            </div>
        ))
    );
}

export default Items;