import { getUuid } from '@kotori-bot/tools';
import { existsSync, readFileSync } from 'fs';
import { IncomingMessage } from 'http';
import WebSocket from 'ws';
import { MinecraftEvents } from '../types/events';

export const enum TextColor {
  GREEN = '§a',
  RED = '§c',
  BLUE = '§b',
  YELLOW = '§e'
}

export const enum CommandTarget {
  ALL = '@a',
  SELF = '@s',
  RANDOM = '@r',
  EVERY = '@e',
  NEAR = '@p'
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

export class Client {
  private ws: WebSocket;

  req: IncomingMessage;

  sessionId: number;

  sessionDate: Date;

  constructor(ws: WebSocket, req: IncomingMessage, id: number) {
    this.ws = ws;
    this.req = req;
    this.sessionId = id;
    this.sessionDate = new Date();
  }

  send(data: SendPacket) {
    this.ws.send(JSON.stringify(data));
  }

  close() {
    this.ws.close();
  }

  subscribe(event: MinecraftEvents) {
    this.send({
      body: {
        eventName: event
      },
      header: {
        requestId: getUuid(),
        messagePurpose: 'subscribe',
        version: 1,
        messageType: 'commandRequest'
      }
    });
  }

  unsubscribe(event: MinecraftEvents) {
    this.send({
      body: {
        eventName: event
      },
      header: {
        requestId: getUuid(),
        messagePurpose: 'unsubscribe',
        version: 1,
        messageType: 'commandRequest'
      }
    });
  }

  run(cmd: string | string[]) {
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
        requestId: getUuid(),
        messagePurpose: 'commandRequest',
        version: 1,
        messageType: 'commandRequest'
      }
    });
  }

  chat(message: string) {
    this.run(['say', message]);
  }

  chatf(message: string, color?: TextColor, sender?: string, target: CommandTarget = CommandTarget.SELF) {
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

  func(file: string) {
    if (!existsSync(file)) return false;
    readFileSync(file)
      .toString()
      .split('\n')
      .forEach((cmd) => this.run(cmd));
    return true;
  }
}
