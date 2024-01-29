"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const tools_1 = require("@kotori-bot/tools");
const fs_1 = require("fs");
class Client {
    ws;
    req;
    sessionId;
    sessionDate;
    constructor(ws, req, id) {
        this.ws = ws;
        this.req = req;
        this.sessionId = id;
        this.sessionDate = new Date();
    }
    send(data) {
        this.ws.send(JSON.stringify(data));
    }
    close() {
        this.ws.close();
    }
    subscribe(event) {
        this.send({
            body: {
                eventName: event
            },
            header: {
                requestId: (0, tools_1.getUuid)(),
                messagePurpose: 'subscribe',
                version: 1,
                messageType: 'commandRequest'
            }
        });
    }
    unsubscribe(event) {
        this.send({
            body: {
                eventName: event
            },
            header: {
                requestId: (0, tools_1.getUuid)(),
                messagePurpose: 'unsubscribe',
                version: 1,
                messageType: 'commandRequest'
            }
        });
    }
    run(cmd) {
        const command = typeof cmd === 'string' ? cmd : cmd.join(' ');
        this.send({
            body: {
                origin: {
                    type: 'player'
                },
                commandLine: command,
                version: 1
            },
            header: {
                requestId: (0, tools_1.getUuid)(),
                messagePurpose: 'commandRequest',
                version: 1,
                messageType: 'commandRequest'
            }
        });
    }
    chat(message) {
        this.run(['say', message]);
    }
    chatf(message, color, sender, target = "@s" /* CommandTarget.SELF */) {
        let text = color ? `${color}${message}` : message;
        text = sender ? `<${sender}>${text}` : text;
        this.run([
            'tellraw',
            target,
            JSON.stringify({
                rawtext: [{ text }]
            })
        ]);
    }
    func(file) {
        if (!(0, fs_1.existsSync)(file))
            return false;
        (0, fs_1.readFileSync)(file)
            .toString()
            .split('\n')
            .forEach((cmd) => this.run(cmd));
        return true;
    }
}
exports.Client = Client;
