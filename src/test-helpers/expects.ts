import { ValidationError } from 'class-validator';

type SimpleValidationAssertError = {
  property: string;
  rule: string;
};

export function expectHasDtoValidationError(
  errors: ValidationError[],
  error: SimpleValidationAssertError,
) {
  expect(
    errors.some(
      (e) => e.property === error.property && e.constraints?.[error.rule],
    ),
  ).toBe(true);
}
