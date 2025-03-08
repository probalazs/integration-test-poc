import { validate } from 'class-validator';
import { createCreateProductDto } from '../test-data-factory';
import { expectHasDtoValidationError } from '../../../test-helpers/expects';

describe('CreateProductDto', () => {
  [
    {
      should: 'throw error when name is not a string',
      input: createCreateProductDto({ name: 1 as any }),
      error: {
        property: 'name',
        rule: 'isString',
      },
    },
    {
      should: 'throw error when name is empty',
      input: createCreateProductDto({ name: '' }),
      error: {
        property: 'name',
        rule: 'isNotEmpty',
      },
    },
    {
      should: 'throw error when name is not existing',
      input: createCreateProductDto({ name: undefined }),
      error: {
        property: 'name',
        rule: 'isDefined',
      },
    },
  ].forEach(({ should, input, error }) => {
    it(`should ${should}`, async () => {
      const errors = await validate(input);
      expectHasDtoValidationError(errors, error);
    });
  });
});
