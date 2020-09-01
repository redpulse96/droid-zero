import { Logger } from '@nestjs/common';
import chalk from 'chalk';
import moment from 'moment';
import { SessionMiddleware } from 'src/middleware/session.middleware';
import * as winston from 'winston';
import { MomentFormat, REQUEST_ID, SESSION_USER } from '../../shared/constants';
import { Users } from '../user/user.entity';

const { Timestamp } = MomentFormat;

const customFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.printf((info) => formatter(info)),
);

const formatter = (info) => {
  const requestId = SessionMiddleware.get(REQUEST_ID) || '-';
  const user: Users = SessionMiddleware.get(SESSION_USER);
  const email = user ? user.email : '-';

  return `${moment(info.timestamp).format(Timestamp)} ${chalk.magentaBright(
    requestId,
  )} ${email} [${info.level}] [${chalk.green(info.context)}] ${info.message}`;
};

export class BackendLogger extends Logger {
  public static winstonLogger = winston.createLogger({
    level: 'info',
    format: customFormat,
    transports: [
      new winston.transports.File({
        filename: 'logs/server.tail.log',
        tailable: true,
        level: 'verbose',
        maxFiles: 2,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
      new winston.transports.File({
        filename: 'logs/serverAll.tail.log',
        tailable: true,
        level: 'info',
        maxFiles: 2,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
      new winston.transports.File({
        filename: 'logs/server.log',
        format: winston.format.combine(winston.format.uncolorize()),
        tailable: false,
        level: 'verbose',
        maxFiles: 30,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
      new winston.transports.File({
        filename: 'logs/serverAll.log',
        format: winston.format.combine(winston.format.uncolorize()),
        tailable: false,
        level: 'info',
        maxFiles: 30,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
    ],
  });

  private ctx: string;

  constructor(context: string) {
    super(context);

    this.ctx = context;
  }

  public info(message: any) {
    this.winstonLog(message, 'info');
    super.log(message);
  }

  public debug(message: any) {
    this.winstonLog(message, 'debug');
    super.log(message);
  }

  public log(message: any) {
    this.winstonLog(message, 'verbose');
    super.log(message);
  }

  public warn(message: any) {
    this.winstonLog(message, 'warn');
    super.warn(message);
  }

  public error(message: any, trace: string = '') {
    if (trace) {
      this.winstonLog(message, 'error', trace);
      super.error(message.toString(), trace);
    } else {
      this.winstonLog(message, 'error');
      super.error(message.toString());
    }
  }

  private winstonLog(
    message: string,
    level: 'info' | 'verbose' | 'debug' | 'warn' | 'error',
    trace?: string,
  ) {
    BackendLogger.winstonLogger.log({
      level,
      message,
      trace,
      context: this.ctx,
    });
  }
}
