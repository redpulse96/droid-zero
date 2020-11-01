import * as bcrypt from 'bcryptjs';
import md5 from 'crypto-js/md5';
import formidable from 'formidable';
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
      const salt_rounds: number = parseInt(dotenvService.get('ROUNDS'));
      const salt: string = await genSalt(salt_rounds);
      return hash(password, salt);
    }
    export async function comparePassword(
      providedPass: string,
      storedPass: string,
    ): Promise<boolean> {
      return !!compare(providedPass, storedPass);
    }
  }

  export async function executePromise(promise: Promise<any>): Promise<any> {
    try {
      const res = await promise;
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  export function generateRandomStr(length: number) {
    // Create a random string (like for generating API key)
    let text = '';
    const possible = '0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  export function returnCatchFunction(error: any) {
    log.error('catch.return', error);
    return {
      response_code: 'default',
      data: error,
    };
  }

  export function generateReferenceID(...data: any[]): string {
    const encryption_str: string[] = [].concat(
      ...data,
      Utils.MomentFunctions.fetchCurrentTimestamp(),
    );
    return md5(encryption_str.join(''))
      .toString()
      .toUpperCase();
  }

  export function generateComponentCode(component_type: string): string {
    return `${component_type}${Utils.generateRandomStr(4)}`;
  }

  export function uploadImage(file: any, file_path: string) {
    const form = new formidable.IncomingForm();
  }
}
