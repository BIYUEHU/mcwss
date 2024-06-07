import WebSocket from 'ws';
import { Events } from 'fluoro';
import { TsuError } from 'tsukiko';
import { EventsList } from './utils/events';
import { MinecraftEvents, eventDataMinecraftBaseSchema } from './types/events';
import { Client } from './utils/client';
import { ALL_EVENTS } from './const';

interface McwssConfig {
  events?: Set<MinecraftEvents>;
  autoRegister?: boolean;
  autoClearEvents?: boolean;
  server: WebSocket.Server | number;
}

type EventsMappingType<T> = {
  [K in keyof T]: T[K] extends (...args: any) => unknown ? T[K] : never;
};

export class Mcwss extends Events<EventsList> {
  private server?: WebSocket.Server;

  private clients: { [propName: string]: Client } = {};

  private config: Required<McwssConfig>;

  private listSelf = this[(() => 'list')() as keyof this] as Map<
    keyof EventsMappingType<EventsList>,
    Set<EventsMappingType<EventsList>[keyof EventsMappingType<EventsList>]>
  >;

  public constructor(config: McwssConfig) {
    super();
    this.config = { events: new Set(), autoRegister: true, autoClearEvents: true, ...config };
    this.register();
  }

  private register() {
    this.on('connection', (data) => {
      if (this.config.autoClearEvents) ALL_EVENTS.forEach((eventName) => data.client.unsubscribe(eventName));
      this.listSelf.forEach((_, key) => {
        const handle = key
          .split('_')
          .map((str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`)
          .join('');
        if (ALL_EVENTS.includes(handle)) this.config.events.add(handle);
      });
      this.config.events.forEach((eventName) => data.client.subscribe(eventName));
    });
    this.on('message', (data) => this.handle(data));
  }

  private handle(data: Parameters<EventsList['message']>[0]) {
    type OriginEvents = 'ready' | 'dispose' | 'error' | 'connection' | 'message' | 'close';
    type MinecraftEvents = Exclude<keyof EventsList, OriginEvents>;

    try {
      const handle = JSON.parse(data.raw.toString());
      if (handle.header && typeof handle.header === 'object' && handle.header.messagePurpose === 'commandResponse') {
        this.emit('command_response', { ...handle, client: data.client });
        return;
      }
      eventDataMinecraftBaseSchema.parse(handle);
      this.emit(
        handle.header.eventName
          .replace(/([a-z])([A-Z])/g, '$1_$2')
          .toLowerCase()
          .replace(/[-\s]/g, '_') as MinecraftEvents,
        { ...handle, client: data.client }
      );
    } catch (e) {
      if (e instanceof TsuError) {
        this.emit('unknown_minecraft_event', {
          ...JSON.parse(data.raw.toString()),
          client: data.client
        });
        return;
      }
      this.emit('error', {
        error: e instanceof Error ? e : new Error()
      });
    }
  }

  public start() {
    this.server =
      typeof this.config.server === 'number' ? new WebSocket.Server({ port: this.config.server }) : this.config.server;
    this.server?.on('error', (error) => this.emit('error', { error }));
    this.server?.on('connection', (ws, req) => {
      const id = Object.keys(this.clients).length + 1;
      const client = new Client(ws, req, id);
      this.clients[id] = client;
      this.emit('connection', { client });
      ws.on('error', (error) => this.emit('error', { client, error }));
      ws.on('message', (raw) => this.emit('message', { raw, client }));
      ws.on('close', (code) => this.emit('close', { raw: { code, client } }));
    });
    this.server?.on('close', () => this.emit('close', {}));
    this.emit('ready', { server: this.server });
  }

  public stop() {
    if (!this.server?.close) return;
    this.server.close();
    this.emit('dispose', {});
  }
}

export default Mcwss;
