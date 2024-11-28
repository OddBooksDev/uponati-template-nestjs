import { IsIn, IsNumber, IsString } from 'class-validator';
import ValidateConfig from '../validator.config';

export class DataBaseConfig {
  @IsString()
  DATABASE_HOST: string;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_NAME: string;

  @IsIn(['mysql', 'mariadb', 'postgres', 'sqlite', 'mssql'])
  DATABASE_TYPE: 'mysql' | 'mariadb' | 'postgres' | 'sqlite' | 'mssql';
}

export default () => {
  const env = {
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_TYPE: 'postgres',
  };

  ValidateConfig(env, DataBaseConfig);

  if (process.env.NODE_ENV === 'local') env['LOGGING'] = true;

  return {
    DATABASE: {
      type: env.DATABASE_TYPE,
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      username: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      entities: ['dist/common/database/entity/*.entity{.ts,.js}'],
      migrations: ['dist/common/database/migrations/*{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: false,
    },
  };
};
