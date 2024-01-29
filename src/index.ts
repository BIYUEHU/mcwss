import WebSocket from 'ws';
import Logger from '@kotori-bot/logger';
import { stringTemp } from '@kotori-bot/tools';
import { TsuError } from 'tsukiko';
import { join } from 'path';
import { readFileSync } from 'fs';
import Events, { EventsList } from './utils/events';
import { MinecraftEvents, eventDataMinecraftBaseSchema } from './types/events';
import { Client, TextColor } from './utils/client';
import { ALL_EVENTS } from './const';

interface McwssConfig {
  port: number;
  events?: Set<MinecraftEvents>;
  autoRegister?: boolean;
  autoClearEvents?: boolean;
}

export class Mcwss extends Events {
  private server?: WebSocket.Server;

  private clients: { [propName: string]: Client } = {};

  private config: Required<McwssConfig>;

  constructor(config: McwssConfig) {
    super();
    this.config = { events: new Set(), autoRegister: true, autoClearEvents: true, ...config };
    this.register();
  }

  private register() {
    this.on('connection', (data) => {
      if (this.config.autoClearEvents) ALL_EVENTS.forEach((eventName) => data.client.unsubscribe(eventName));
      this.eventStack.forEach((el) => {
        const handle = el.type
          .split('_')
          .map((str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`)
          .join('');
        if (ALL_EVENTS.includes(handle)) this.config.events.add(handle);
      });
      this.config.events.forEach((eventName) => data.client.subscribe(eventName));
    });
    this.on('message', (data) => this.handle(data));
  }

  private handle(data: EventsList['message']) {
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

  start() {
    this.server = new WebSocket.Server({ port: this.config.port });
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

  stop() {
    if (!this.server?.close) return;
    this.server.close();
    this.emit('dispose', {});
  }
}

export default Mcwss;

const PORT = 1;
const mcwss = new Mcwss({
  port: PORT
});

mcwss.on('ready', () => {
  Logger.info(`WebSocketServer started at ws://localehost:${PORT} `);
});

mcwss.on('dispose', () => Logger.info('WebSocketServer stopped'));

mcwss.on('error', (data) =>
  Logger.error(data.client ? `[Client:${data.client.sessionId}]` : '[Server]', data.error.name, data.error.message)
);

mcwss.on('connection', (data) =>
  Logger.info(`[Client:${data.client.sessionId}]`, 'new connection from', data.client.req.socket.remoteAddress)
);

mcwss.on('close', (data) => {
  if (data.raw) {
    Logger.info(`[Client:${data.raw.client.sessionId}]`, 'Closing in progress code:', data.raw.code);
    return;
  }
  Logger.info('WebSocketServer is closeing...');
});

process.stdin.on('data', (data) => {
  const message = data.toString().replace('\r\n', '').replace('\n', '').trim();
  const matchList = {
    restart() {
      mcwss.stop();
      mcwss.start();
    },
    stop() {
      mcwss.stop();
      process.exit();
    }
  };
  if (message in matchList) matchList[message as keyof typeof matchList]();
});

mcwss.on('block_broken', (data) => {
  const { block, player, tool } = data.body;
  Logger.log(
    stringTemp(`玩家 %name% 在 %position% 处破坏了方块 %block% %tool%`, {
      name: player.name,
      position: Object.values(player.position).join(','),
      block: `${block.namespace}:${block.id}`,
      tool: tool.id ? `${tool.namespace}:${tool.id}` : '' ?? '无'
    })
  );
});

mcwss.on('block_placed', (data) => {
  const { block, player, tool } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处放置了方块 %block% 通过工具 %tool%', {
      name: player.name,
      position: Object.values(player.position).join(','),
      block: `${block.namespace}:${block.id}`,
      tool: tool.id ? `${tool.namespace}:${tool.id}` : '' ?? '无'
    })
  );
});

mcwss.on('end_of_day', (data) => {
  const { player } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处刚经历了黑夜', {
      name: player.name,
      position: Object.values(player.position).join(',')
    })
  );
});

mcwss.on('entity_spawned', (data) => {
  const { mob, player } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处生成了 %type% 类型的生物实体', {
      name: player.name,
      position: Object.values(player.position).join(','),
      type: mob.type
    })
  );
});

mcwss.on('item_acquired', (data) => {
  const { player, item, count } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处获得了 %count% 个 %item%', {
      name: player.name,
      position: Object.values(player.position).join(','),
      count,
      item: `${item.namespace}:${item.id}`
    })
  );
});

mcwss.on('item_crafted', (data) => {
  const { player, item, count } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处合成了 %count% 个 %item%', {
      name: player.name,
      position: Object.values(player.position).join(','),
      count,
      item: `${item.namespace}:${item.id}`
    })
  );
});

mcwss.on('item_destroyed', (data) => {
  const { player, item, count } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处破坏了 %count% 个 %item%', {
      name: player.name,
      position: Object.values(player.position).join(','),
      count,
      item: `${item.namespace}:${item.id}`
    })
  );
});

mcwss.on('item_smelted', (data) => {
  const { player, item } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处熔炼了 %item%', {
      name: player.name,
      position: Object.values(player.position).join(','),
      item: `${item.namespace}:${item.id}`
    })
  );
});

