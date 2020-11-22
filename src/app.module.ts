import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { join } from 'path';
import { AuthMiddleware } from './middleware/auth.middleware';
import { SessionMiddleware } from './middleware/session.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CartsModule } from './modules/carts/carts.module';
import { CategoryModule } from './modules/category/category.module';
import { DatabaseModule } from './modules/database/database.module';
import { DotenvModule } from './modules/dotenv/dotenv.module';
import { DotenvService } from './modules/dotenv/dotenv.service';
import { EmailModule } from './modules/email/email.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { SubCategoryModule } from './modules/sub-category/sub-category.module';
import { UserModule } from './modules/user/user.module';
import { UtilModule } from './modules/util/util.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: 'public',
    }),
    TypeOrmModule.forRootAsync({
      imports: [DotenvModule],
      useFactory: async (dotenvService: DotenvService) =>
        ({
          type: 'mysql',
          host: dotenvService.get('DB_HOST'),
          port: parseInt(dotenvService.get('DB_PORT'), 10),
          username: dotenvService.get('DB_USER'),
          password: dotenvService.get('DB_PASSWORD'),
          database: dotenvService.get('DB_NAME'),
          entities: [join(__dirname, '/**/*.entity.{d.js,d.ts,js,ts}')],
          synchronize: dotenvService.get('NODE_ENV') == 'development',
          logging: dotenvService.get('NODE_ENV') == 'development',
          logger: 'file',
        } as any),
      inject: [DotenvService],
    }),
    // GraphQLModule.forRootAsync({
    //   useFactory: async (dotenvService: DotenvService) => ({
    //     debug: dotenvService.get('NODE_ENV') == 'development',
    //     playground: dotenvService.get('NODE_ENV') == 'development',
    //     autoSchemaFile: true,
    //     sortSchema: true,
    //     context: ({ req }) => ({ req }),
    //   }),
    //   inject: [DotenvService],
    // }),
    DotenvModule,
    AuthModule,
    EmailModule,
    ConsoleModule,
    NotificationModule,
    forwardRef(() => UtilModule),
    forwardRef(() => UserModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => SubCategoryModule),
    forwardRef(() => CartsModule),
    forwardRef(() => PaymentsModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => BrandsModule),
    DatabaseModule,
    SchedulerModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
