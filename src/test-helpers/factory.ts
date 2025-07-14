export function createObjectFactory<T extends object>(getObject: () => T) {
  return (getDefaultProperties: () => Partial<T>) =>
    (properties: Partial<T> = {}): T =>
      Object.assign(getObject(), getDefaultProperties(), properties) as T;
}

export function createObjectFactoryWithEmptyOverrides<T extends object>(
  getDefaultProperties: () => T,
) {
  return (overrides: Partial<T> = {}): T => ({
    ...getDefaultProperties(),
    ...overrides,
  });
}
