import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as cp from 'child_process';
import { UserService } from 'src/modules/user/user.service';
import * as util from 'util';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';

@Injectable()
export class UtilService {
  private readonly logger = new BackendLogger(UtilService.name);

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly dotenvService: DotenvService,
  ) {}

  /**
   * Pauses execution for a given amount of ms
   */
  public async sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }

  /**
   * Uses util.promisify to use the native child_process module exec
   * in an async fashion
   *
   * @param {string} command Command to execute
   */
  public asyncExec(cmd: string, options: cp.ExecOptions = {}) {
    const exec = util.promisify(cp.exec);

    return exec(cmd, options);
  }
}
