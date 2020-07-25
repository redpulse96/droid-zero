import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { BackendLogger } from '../logger/BackendLogger';
import { UserAccessService } from './userAccess.service';

@Controller('userAccess')
@UseGuards(AuthGuard)
export class UserAccessController {
  private readonly logger = new BackendLogger(UserAccessController.name);

  constructor(private readonly userAccessService: UserAccessService) {}
}
