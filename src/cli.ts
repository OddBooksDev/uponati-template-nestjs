import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './app.module';

/**
 * @description NestJS Command 패키지를 사용하기 위한 부트스트랩 함수입니다.
 * 애플리케이션 컨텍스트를 생성하고, CommandService를 실행한 후 종료합니다.
 * 에러가 발생할 경우 에러를 로그에 출력하고 애플리케이션을 종료합니다.
 *
 * src/common/custom-command/command.module.ts 파일을 참고하세요.
 *
 * Link => https://www.npmjs.com/package/nestjs-command
 */
async function runCLI() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'], // only errors
  });

  try {
    await app.select(CommandModule).get(CommandService).exec();
    await app.close();
  } catch (error) {
    console.error(error);
    await app.close();
    process.exit(1);
  }
}

runCLI();
