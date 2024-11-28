import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

/**
 * 주어진 구성 객체를 지정된 환경 클래스에 대해 검증합니다.
 *
 * @template T - 환경 클래스의 타입.
 * @param {Record<string, unknown>} config - 검증할 구성 객체.
 * @param {ClassConstructor<T>} envClass - 검증할 환경 클래스의 클래스 생성자.
 * @throws {Error} 검증에 실패하면, 검증 오류와 함께 오류가 발생합니다.
 */
export default function ValidateConfig<T extends object>(
  config: Record<string, unknown>,
  envClass: ClassConstructor<T>,
) {
  const validatedConfig = plainToClass(envClass, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
}
