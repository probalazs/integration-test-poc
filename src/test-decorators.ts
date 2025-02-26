import { getInitializedDataSource } from './test-helpers';
import { DataSource } from 'typeorm';

export function dataSourceDecorator(
  fn: (
    context: { datasource: DataSource },
    ...args: any[]
  ) => ReturnType<jest.ProvidesCallback>,
) {
  return async (...args: any[]) => {
    const { datasource, close } = await getInitializedDataSource();
    try {
      const result = await fn({ datasource }, ...args);
      return result;
    } finally {
      await close();
    }
  };
}
