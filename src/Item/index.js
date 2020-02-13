import React, { useState } from 'react';

const Item = function (props) {
    const [task, setTask] = useState('');
    return props.tasks.map(task => {
        <div>{task.title}</div>
    });
}

export default Item;