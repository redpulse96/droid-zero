import * as bcrypt from 'bcryptjs';
import { promisify } from 'util';
const jwt = require('jsonwebtoken');
const { genSalt, hash, compare } = bcrypt;

export namespace Utils {
  export namespace PasswordHasher {
    export async function hashPassword(password: string): Promise<string> {
      const salt: string = await genSalt(this.rounds);
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
  export const signAsync = promisify(jwt.sign);
  export const verifyAsync = promisify(jwt.verify);
}
