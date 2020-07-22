import {
  Resolver,
  Query,
  Args,
  Mutation,
} from '@nestjs/graphql';
import { Users } from './user.entity';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserInputDto } from './dtos/userInput.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Resolver(of => Users)
@UseGuards(AuthGuard)
export class UserResolver {
  constructor (
    private readonly userService: UserService,
  ) { }

  @UseGuards(AdminGuard)
  @Query(returns => [Users])
  public async adminUsers() {
    return this.userService.findAll();
  }

  @UseGuards(AdminGuard)
  @Query(returns => Users)
  public async adminUser(@Args('userId') userId: string) {
    return this.userService.findOne({ id: userId });
  }

  @UseGuards(AdminGuard)
  @Mutation(returns => Users)
  public async adminUpdateUser(@Args('userInput') userInput: UserInputDto) {
    await this.userService.update({ id: userInput.id }, userInput);
    return this.userService.findOne({ id: userInput.id });
  }
}
