import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccess } from '../userAccess/userAccess.entity';
import { UserAccessModule } from '../userAccess/userAccess.module';
import { UserCommand } from './user.command';
import { UserController } from './user.controller';
import { Users } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Users, UserAccess]), UserAccessModule],
  providers: [UserService, UserCommand, UserResolver],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
