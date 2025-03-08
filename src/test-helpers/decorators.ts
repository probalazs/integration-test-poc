import { getInitializedDataSource } from './database';
import { DataSource } from 'typeorm';
import { entities } from '../entities';

export const dataSourceDecorator = dataSourceDecoratorWithEntities(entities);

export function dataSourceDecoratorWithEntities(entities: any[]) {
  return (
      fn: (
        context: { datasource: DataSource },
        ...args: any[]
      ) => ReturnType<jest.ProvidesCallback>,
    ) =>
    async (...args: any[]) => {
      const { datasource, close } = await getInitializedDataSource(entities);
      let result: any;
      try {
        result = await fn({ datasource }, ...args);
      } finally {
        await close();
      }
      return result as ReturnType<jest.ProvidesCallback>;
    };
}
