import { validate } from 'class-validator';
import { expectHasDtoValidationError } from '../../../test-helpers/expects';
import { createProductDto } from '../test-data-factory';

describe('ProductDto', () => {
  [
    {
      should: 'throw error when id is not a number',
      input: createProductDto({ id: 'not-a-number' as any }),
      error: {
        property: 'id',
        rule: 'isNumber',
      },
    },
    {
      should: 'throw error when name is not a string',
      input: createProductDto({ name: 123 as any }),
      error: {
        property: 'name',
        rule: 'isString',
      },
    },
    {
      should: 'throw error when name is empty',
      input: createProductDto({ name: '' }),
      error: {
        property: 'name',
        rule: 'isNotEmpty',
      },
    },
    {
      should: 'throw error when name is not defined',
      input: createProductDto({ name: undefined }),
      error: {
        property: 'name',
        rule: 'isDefined',
      },
    },
    {
      should: 'throw error when id is not defined',
      input: createProductDto({ id: undefined }),
      error: {
        property: 'id',
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
