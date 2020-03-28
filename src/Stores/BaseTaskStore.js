import EventEmitter from 'events';

class BaseTaskStore extends EventEmitter {
    constructor(storeName, freq, storeData) {
        super();
        this.store = new Array();
        this.tasks = new Array();
        this.storeName = storeName;
        this.freq = freq;

        // check if there is already a state in the localstorage
        if (localStorage[storeName] !== undefined) {
            this.store = JSON.parse(localStorage[storeName]);
            this.tasks = this.store.tasks;
        } else {
            localStorage[storeName] = JSON.stringify({
                tasks: new Array(),
                ...storeData || {},
            });
        }
    }

    getStore = () => this.store;
    getTasks = () => this.tasks;

    setStore = (data) => {
        const { store } = this;
        localStorage[this.storeName] = JSON.stringify({store, ...data});
    };

    broadcast(enable) {
        if (enable || enable === undefined) this.emit(this.freq);
    }
}

export default BaseTaskStore;
