import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
console.log('ValidatorConstraint');

/**
 * Class for creating a custom validator for a date format.
 */
@ValidatorConstraint({ name: 'isDateFormat', async: false })
export class IsDateFormatConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value !== 'string') {
      return false;
    }
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormatRegex.test(value);
  }

  defaultMessage() {
    return 'Invalid date format. Date must be in the format "yyyy-mm-dd"';
  }
}

/**
 * Factory function to create a date format validation decorator
 *
 * @param validationOptions Options used to pass to validation decorators.
 * @returns Void.
 */
export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateFormatConstraint,
    });
  };
}
