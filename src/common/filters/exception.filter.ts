import { Catch, ArgumentsHost, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

enum MysqlErrorCode {
  ALREADY_EXIST = 'ER_DUP_ENTRY', // 중복 데이터로 인한 에러 코드
}

// 모든 예외를 잡아서 처리하는 전역 필터
@Catch()
export class ExceptionsFilter {
  private readonly logger: Logger = new Logger();

  public catch(exception: unknown, host: ArgumentsHost): void {
    let message = 'UNKNOWN ERROR';

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const statusCode = this.getHttpStatus(exception); // 예외로부터 HTTP 상태 코드 추출
    const datetime = new Date(); // 에러 발생 시간

    // 메시지가 단순 문자열이면 그대로 사용, 객체라면 'message' 속성 값 사용
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        //
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        //
        message = exceptionResponse['message'] || message;
      }
    }

    // TypeORM QueryFailedError 처리: 고유 키 중복 에러
    message = exception instanceof QueryFailedError ? 'Already Exist' : message;

    // 에러 스택 추적 (에러 객체일 경우에만)
    const stack = exception instanceof Error ? exception.stack : 'Missing Error Stack';

    // 클라이언트에 보낼 에러 응답 객체
    const errorResponse = {
      code: statusCode,
      timestamp: datetime,
      path: req.url,
      method: req.method,
      exceptionErrMessage: exception instanceof HttpException ? exception.message : 'Missing Error Message', // 예외 객체의 메시지
      message: message, // 최종적으로 설정된 에러 메시지
    };

    // 로그 기록: 500 이상의 서버 에러는 error 로그, 그 외는 warn 로그
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ err: errorResponse, stack });
    } else {
      this.logger.warn({ err: errorResponse });
    }

    res.status(statusCode).json(errorResponse);
  }

  // 예외로부터 적절한 HTTP 상태 코드를 결정하는 함수
  private getHttpStatus(exception: unknown): HttpStatus {
    // MySQL 고유 키 중복 에러의 경우 409 Conflict 반환
    if (exception instanceof QueryFailedError && exception.driverError.code === MysqlErrorCode.ALREADY_EXIST) {
      return HttpStatus.CONFLICT;
    }
    // HttpException의 경우 상태 코드 그대로 반환
    else if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    // 그 외의 경우 500 Internal Server Error
    else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
