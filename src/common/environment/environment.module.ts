import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './values/app.config';
import databaseConfig from './values/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
      load: [appConfig, databaseConfig],
    }),
  ],
})
export class EnvironmentModule {}
