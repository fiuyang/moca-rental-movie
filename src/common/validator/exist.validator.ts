import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
    const [entity, column] = args.constraints as [new () => object, string];
    const repository = this.entityManager.getRepository(entity);

    if (Array.isArray(value)) {
      if (!value.every((v) => typeof v === 'string')) {
        return false;
      }

      const foundItems = await repository
        .createQueryBuilder('e')
        .where(`e.${column} IN (:...values)`, { values: value })
        .getMany();

      const foundValues = foundItems.map(
        (item) => (item as Record<string, unknown>)[column],
      );

      const notFound = value.filter((v) => !foundValues.includes(v));

      if (notFound.length > 0) {
        (args.object as Record<string, unknown>)._notFoundValues = notFound;
        return false;
      }

      return true;
    } else {
      if (typeof value !== 'string') {
        return false;
      }

      const found = await repository.findOne({
        where: { [column]: value },
      });

      if (!found) {
        (args.object as Record<string, unknown>)._notFoundValues = [value];
        return false;
      }

      return true;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const notFoundValues =
      ((args.object as Record<string, unknown>)._notFoundValues as string[]) ||
      [];
    return notFoundValues.length > 0
      ? `${args.property} ${notFoundValues.join(',')} not found`
      : `${args.property} not found`;
  }
}

export function IsExist(
  options: [new () => object, string],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsExist',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: options,
      validator: ExistValidator,
      async: true,
    });
  };
}
