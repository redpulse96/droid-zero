import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessController } from './userAccess.controller';
import { UserAccess } from './userAccess.entity';
import { UserAccessService } from './userAccess.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccess])],
  controllers: [UserAccessController],
  providers: [UserAccessService],
  exports: [UserAccessService],
})
export class UserAccessModule {}
