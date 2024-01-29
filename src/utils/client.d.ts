/// <reference types="node" />
import { IncomingMessage } from 'http';
import WebSocket from 'ws';
import { MinecraftEvents } from '../types/events';
export declare const enum TextColor {
    GREEN = "\u00A7a",
    RED = "\u00A7c",
    BLUE = "\u00A7b",
    YELLOW = "\u00A7e"
}
export declare const enum CommandTarget {
    ALL = "@a",
    SELF = "@s",
    RANDOM = "@r",
    EVERY = "@e",
    NEAR = "@p"
}
type MessagePurpose = 'subscribe' | 'unsubscribe' | 'commandRequest';
interface SendPacketSubscribe {
    body: {
        eventName: MinecraftEvents;
    };
    header: {
        requestId: string;
        messagePurpose: MessagePurpose;
        version: number;
        messageType: MessagePurpose;
    };
}
interface SendPacketCommand {
    body: {
        origin: {
            type: string;
        };
        commandLine: string;
        version: number;
    };
    header: {
        requestId: string;
        messagePurpose: MessagePurpose;
        version: number;
        messageType: MessagePurpose;
    };
}
type SendPacket = SendPacketSubscribe | SendPacketCommand;
export declare class Client {
    private ws;
    req: IncomingMessage;
    sessionId: number;
    sessionDate: Date;
    constructor(ws: WebSocket, req: IncomingMessage, id: number);
    send(data: SendPacket): void;
    close(): void;
    subscribe(event: MinecraftEvents): void;
    unsubscribe(event: MinecraftEvents): void;
    run(cmd: string | string[]): void;
    chat(message: string): void;
    chatf(message: string, color?: TextColor, sender?: string, target?: CommandTarget): void;
    func(file: string): boolean;
}
export {};
