import { Global, Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LoggerContextMiddleware } from './middleware/logger-context.middleware';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsFilter } from './filters/exception.filter';
import { DatabaseModule } from './database/database.module';
import { EnvironmentModule } from './environment/environment.module';
import { CustomCommandModule } from './custom-command/command.module';

/**
 * @module CommonModule
 * @description
 * 이 모듈은 여러 공통사항들을 중앙관리하기 위해서 만들어졌습니다.
 *
 * @global
 * @imports
 * - DatabaseModule: 데이터베이스 관련 모듈
 * - EnvironmentModule: 환경 변수 관련 모듈
 * - CustomCommandModule: 커스텀 명령어 관련 모듈
 *
 * @method configure
 * @param {MiddlewareConsumer} consumer - 미들웨어 소비자
 * @description
 * 전체 요청에 대한 정보를 로그로 출력하며 '/healthy' 경로의 GET 요청을 제외
 */
@Global()
@Module({
  imports: [DatabaseModule, EnvironmentModule, CustomCommandModule],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
  exports: [Logger, DatabaseModule, EnvironmentModule, CustomCommandModule],
})
export class CommonModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).exclude({ path: '/healthy', method: RequestMethod.GET }).forRoutes('*');
  }
}
