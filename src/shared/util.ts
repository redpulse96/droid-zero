import * as bcrypt from 'bcryptjs';
import moment from 'moment';
import { DotenvService } from 'src/modules/dotenv/dotenv.service';
import { BackendLogger } from 'src/modules/logger/BackendLogger';
import { promisify } from 'util';
import { MomentFormat } from './constants';
const jwt = require('jsonwebtoken');
const { genSalt, hash, compare } = bcrypt;
const { Timestamp } = MomentFormat;
const dotenvService: DotenvService = new DotenvService(__filename);
const log = new BackendLogger('Utils');

export namespace Utils {
  export const signAsync = promisify(jwt.sign);

  export const verifyAsync = promisify(jwt.verify);

  export namespace MomentFunctions {
    export function fetchCurrentTimestamp(): string {
      return moment().format(Timestamp);
    }
    export function fetchFormattedTimestamp(
      timestamp: string = this.fetchCurrentTimestamp(),
      format: string = Timestamp,
    ): string {
      return moment(timestamp)
        .format(format)
        .toString();
    }
    export function addCalculatedTimestamp(
      timestamp: string,
      offset: number,
      unit: any,
    ): string {
      return moment(timestamp)
        .add(offset, unit)
        .format(Timestamp)
        .toString();
    }
    export function subtractCalculatedTimestamp(
      timestamp: string,
      offset: number,
      unit: any,
    ): string {
      return moment(timestamp)
        .subtract(offset, unit)
        .format(Timestamp)
        .toString();
    }
  }
  export namespace PasswordHasher {
    export async function hashPassword(password: string): Promise<string> {
      const salt: string = await genSalt(dotenvService.get('ROUNDS'));
      return hash(password, salt);
    }
    export async function comparePassword(
      providedPass: string,
      storedPass: string,
    ): Promise<boolean> {
      return await !!compare(providedPass, storedPass);
    }
  }

  export function executePromise(promise: Promise<any>): Promise<any[]> {
    return promise
      .then((res: any) => {
        return [null, res];
      })
      .catch((err: any) => {
        return [err, null];
      });
  }

  export function generateRandomStr(length: number) {
    // Create a random string (like for generating API key)
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  export function returnCatchFunction(error: any) {
    log.error('catch.return');
    log.error(error);
    return {
      response_code: 'default',
      data: error,
    };
  }
}
