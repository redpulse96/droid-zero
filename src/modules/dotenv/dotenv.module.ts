import { Module, Global } from '@nestjs/common';
import { DotenvService } from './dotenv.service';

@Global()
@Module({
  providers: [
    {
      provide: DotenvService,
      useValue: new DotenvService(`.env`),
    },
  ],
  exports: [DotenvService],
})
export class DotenvModule {}
