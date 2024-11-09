import type { Context } from 'koa';
import logger from 'koa-logger';
import Chalk, { type ChalkInstance } from 'chalk';

interface Level {
  letters: string;
  icon: string;
  color: ChalkInstance;
}

interface Levels {
  [key: number]: Level;
}

const levels: Levels = {
  10: { letters: 'TRACE', icon: ' 🔎 ', color: Chalk.rgb(128, 128, 128) },
  20: { letters: 'DEBUG', icon: ' 🪲 ', color: Chalk.rgb(255, 255, 0) },
  30: { letters: 'INFO', icon: ' ℹ️ ', color: Chalk.rgb(0, 255, 0) },
  40: { letters: 'WARN', icon: ' ⚠️ ', color: Chalk.rgb(255, 128, 0) },
  50: { letters: 'ERROR', icon: ' 🔥 ', color: Chalk.rgb(255, 0, 0) },
  60: { letters: 'FATAL', icon: ' 💣 ', color: Chalk.bgRgb(255, 0, 0).white },
};

const getLogLevel = (status: number): number => {
  if (status >= 500) return 50;
  if (status >= 400) return 40;
  if (status >= 300) return 30;
  if (status >= 100) return 20;
  return 10;
};

const buildMessage = (ctx: Context, ms: number, name: string) => {
  const status = ctx.status;
  const method = ctx.method;
  const url = ctx.url;
  const totalTime = ms < 2000 ? Chalk.green(`${ms}ms`) : Chalk.red(`${ms}ms`);
  const level = levels[getLogLevel(status)];
  const colorizedLevel = level.color(`${level.icon} ${level.letters}`);

  return [
    `[${name}]`,
    `${colorizedLevel}`,
    Chalk.blueBright(method),
    Chalk.yellow(url),
    Chalk.grey(`Status: ${status}`),
    `Time: ${totalTime}`,
  ].join(' ');
};

export const mainLogger = (name = 'main') => {
  return logger((args: any) => {
    const [ctx, ms] = args;
    console.log(buildMessage(ctx, ms, name));
  });
};

export const fork = (name: string) => mainLogger(name);
