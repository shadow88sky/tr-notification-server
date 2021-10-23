import { ValueTransformer } from 'typeorm';
import { Hash } from '../../utils/hash';

export class PasswordTransformer implements ValueTransformer {
  to(value) {
    return Hash.make(value);
  }

  from(value) {
    return value;
  }
}
