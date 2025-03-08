export function createObjectFactory<T extends object>(getObject: () => T) {
  return (getDefaultProperties: () => Partial<T>) =>
    (properties: Partial<T> = {}): T =>
      Object.assign(getObject(), getDefaultProperties(), properties) as T;
}
