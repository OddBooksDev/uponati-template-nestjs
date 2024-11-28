import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './common/environment/values/app.config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './common/winston/logger.config';
import { setupSwagger } from './swagger/setup/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // 기존 NestJS Logger를 사용하지 않고 winstonLogger를 사용하기 위해 설정
    logger: winstonLogger, // replacing logger
  });
  const configService = app.get(ConfigService);
  const appConfig: AppConfig = configService.get('APP');

  // Enable graceful shutdown hooks
  app.enableShutdownHooks();

  // Graceful shutdown handling
  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await shutdown(app);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await shutdown(app);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  await app.listen(appConfig.PORT);

  return app.getUrl();
}

async function shutdown(app: INestApplication) {
  try {
    // Perform any cleanup operations here, like closing database connections
    console.log('Graceful shutdown completed');
    await app.close();
  } catch (error) {
    console.error('Error during graceful shutdown', error);
    process.exit(1); // Exit the process with an error code if shutdown fails
  }
}

bootstrap();
