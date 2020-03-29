import React, {useState} from 'react';
import {Icon, List, Switch} from 'antd';

const SettingsMenu = () => {
    let _sound = 0;
    let jsonObj = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage))
    // check if there is already a state in the localstorage
    if (localStorage.sound !== undefined) {
        _sound = JSON.parse(localStorage.sound);
    } else {
        localStorage.sound = JSON.stringify(_sound);
    }

    const [darkmode, setDarkmode] = useState(JSON.parse(localStorage.darkMode));
    // ToDo
    // const [sound, setSound] = useState(_sound);
    const toggleDarkMode = () => {
        let mode = 1;
        if (darkmode === mode) {
            mode = 0;
        }
        setDarkmode(mode);
        localStorage.darkMode = JSON.stringify(mode);
        document.body.classList[mode ? 'add' : 'remove']('dark');
    };

    // Todo: implement this
    // const toggleSound = () => {
    //     let _sound = 1;
    //     if (sound === _sound) {
    //         _sound = 0;
    //     }
    //     setSound(_sound);
    //     localStorage.sound = JSON.stringify(_sound);
    // };

    return (
        <List>
            <List.Item>
                <span style={{marginRight: 10}}>Dark Mode</span>
                <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={toggleDarkMode}
                    checked={!!darkmode}
                />
            </List.Item>
            <List.Item>
                <span>More options to come...</span>
            </List.Item>
            <List.Item>
                <a
                    href={jsonObj}
                    download={"quickschedule-"+Date.now()+".json"}
                >
                    Download my data (JSON)
                </a>
            </List.Item>
            <List.Item>
                <span>
                    <a
                        href="https://github.com/im-mou/quick-scheduler"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icon type="github" /> Github repo
                    </a>
                </span>
            </List.Item>
            <List.Item>
                <span>
                    <a
                        href="https://www.buymeacoffee.com/immou"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icon type="coffee" /> Buy me a cuppa coffee
                    </a>
                </span>
            </List.Item>
            <List.Item>
                <span className="copyright">© 2020 Mohsin Riaz</span>
            </List.Item>
            {/* Todo:
            <List.Item>
                <span style={{marginRight: 10}}>Beep on completion</span>
                <Switch
                    checked={!!sound}
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={toggleSound}
                />
            </List.Item> */}
        </List>
    );
};

export default SettingsMenu;
