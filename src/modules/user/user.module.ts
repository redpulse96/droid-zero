import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from './user.entity';
import { UserAccess } from '../userAccess/userAccess.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserAccessModule } from '../userAccess/userAccess.module';
import { UserCommand } from './user.command';
import { UserResolver } from './user.resolver';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserAccess]),
    UserAccessModule,
  ],
  providers: [UserService, UserCommand, UserResolver],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
