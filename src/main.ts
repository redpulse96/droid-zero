import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { BootstrapConsole } from 'nestjs-console';
import * as owasp from 'owasp-password-strength-test';
import { AppModule } from './app.module';
import { ConsoleAppModule } from './consoleApp.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { DotenvService } from './modules/dotenv/dotenv.service';
import { BackendLogger } from './modules/logger/BackendLogger';

const logger = new BackendLogger('Main');

// Configure password requirements
owasp.config({
  allowPassphrases: true,
  maxLength: 128,
  minLength: 6,
  minPhraseLength: 20,
  minOptionalTestsToPass: 3,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dotenvService = app.get<DotenvService>(DotenvService);

  // Setup security middleware
  app.use(helmet());

  // Setup bodyparser here to set configuration on it
  app.use(bodyParser.json({ limit: '50mb' }));

  // Use a global validation pipe. This will ensure that whenever we specify
  // a type for the input of a network request it will get validated before processing.
  // See: https://docs.nestjs.com/techniques/validation
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  logger.debug(`Listening on port: ${dotenvService.get('PORT')}`);

  process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:');
    console.log(err);
    console.log(err.stack);
  });

  process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:');
    console.log(err);
  });

  await app.listen(dotenvService.get('PORT'));
}

// If we specify the first CLI arg as "--cli" we can interpret the
// command as a CLI command, not trying to run the server itself
if (process.argv[2] === '--cli') {
  BootstrapConsole.init({ module: ConsoleAppModule })
    .then(({ app, boot }) => {
      // We don't want to pass along the --cli arg to the CLI handler.
      // So a command like "node main.js --cli --help" becomes
      // "node main.js --help"
      boot(process.argv.filter((arg) => arg !== '--cli'));
    })
    .catch((e) => console.log('Error', e));
} else {
  // Otherwise just start the app
  bootstrap();
}
