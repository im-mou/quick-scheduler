import React from 'react';
import Items from '../Items';

const Tasks = function (props) {
    return (
        <div className="section">
            <div className="header">{props.header}</div>
            <div className="items">
                <Items {...props} />
            </div> 
        </div>
    );
}

export default Tasks;