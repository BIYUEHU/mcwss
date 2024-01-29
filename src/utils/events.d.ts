import WebSocket from 'ws';
import { Client } from './client';
export interface EventDataBase<T extends keyof EventsList> {
    type: T;
}
interface EventDataReady extends EventDataBase<'ready'> {
    server: WebSocket.Server;
}
interface EventDataDispose extends EventDataBase<'dispose'> {
}
interface EventDataError extends EventDataBase<'error'> {
    client?: Client;
    error: Error;
}
interface EventDataConnection extends EventDataBase<'connection'> {
    client: Client;
}
interface EventDataMessage extends EventDataBase<'message'> {
    raw: WebSocket.RawData;
    client: Client;
}
interface EventDataClose extends EventDataBase<'close'> {
    raw?: {
        code: number;
        client: Client;
    };
}
export interface EventsList {
    ready: EventDataReady;
    dispose: EventDataDispose;
    error: EventDataError;
    connection: EventDataConnection;
    message: EventDataMessage;
    close: EventDataClose;
}
type EventCallback<T extends keyof EventsList> = (data: EventsList[T]) => void;
export declare class Events {
    protected eventStack: {
        type: keyof EventsList;
        callback: EventCallback<keyof EventsList>;
    }[];
    emit<T extends keyof EventsList>(type: T, data: Omit<EventsList[T], 'type'>): void;
    on<T extends keyof EventsList>(type: T, callback: EventCallback<T>): void;
    once<T extends keyof EventsList>(type: T, callback: EventCallback<T>): void;
    off<T extends keyof EventsList>(type: T, callback: EventCallback<T>): void;
    offAll<T extends keyof EventsList>(type: T): void;
}
export default Events;
