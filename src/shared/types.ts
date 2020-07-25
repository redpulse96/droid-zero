import { Request } from 'express';
import { Users } from 'src/modules/user/user.entity';

export type RequestWithUser = Request & { user: Users };
export type OrderDir = 'DESC' | 'ASC';
