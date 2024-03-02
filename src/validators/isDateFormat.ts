import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

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

export function IsDateFormat(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsDateFormatConstraint,
        });
    };
}