import WebSocket from 'ws';
import { Client } from './client';

interface EventDataReady {
  server: WebSocket.Server;
}

interface EventDataDispose {}

interface EventDataError {
  client?: Client;
  error: Error;
}

interface EventDataConnection {
  client: Client;
}

interface EventDataMessage {
  raw: WebSocket.RawData;
  client: Client;
}

interface EventDataClose {
  raw?: {
    code: number;
    client: Client;
  };
}

export interface EventsList {
  ready(data: EventDataReady): void;
  dispose(data: EventDataDispose): void;
  error(data: EventDataError): void;
  connection(data: EventDataConnection): void;
  message(data: EventDataMessage): void;
  close(data: EventDataClose): void;
}
