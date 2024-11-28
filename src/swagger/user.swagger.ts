import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/user/dto/request/create-user.dto';
import { ResponseUserDTO } from 'src/user/dto/response/create-user.dto';

export function SwaggerCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 생성',
      description: `유저를 생성합니다.`,
    }),
    ApiBody({
      type: CreateUserDTO,
      description: `유저 생성에 필요한 정보를 입력해주세요.`,
    }),
    ApiOkResponse({ type: ResponseUserDTO }),
  );
}
