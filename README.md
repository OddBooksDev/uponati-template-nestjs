# 필수 학습 사항

1. nestjs validation with DTO 학습 [nestjs-validation Docs](https://docs.nestjs.com/techniques/validation)
2. Database Migration 개념 학습
3. nestjs Request lifecycle 개념 학습 [nestjs-request lifecycle Docs](https://docs.nestjs.com/faq/request-lifecycle)
4. nestjs swagger 사용법 [nestjs-swagger Docs](https://docs.nestjs.com/openapi/introduction)
5. User Module에서 생성 API를 기준으로 Req DTO, Res DTO, Swagger 사용법 파악하기
6. 3 layer architecture 개념 학습
7. environment module을 기준으로 환경변수 사용법 숙지
8. postman 또는 swagger를 사용한 api test 방법

# 필수 진행 사항(Clone을 진행한 뒤, 프로젝트를 시작한다면)

vscode에서 좌측 돋보기를 통해서 아래의 두개를 전체 검색해서 프로젝트에 맞게 변경하기

- your_service_name
- your_database

# 기본 구조

```
├── app.module.ts
├── main.ts
├── cli.ts
├── common
│   ├── common.module.ts
│   ├── custom-command # nestjs cli 관리
│   │   ├── command.module.ts
│   │   └── commands
│   │       └── database.command.ts
│   ├── database
│   │   ├── data-source.ts # database cli 사용에 필요한 source
│   │   ├── database.module.ts
│   │   ├── entity # 테이블 파일 관리
│   │   │   ├── order.entity.ts
│   │   │   └── user.entity.ts
│   │   └── migrations # 마이그레이션 형상 관리
│   │       └── 1732755832919-create-table-user.ts
│   ├── environment # 환경변수 관리
│   │   ├── environment.module.ts
│   │   ├── validator.config.ts
│   │   └── values
│   │       ├── app.config.ts
│   │       └── database.config.ts
│   ├── filters
│   │   └── exception.filter.ts
│   ├── middleware
│   │   └── logger-context.middleware.ts
│   └── winston
│       └── logger.config.ts # 로그 환경 설정
└── user
    ├── dto
    │   ├── create-user.dto.ts
    │   └── update-user.dto.ts
    ├── user.controller.ts
    ├── user.module.ts
    ├── user.repository.ts
    └── user.service.ts
```

# 프로젝트 로컬 환경 실행 방법

```
npx yarn start:local or yarn start:local
```

프로젝트를 실행하기 전 꼭 상단의 [필수 진행 사항]을 진행한 뒤 실행하세요!

<details>
  <summary>📂 migration CLI 정보 열기/닫기</summary>

## migration CLI 정보

**nestjs-command를 활용해 CLI(Command Line Interface) 명령어를 실행할 수 있도록 구성된 파일입니다.**  
 **데이터베이스 관련 작업(예: 마이그레이션, 동기화, 롤백 등)과 같은 서버 외부에서 실행되는 작업을 수행할 수 있습니다.**

- [nestjs-command 패키지 Link](https://www.npmjs.com/package/nestjs-command)
- 해당 명령어 사용방법 확인하기
  - `  npx yarn db:help` or `   yarn db:help`
  - `  npx yarn db:migrate <name>` or `   yarn db:migrate <name>`
  - `  npx yarn db:sync` or `   yarn db:sync`
  - `  npx yarn db:revert` or `   yarn db:revert`
  - `  npx yarn db:show` or `   yarn db:show`
  </details>
