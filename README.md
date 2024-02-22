# Mcwss [![npm package](https://badgen.net/npm/v/mcwss)](https://npmjs.com/package/mcwss) [![wakatime](https://wakatime.com/badge/user/018dc603-712a-4205-a226-d4c9ccd0d02b/project/018dceb3-4749-44d6-93be-b3e581301a74.svg)](https://wakatime.com/badge/user/018dc603-712a-4205-a226-d4c9ccd0d02b/project/018dceb3-4749-44d6-93be-b3e581301a74)

> The project is refactory version for version of three years (2021) ago base on TypeScript.

A simple Minecraft Bedrock Edition websocket server framework, help developer to setup websocket server faster for Minecraft or your self package depend on it.Its core `Mcwss` base a events emiter and provide many of events which can be listened.In addition,it provides `Client` instance object to interact with every clent.

## 🧊 Usage

> What? You donot know how to install Node.js program? Are you kidding me? Please find [Google Search](https://google.com) to help you.

Base on program cli to start:

```sh
mcwss
```

For C(~~Z~~)hinese(English understanding hard population):

```sh
mcwss --lang zh_CN
```

Start your Minecraft Bedrock Edition and input commands:

```sh
/wsserver ws://localhost:1
# or:
/connect ws://localhost:1
```

Test a few:

```sh
*/help
*/helph
```

### Options

- `--port [num]` Set websocket server port
- `--mode [type]` Set logger level, debug or build
- `--lang [locale]` Set view language, en_US, ja_JP, zh_TW, zh_CN
- `-v, --version` Display version number
- `-h, --help` Display this message

Example:

```sh
mcwss --port 2333 --mode debug --lang ja_JP
```

### built-in commands

- `*/help` Show Mcwss command help
- `*/connect` Show WebSocket connection time
- `*/about` Show about information§r
- `*/clears` Clear chat content§r
- `*/func <path>` Execute mcfunction on server§r
- `*/helph` Show hidden command help§r",

Game hidden Command:

- `./closewebsocket` Close websocket connection§r
- `./gettopsolidblock <x> <y> <z>` Get top solid block coordinates§r
- `./querytarget <selector>` Get precise float coordinates of entity§r
- `./agent` Mascot§r
- `./enableencryption` Unknown§r
- `./closechat` Close chat§r
- `./geteduclientinfo` Get version info§r
- `./getlocalplayername` Return player name§r

## 🎯 Events

Lifecycle Events:

- ready
- dispose
- error
- connection
- message
- close

Minecraft Events:

- block_broken
- block_placed
- end_of_day
- entity_spawned
- item_acquired
- item_crafted
- item_destroyed
- item_smelted
- item_used
- jukebox_used
- mob_interacted
- mob_killed
- player_bounced
- player_died
- player_message
- player_teleported
- player_transform
- player_travelled
- unknown_minecraft_event
- command_response

## 🚀 Class

### Mcwss

- `start(): void` Start a websocket server
- `stop(): void` Stop a websocket server

Extends `Events`:

- `emit<T extends keyof EventsList>(type: T, ...data: [...Parameters<EventsList[T]>]): void` Emit a event
- `parallel<T extends keyof EventsList>(type: T, ...data: [...Parameters<EventsList[T]>]): Promise<void>` Emit a event asynchronous
- `on<T extends keyof EventsList>(type: T, callback: EventsList[T]): void` Listen a event
- `once<T extends keyof EventsList>(type: T, callback: EventsList[T]): void` Listen a event once
- `off<T extends keyof EventsList>(type: T, callback: EventsList[T]): void` Cancel to listen a event
- `offAll<T extends keyof EventsList>(type: T): void` Cancel to listen all events

### Client

- `req: IncomingMessage` Client websocket object
- `sessionId: number` Connection identify at `Mcwss`
- `sessionDate: Date` Connection setup time
- `send(data: SendPacket): void` Send a packet to client
- `close(): void` Close connection with client
- `subscribe(event: MinecraftEvents): void` Subscribe a minecraft event
- `unsubscribe(event: MinecraftEvents): void` Unsubscribe a minecraft event
- `run(cmd: string | string[]): void` Run a or many of command to client
- `chat(message: string): void` Send a normal message to client (Base for `/say`)
- `chatf(message: string, color?: TextColor, sender?: string, target: CommandTarget = CommandTarget.SELF): void` Send a advanced message to client (Base for `/tellraw`)
- `func(file: string): void` Run a `.mcfunction` file to client

```typescript
const enum TextColor {
  GREEN = '§a',
  RED = '§c',
  BLUE = '§b',
  YELLOW = '§e'
}

const enum CommandTarget {
  ALL = '@a',
  SELF = '@s',
  RANDOM = '@r',
  EVERY = '@e',
  NEAR = '@p'
}
```

## 🧩 Internationalization

Supports languages:

```typescript

```

## 🌰 Example

Setup your self program or package base on Mcwss, refer to `src/utils/line.ts` for more information.

```typescript
import Mcwss from 'mcwss';
import { log, error } from 'console';

const mcwss = new Mcwss({ port: 2333 });

/* events register */
mcwss.on('ready', () => log(`WebSocketServer started at ws://localehost:${port} `));

mcwss.on('dispose', () => log('WebSocketServer stopped'));

mcwss.on('error', (data) =>
  error(data.client ? `[Client:${data.client.sessionId}]` : '[Server]', data.error.name, data.error.message)
);

mcwss.on('connection', (data) =>
  log(`[Client:${data.client.sessionId}]`, 'new connection from', data.client.req.socket.remoteAddress)
);

mcwss.on('close', (data) => {
  if (data.raw) {
    log(`[Client:${data.raw.client.sessionId}]`, 'Closing in progress code:', data.raw.code);
    return;
  }
  log('WebSocketServer is closeing...');
});

mcwss.on('block_broken', (data) => {
  const { block, player, tool } = data.body;
  /* ... */
});

mcwss.on('end_of_day', (data) => {
  const { player } = data.body;
  /* ... */
});

/* ... */

mcwss.start();
```

## 📜 License

Comply with The GNU General Public License v3.0 open-source license.
