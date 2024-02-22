import { LoggerLevel } from '@kotori-bot/logger';
import { loadConfig } from '@kotori-bot/tools';
import cac from 'cac';
import { resolve } from 'path';
import line from './line';

const DEFAULT_PORT = 1;
const DEFAULT_LANGUAGES = 'en_US' as const;
const SUPPORTS_LANGUAGES = ['en_US', 'ja_JP', 'zh_TW', 'zh_CN'] as const;

const program = cac();

program.version((loadConfig(resolve(__dirname, '../../package.json'), 'json') as Record<string, string>).version);

program.help();

program
  .command('')
  .option('--port [num]', 'Set websocket server port')
  .option('--mode [type]', 'Set logger level, debug or build')
  .option('--lang [locale]', `Set view language, ${SUPPORTS_LANGUAGES.join(', ')}`)
  .action((args) =>
    line(
      args.port ? Number(args.port) : DEFAULT_PORT,
      args.mode === 'debug' ? LoggerLevel.TRACE : LoggerLevel.INFO,
      args.lang && SUPPORTS_LANGUAGES.includes(args.lang) ? args.lang : DEFAULT_LANGUAGES
    )
  );

program.parse();
