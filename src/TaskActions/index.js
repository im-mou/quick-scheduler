import dispatcher from '../Utils/Dispatcher';
import {ACTION} from './types';


export function createTask(data) {
    dispatcher.dispatch({
        type: ACTION.CREATE,
        data,
    })
}

export function playTask(data) {
    dispatcher.dispatch({
        type: ACTION.PLAY,
        data,
    })
}

export function resumeTask(data) {
    playTask(data);
}

export function pauseTask(data) {
    dispatcher.dispatch({
        type: ACTION.PAUSE,
        data,
    })
}

export function completeTask(data) {
    dispatcher.dispatch({
        type: ACTION.COMPLETE,
        data,
    })
}

export function sendToTrashTask(data) {
    dispatcher.dispatch({
        type: ACTION.TRASH,
        data,
    })
}

export function deleteTask(data) {
    dispatcher.dispatch({
        type: ACTION.DELETE,
        data,
    })
}

export function resetTask(data) {
    dispatcher.dispatch({
        type: ACTION.RESET,
        data,
    })
}

export function editTask(data) {
    dispatcher.dispatch({
        type: ACTION.EDIT,
        data,
    })
}

export function saveEditTask(data, newData) {
    dispatcher.dispatch({
        type: ACTION.SAVE_EDIT,
        data,
        newData,
    })
}
export function cancleEditTask(data) {
    dispatcher.dispatch({
        type: ACTION.CANCLE_EDIT,
        data,
    })
}