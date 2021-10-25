/**
 * Validation pipe.
 * @file 数据表验证器
 * @module pipe/validation
 */

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ValidationError } from '../errors';

/**
 * @class ValidationPipe
 * @classdesc 验证所有使用 class-validator 的地方的 class 模型
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    console.log('errors', JSON.stringify(errors));
    if (errors.length > 0) {
      const errorMessage = this.handleError(errors);
      throw new ValidationError(errorMessage);
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  private handleError(errors) {
    const errorMessage = errors.reduce((total, currency) => {
      if (currency.children.length) {
        total += this.handleError(currency.children);
      } else {
        total += Object.values(currency.constraints).join(';');
      }

      return total;
    }, '');

    return errorMessage;
  }
}
