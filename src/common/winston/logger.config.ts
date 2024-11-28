import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';

const isProduction = process.env['NODE_ENV'] === 'production';
const logDir = '/usr/src/app/logs';

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };
};

/**
 * Winston 로거 인스턴스를 생성합니다.
 *
 * 로거는 다음 전송 수단으로 구성됩니다:
 * - 콘솔 전송: 환경에 따라 다른 형식과 레벨로 콘솔에 로그를 기록합니다.
 * - 일일 로테이션 파일 설정: 'info', 'warn', 'error' 레벨에 대해 로테이션 파일에 로그를 기록합니다.
 *
 * 콘솔 전송은 애플리케이션이 프로덕션에서 실행 중인지 여부에 따라 다른 형식을 사용합니다.
 * 프로덕션에서는 간단한 형식을 사용합니다. 비프로덕션 환경에서는 타임스탬프, 밀리초, 색상 및 프리티 출력이 포함된 사용자 정의 Nest 형식
 *
 * @constant {winston.Logger} winstonLogger - 구성된 Winston 로거 인스턴스입니다.
 */
export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: isProduction ? 'info' : 'silly',
      format: isProduction
        ? winston.format.simple()
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('your_service_name', {
              colors: true,
              prettyPrint: true,
            }),
          ),
    }),
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
});