mcwss.on('item_used', (data) => {
  const { player, item, count } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处使用了 %count% 个 %item%', {
      name: player.name,
      position: Object.values(player.position).join(','),
      count,
      item: `${item.namespace}:${item.id}`
    })
  );
});

mcwss.on('jukebox_used', (data) => {
  const { player, item, count } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处播放了 %count% 个 %item% 唱片', {
      name: player.name,
      position: Object.values(player.position).join(','),
      count,
      item: `${item.namespace}:${item.id}`
    })
  );
});

mcwss.on('mob_interacted', (data) => {
  const { player, mob, interactionType } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处与 %mob% 发生了 %type% 交互', {
      name: player.name,
      position: Object.values(player.position).join(','),
      mob: `${mob.type} ${mob.variant}`,
      type: interactionType
    })
  );
});

mcwss.on('mob_killed', (data) => {
  const { player, victim } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处杀死了在 %mob_position% 处的 %mob_id%（%mob_name%）', {
      name: player.name,
      position: Object.values(player.position).join(','),
      mob_id: victim.id,
      mob_name: victim.name ?? '未命名',
      mob_position: Object.values(victim.position).join(',')
    })
  );
});

mcwss.on('player_bounced', (data) => {
  const { player, block } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处被 %block% 弹起', {
      name: player.name,
      position: Object.values(player.position).join(','),
      block: `${block.namespace}:${block.id}`
    })
  );
});

mcwss.on('player_died', (data) => {
  const { player, killer } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处被 %killer% 杀死', {
      name: player.name,
      position: Object.values(player.position).join(','),
      killer: `${killer.type} ${killer.variant}`
    })
  );
});

mcwss.on('player_message', (data) => {
  const { sender, receiver, message, type } = data.body;
  Logger.log(
    stringTemp('%sender% 对 %receiver% 发送了 %type% 消息：%message%', {
      sender,
      receiver: receiver || '所有人',
      type,
      message
    })
  );
});

mcwss.on('player_teleported', (data) => {
  const { player, metersTravelled } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处传送了 %meters% 格', {
      name: player.name,
      position: Object.values(player.position).join(','),
      meters: metersTravelled
    })
  );
});

/* its with 'player_travelled' at the same time */
/* mcwss.on('player_transform', (data) => {
  const { player } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 移动了', {
      name: player.name,
      position: Object.values(player.position).join(','),
    })
  );
}); */

mcwss.on('player_travelled', (data) => {
  const { player, metersTravelled } = data.body;
  Logger.log(
    stringTemp('玩家 %name% 在 %position% 处移动了 %meters% 格', {
      name: player.name,
      position: Object.values(player.position).join(','),
      meters: metersTravelled
    })
  );
});

mcwss.on('unknown_minecraft_event', (data) => {
  Logger.warn(data);
});

mcwss.on('command_response', (data) => {
  if (!data.body.statusMessage) return;
  data.client.chatf(`返回结果：\n${data.body.statusMessage}`);
});

mcwss.on('player_message', (data) => {
  if (data.body.receiver) return;
  const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json')).toString());
  switch (data.body.message) {
    case '*/help':
      data.client.chatf(
        '§2--- Mcwss 指令帮助页 ---§r\n*/help §7- 显示 Mcwss 指令帮助页§r\n*/connect §7- 显示 WebSocket 连接时间§r\n*/about §7- 显示关于信息§r\n*/clears §7- 清除聊天栏内容§r\n*/func <path> §7- 执行服务器上的 mcfunction§r\n*/helph §7- 显示隐藏指令帮助页§r'
      );
      break;
    case '*/helpf':
      data.client.chatf(
        '§2---- 隐藏指令帮助页 ----§r\n./closewebsocket §7- 关闭websocket连接§r\n./gettopsolidblock <x> <y> <z> §7- 获取坐标点最顶层固态方块坐标§r\n./querytarget <选择器> §7- 获取实体的精确浮点坐标§r\n./agent §7- 吉祥物§r\n./enableencryption §7- 未知§r\n./closechat §7- 关闭聊天栏§r\n./geteduclientinfo §7- 获取版本信息§r\n./getlocalplayername §7- 返回玩家名字§r'
      );
      break;
    case '*/connect':
      data.client.chatf(
        stringTemp('已正常连接： %time% 秒\n连接时间： %date%', {
          time: (new Date().getTime() - data.client.sessionDate.getTime()) / 1000,
          date: data.client.sessionDate.getTime()
        })
      );
      break;
    case '*/about':
      data.client.chatf(
        stringTemp(`Mcwss\n作者： %author%\n版本： %version%\n连接 IP： %ip%`, {
          author: pkg.author.split(' ')[0],
          version: pkg.version,
          ip: data.client.req.socket.remoteAddress
        })
      );
      break;
    case '*/clears':
      for (let i = 0; i < 100; i += 1) {
        data.client.chatf('');
      }
      break;
    default:
      if (data.body.message.startsWith('./')) {
        data.client.run(data.body.message.slice(2));
      } else if (data.body.message.startsWith('*/func ')) {
        const file = join(process.cwd(), data.body.message.split('*/func ')[1]);
        const result = data.client.func(file);
        if (result) return;
        data.client.chatf(stringTemp('mcfunction 执行失败： 不存在的文件 %file%', { file }), TextColor.RED);
      }
      break;
  }
});

mcwss.start();
