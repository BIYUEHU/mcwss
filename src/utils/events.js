"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
class Events {
    eventStack = [];
    emit(type, data) {
        const session = Object.assign(data, { type });
        this.eventStack.filter((el) => el.type === type).forEach((el) => el.callback(session));
    }
    on(type, callback) {
        this.eventStack.push({ type, callback: callback });
    }
    once(type, callback) {
        const removeSelf = (data) => {
            const handleArr = this.eventStack.filter((el) => el.type !== type && el.callback !== removeSelf);
            this.eventStack = handleArr;
            callback(data);
        };
        this.on(type, removeSelf);
    }
    off(type, callback) {
        const handleArr = this.eventStack.filter((el) => el.callback !== callback && el.type !== type);
        this.eventStack = handleArr;
    }
    offAll(type) {
        const handleArr = this.eventStack.filter((el) => el.type !== type);
        this.eventStack = handleArr;
    }
}
exports.Events = Events;
exports.default = Events;
