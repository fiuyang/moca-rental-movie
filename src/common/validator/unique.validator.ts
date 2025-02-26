import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager, Not } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const find = {
      where: {
        [args.constraints[1]]: args.value,
      },
    };

    // console.log('Validation Arguments:', args.object);
    // console.log('Object ID:', args.object['id']);

    if (args.object['id']) {
      find.where['id'] = Not(args.object['id']);
    }

    const check = await this.entityManager
      .getRepository(args.constraints[0])
      .findOne(find);

    return !check;
  }

  defaultMessage(args: ValidationArguments) {
    return args.property + ' ' + args.value + ' already exists';
  }
}

export function IsUnique(option: any, validationOption?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: option,
      options: validationOption,
      validator: UniqueValidator,
      async: true,
    });
  };
}
