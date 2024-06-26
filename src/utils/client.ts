import { existsSync, readFileSync } from 'fs';
import { IncomingMessage } from 'http';
import WebSocket from 'ws';
import { MinecraftEvents } from '../types/events';
import { randomUUID } from 'crypto';

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

  public req: IncomingMessage;

  public sessionId: number;

  public sessionDate: Date;

  public constructor(ws: WebSocket, req: IncomingMessage, id: number) {
    this.ws = ws;
    this.req = req;
    this.sessionId = id;
    this.sessionDate = new Date();
  }

  public send(data: SendPacket) {
    this.ws.send(JSON.stringify(data));
  }

  public close() {
    this.ws.close();
  }

  public subscribe(event: MinecraftEvents) {
    this.send({
      body: {
        eventName: event
      },
      header: {
        requestId: randomUUID(),
        messagePurpose: 'subscribe',
        version: 1,
        messageType: 'commandRequest'
      }
    });
  }

  public unsubscribe(event: MinecraftEvents) {
    this.send({
      body: {
        eventName: event
      },
      header: {
        requestId: randomUUID(),
        messagePurpose: 'unsubscribe',
        version: 1,
        messageType: 'commandRequest'
      }
    });
  }

  public run(cmd: string | string[]) {
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
        requestId: randomUUID(),
        messagePurpose: 'commandRequest',
        version: 1,
        messageType: 'commandRequest'
      }
    });
  }

  public chat(message: string) {
    this.run(['say', message]);
  }

  public chatf(message: string, color?: TextColor, sender?: string, target: CommandTarget = CommandTarget.SELF) {
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

  public func(file: string) {
    if (!existsSync(file)) return false;
    readFileSync(file)
      .toString()
      .split('\n')
      .forEach((cmd) => this.run(cmd));
    return true;
  }
}
