import WebSocket from 'ws';
import { Client } from './client';

export interface EventDataBase<T extends keyof EventsList> {
  type: T;
}

interface EventDataReady extends EventDataBase<'ready'> {
  server: WebSocket.Server;
}

interface EventDataDispose extends EventDataBase<'dispose'> {}

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

export class Events {
  protected eventStack: { type: keyof EventsList; callback: EventCallback<keyof EventsList> }[] = [];

  emit<T extends keyof EventsList>(type: T, data: Omit<EventsList[T], 'type'>) {
    const session = Object.assign(data, { type }) as unknown as EventsList[T];
    this.eventStack.filter((el) => el.type === type).forEach((el) => el.callback(session));
  }

  on<T extends keyof EventsList>(type: T, callback: EventCallback<T>) {
    this.eventStack.push({ type, callback: callback as EventCallback<keyof EventsList> });
  }

  once<T extends keyof EventsList>(type: T, callback: EventCallback<T>) {
    const removeSelf: EventCallback<T> = (data) => {
      const handleArr = this.eventStack.filter((el) => el.type !== type && el.callback !== removeSelf);
      this.eventStack = handleArr;
      callback(data);
    };
    this.on(type, removeSelf);
  }

  off<T extends keyof EventsList>(type: T, callback: EventCallback<T>) {
    const handleArr = this.eventStack.filter((el) => el.callback !== callback && el.type !== type);
    this.eventStack = handleArr;
  }

  offAll<T extends keyof EventsList>(type: T) {
    const handleArr = this.eventStack.filter((el) => el.type !== type);
    this.eventStack = handleArr;
  }
}

export default Events;
