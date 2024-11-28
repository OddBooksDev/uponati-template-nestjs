import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import ValidateConfig from '../validator.config';

export class AppConfig {
  @IsIn(['local', 'development', 'production'])
  NODE_ENV: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsIn(['Asia/Seoul'])
  TZ: 'Asia/Seoul' = 'Asia/Seoul';
}

export default () => {
  const env = {
    NODE_ENV: process.env.NODE_ENV || 'local',
    PORT: process.env.PORT || 5010,
    API_PREFIX: process.env.API_PREFIX,
    TZ: process.env.TZ || 'Asia/Seoul',
  };

  ValidateConfig(env, AppConfig);

  return {
    APP: env,
  };
};
