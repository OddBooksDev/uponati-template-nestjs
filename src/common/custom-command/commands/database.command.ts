import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { execSync } from 'child_process';

@Injectable()
export class DatabaseCommand {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * 주어진 이름을 사용하여 데이터베이스 마이그레이션 파일을 생성합니다.
   *
   * @param name - 마이그레이션 파일에 목적성을 담는 이름. 예: 'add-users-table'
   *
   * @example
   * ```typescript
   * npx yarn db:migrate <name>
   * yarn db:migrate <name>
   * ```
   *
   *
   */
  @Command({
    command: 'db:migrate <name>',
    describe: 'Generate a new migration file with the specified name',
  })
  async migrate(
    @Positional({
      name: 'name',
      describe: 'the migration name',
      type: 'string',
    })
    name: string,
  ) {
    try {
      console.log(`Generating migration: ${name}...`);

      // 기존 CLI 명령어 실행
      const command = `npx typeorm migration:generate ./src/common/database/migrations/${name} -d ./dist/common/database/data-source.js`;
      execSync(command, { stdio: 'inherit' });

      console.log(`Migration ${name} generated successfully!`);
    } catch (error) {
      console.error('Error generating migration:', error.message);
    }
  }

  /**
   * 대기 중인 모든 마이그레이션을 실행하여 데이터베이스를 최신 상태로 만듭니다.
   *
   * @example
   * ```typescript
   * npx yarn db:sync
   * yarn db:sync
   * ```
   */
  @Command({
    command: 'db:sync',
    describe: 'Run all pending migrations',
  })
  async sync() {
    console.log('Running migrations...');
    await this.dataSource.runMigrations();
    console.log('Migrations applied successfully!');
  }

  /**
   * 마지막으로 실행된 마이그레이션을 되돌립니다.
   *
   * @example
   * ```typescript
   * npx yarn db:revert
   * yarn db:revert
   * ```
   */
  @Command({
    command: 'db:revert',
    describe: 'Revert the last executed migration',
  })
  async revert() {
    console.log('Reverting last migration...');
    await this.dataSource.undoLastMigration();
    console.log('Migration reverted successfully!');
  }

  /**
   * 데이터베이스의 현재 마이그레이션 상태를 표시합니다.
   * 실행된 마이그레이션과 대기 중인 마이그레이션을 구분하여 출력합니다.
   * 최근 10개의 마이그레이션만 최신순으로 표시합니다.
   *
   * @example
   * ```typescript
   * npx yarn db:show
   * yarn db:show
   * ```
   */
  @Command({
    command: 'db:show',
    describe: 'Show all pending and executed migrations',
  })
  async show() {
    try {
      console.log('Checking pending migrations...');

      // 1. 실행된 마이그레이션 조회
      const executedMigrations = await this.dataSource.query('SELECT * FROM "migrations"');
      const executedMigrationNames = executedMigrations.map(migration => migration.name);

      // 2. 등록된 마이그레이션 조회
      const registeredMigrations = this.dataSource.migrations.map(migration => migration.name);

      // 3. 모든 마이그레이션 상태 결정
      const allMigrations = registeredMigrations.map(name => ({
        name,
        status: executedMigrationNames.includes(name) ? '[X]' : '[ ]',
      }));

      // 4. 최근 10개의 마이그레이션만 최신순으로 출력
      const recentMigrations = allMigrations.slice(-10).reverse();

      recentMigrations.forEach((migration, index) => {
        console.log(`${migration.status} ${index + 1} ${migration.name}`);
      });
    } catch (error) {
      console.error('Error showing migrations:', error);
    }
  }
}
