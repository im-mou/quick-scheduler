import React, { useState } from 'react';

const ControlBar = function (props) {
    const [task, setTask] = useState('');
    const handleInputChange = function (e) {
        setTask({
            ...task,
            title : e.currentTarget.value
        })
    }
    const selectTimer = function(time) {
        setTask({
            ...task,
            timer: Math.ceil(time*60*60) // seconds
        })
    }
    const customTimer = function(e) {
        const timer = e.currentTarget.value;
        selectTimer(timer/60);
    }
    return (
        <div>
            <div>
                <input onChange={handleInputChange} type="text" placeholder="Create a new task" />
            </div>
            <div>
                <button onClick={()=>selectTimer(1)}>1h</button>
                <button onClick={()=>selectTimer(2)}>2h</button>
                <button onClick={()=>selectTimer(3)}>3h</button>
                <button onClick={()=>selectTimer(5)}>5h</button>
                <input onChange={customTimer} type="number" placeholder="Minutes..." />
            </div>
            <div>
                <button onClick={()=>props.createTask(task)}>Create</button>
            </div>
        </div>
    )
}

export default ControlBar;