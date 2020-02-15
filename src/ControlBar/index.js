import React, { useState } from 'react';
import { Radio, Button} from "antd";

const ControlBar = function (props) {
    const [title, setTitle] = useState('');
    const [timer, setTimer] = useState(0);
    const handleInputChange = function (e) {
        setTitle(e.currentTarget.value)
    }
    const selectTimer = function (time) {
        setTimer(Math.ceil(time * 60 * 60) /* seconds */)
    }
    const customTimer = function (e) {
        const timer = e.currentTarget.value;
        selectTimer(timer / 60);
    }
    const createTask = function () {
        props.createTask({ title: title, timer: timer })
        setTitle('')
        setTimer(0)
    }
    return (
        <div>
            <div>
                <input value={title} onChange={handleInputChange} type="text" placeholder="Create a new task" />
            </div>
            <div>
                {/* <button onClick={() => selectTimer(1)}>1h</button>
                <button onClick={() => selectTimer(2)}>2h</button>
                <button onClick={() => selectTimer(3)}>3h</button>
                <button onClick={() => selectTimer(5)}>5h</button>
                <input onChange={customTimer} type="number" placeholder="Minutes..." /> */}
                <Radio.Group defaultValue="a">
                    <Radio.Button value="a">1h</Radio.Button>
                    <Radio.Button value="b">2h</Radio.Button>
                    <Radio.Button value="c">3h</Radio.Button>
                    <Radio.Button value="d">5h</Radio.Button>
                </Radio.Group>
            </div>
            <div>
                <Button onClick={createTask}>Create</Button>
            </div>
        </div>
    )
}

export default ControlBar;


