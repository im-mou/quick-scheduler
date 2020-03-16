import EventEmitter from 'events';
class Events extends EventEmitter {
    constructor() {
        super();
    }

    activate(data) {
        this.emit('activate', data);
    }
}

export default Events;
