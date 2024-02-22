import Logger, { ConsoleTransport, FileTransport, LoggerLevel } from '@kotori-bot/logger';
import { loadConfig } from '@kotori-bot/tools';
import { resolve } from 'path';
import Mcwss from '../index';
import { TextColor } from './client';
import { existsSync, mkdirSync } from 'fs';
import I18n, { LocaleType } from '@kotori-bot/i18n';

const LOG_DIR = resolve(__dirname, '../../logs');

export default function (port: number, level: LoggerLevel, lang: LocaleType) {
  /* instances */
  const mcwss = new Mcwss({ port });

  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR);

  const logger = new Logger({
    level,
    transports: [
      new FileTransport({
        dir: LOG_DIR,
        filter: (data) => data.level >= LoggerLevel.INFO
      }),
      new ConsoleTransport()
    ]
  });

  const i18n = new I18n({ lang });
  i18n.use(resolve(__dirname, '../../locales'));

  /* methods */
  function format(template: string, ...args: (string | number)[]) {
    let content = i18n.locale(template);
    args.forEach((value, key) => {
      content = content.replaceAll(`{${key}}`, i18n.locale(String(value)));
    });
    return content;
  }

  /* server events register */
  mcwss.on('ready', () => logger.info(`WebSocketServer started at ws://localehost:${port} `));

  mcwss.on('dispose', () => logger.info('WebSocketServer stopped'));

  mcwss.on('error', (data) =>
    logger.error(data.client ? `[Client:${data.client.sessionId}]` : '[Server]', data.error.name, data.error.message)
  );

  mcwss.on('connection', (data) =>
    logger.info(`[Client:${data.client.sessionId}]`, 'new connection from', data.client.req.socket.remoteAddress)
  );

  mcwss.on('close', (data) => {
    if (data.raw) {
      logger.info(`[Client:${data.raw.client.sessionId}]`, 'Closing in progress code:', data.raw.code);
      return;
    }
    logger.info('WebSocketServer is closeing...');
  });

  /* handle std io/out */
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

  /* minecraft events register */
  mcwss.on('block_broken', (data) => {
    const { block, player, tool } = data.body;
    logger.info(
      format(
        'block.broken',
        player.name,
        Object.values(player.position).join(','),
        `${block.namespace}:${block.id}`,
        tool.id ? `${tool.namespace}:${tool.id}` : '' ?? 'none'
      )
    );
  });

  mcwss.on('block_placed', (data) => {
    const { block, player, tool } = data.body;
    logger.info(
      format(
        'block.placed',
        player.name,
        Object.values(player.position).join(','),
        `${block.namespace}:${block.id}`,
        tool.id ? `${tool.namespace}:${tool.id}` : '' ?? 'none'
      )
    );
  });

  mcwss.on('end_of_day', (data) => {
    const { player } = data.body;
    logger.info(format('end.of.day', player.name, Object.values(player.position).join(',')));
  });

  mcwss.on('entity_spawned', (data) => {
    const { mob, player } = data.body;
    logger.info(format('entity.spawned', player.name, Object.values(player.position).join(','), mob.type));
  });

  mcwss.on('item_acquired', (data) => {
    const { player, item, count } = data.body;
    logger.info(
      format(
        'item.acquired',
        player.name,
        Object.values(player.position).join(','),
        count,
        `${item.namespace}:${item.id}`
      )
    );
  });

  mcwss.on('item_crafted', (data) => {
    const { player, item, count } = data.body;
    logger.info(
      format(
        'item.crafted',
        player.name,
        Object.values(player.position).join(','),
        count,
        `${item.namespace}:${item.id}`
      )
    );
  });

  mcwss.on('item_destroyed', (data) => {
    const { player, item, count } = data.body;
    logger.info(
      format(
        'item.destroyed',
        player.name,
        Object.values(player.position).join(','),
        count,
        `${item.namespace}:${item.id}`
      )
    );
  });

  mcwss.on('item_smelted', (data) => {
    const { player, item } = data.body;
    logger.info(
      format('item.smelted', player.name, Object.values(player.position).join(','), `${item.namespace}:${item.id}`)
    );
  });

  mcwss.on('item_used', (data) => {
    const { player, item, count } = data.body;
    logger.info(
      format('item.used', player.name, Object.values(player.position).join(','), count, `${item.namespace}:${item.id}`)
    );
  });

  mcwss.on('jukebox_used', (data) => {
    const { player, item, count } = data.body;
    logger.info(
      format(
        'jukebox.used',
        player.name,
        Object.values(player.position).join(','),
        count,
        `${item.namespace}:${item.id}`
      )
    );
  });

  mcwss.on('mob_interacted', (data) => {
    const { player, mob, interactionType } = data.body;
    logger.info(
      format(
        'mob.interacted',
        player.name,
        Object.values(player.position).join(','),
        `${mob.type} ${mob.variant}`,
        interactionType
      )
    );
  });

  mcwss.on('mob_killed', (data) => {
    const { player, victim } = data.body;
    logger.info(
      format(
        'mob.killed',
        player.name,
        Object.values(player.position).join(','),
        Object.values(victim.position).join(','),
        victim.id,
        victim.name ?? 'mob.killed.unnamed'
      )
    );
  });

  mcwss.on('player_bounced', (data) => {
    const { player, block } = data.body;
    logger.info(
      format('player.bounced', player.name, Object.values(player.position).join(','), `${block.namespace}:${block.id}`)
    );
  });

  mcwss.on('player_died', (data) => {
    const { player, killer } = data.body;
    logger.info(
      format('player.died', player.name, Object.values(player.position).join(','), `${killer.type} ${killer.variant}`)
    );
  });

  mcwss.on('player_message', (data) => {
    const { sender, receiver, message, type } = data.body;
    logger.info(format('player.message', sender, receiver || 'player.message.all', type, message));
  });

  mcwss.on('player_teleported', (data) => {
    const { player, metersTravelled } = data.body;
    logger.info(format('player.teleported', player.name, Object.values(player.position).join(','), metersTravelled));
  });

  /* its with 'player_travelled' at the same time */
  /* mcwss.on('player.transform', (data) => {
    const { player } = data.body;
    logger.info(
      format('player.transform', name: player.name, Object.values(player.position).join(','))
    );
  }); */

  mcwss.on('player_travelled', (data) => {
    const { player, metersTravelled } = data.body;
    logger.info(format('player.travelled', player.name, Object.values(player.position).join(','), metersTravelled));
  });

  mcwss.on('unknown_minecraft_event', (data) => {
    logger.warn(data);
  });

  mcwss.on('command_response', (data) => {
    if (!data.body.statusMessage) return;
    data.client.chatf(format('command.response', data.body.statusMessage));
  });

  /* custom commands */
  mcwss.on('player_message', (data) => {
    if (data.body.receiver) return;
    const pkg = loadConfig(resolve(__dirname, '../../package.json'), 'json') as Record<string, string>;
    const time = data.client.sessionDate.getTime();
    switch (data.body.message) {
      case '*/help':
        data.client.chatf(format('command.help'));
        break;
      case '*/helph':
        data.client.chatf(format('command.helph'));
        break;
      case '*/connect':
        data.client.chatf(format('command.connect', (new Date().getTime() - time) / 1000, time));
        break;
      case '*/about':
        data.client.chatf(
          format('command.about', pkg.author.split(' ')[0], pkg.version, String(data.client.req.socket.remoteAddress))
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
          const file = resolve(process.cwd(), data.body.message.split('*/func ')[1]);
          const result = data.client.func(file);
          if (result) return;
          data.client.chatf(format('command.function', file), TextColor.RED);
        }
        break;
    }
  });

  mcwss.start();
}
