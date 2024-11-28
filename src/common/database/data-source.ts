import { DataSource, DataSourceOptions } from 'typeorm';
// typeorm migration을 위한 데이터 소스 설정
const config = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: ['dist/common/database/entity/*.entity{.ts,.js}'],
  migrations: ['dist/common/database/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

export const connectionSource = new DataSource(config as DataSourceOptions);
