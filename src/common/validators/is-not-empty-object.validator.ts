import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsNotEmptyObjectConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown) {
    if (value === null || typeof value !== 'object') {
      return false;
    }

    return Object.keys(value).length > 0;
  }

  defaultMessage() {
    return 'Value must be an object and not empty';
  }
}

export const IsNotEmptyObject = (validationOptions?: ValidationOptions) => {
  return (target: { new (...args: unknown[]): object }) => {
    registerDecorator({
      target: target,
      propertyName: 'instance',
      options: validationOptions,
      constraints: [],
      validator: IsNotEmptyObjectConstraint,
    });
  };
};
