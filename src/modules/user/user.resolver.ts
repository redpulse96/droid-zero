import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserInputDto } from './dtos/user-input.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  public async adminUsers() {
    return this.userService.findAll();
  }

  @UseGuards(AdminGuard)
  public async adminUser(userId: string) {
    return this.userService.findOne({ id: userId });
  }

  @UseGuards(AdminGuard)
  public async adminUpdateUser(userInput: UserInputDto) {
    await this.userService.update({ id: userInput.id }, userInput);
    return this.userService.findOne({ id: userInput.id });
  }
}
