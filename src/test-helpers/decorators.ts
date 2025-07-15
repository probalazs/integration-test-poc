import {
  getInitializedTypeormPostgres,
  TypeormPostgresConfig,
} from './decorator-initializers/typeorm-postgres';
import { DataSource } from 'typeorm';
import { entities } from '../entities';
import {
  getInitializedPrismaPostgres,
  PrismaPostgresConfig,
} from './decorator-initializers/prisma-postgres';
import { PrismaClient } from '../prisma/client';
import * as path from 'path';
import { TestPostgresConnectionOptions } from './types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const connectionOptions = JSON.parse(
  process.env.__TEST_POSTGRES_CONNECTION_OPTIONS!,
) as TestPostgresConnectionOptions;

export const dataSourceDecorator = dataSourceDecoratorWithEntities({
  entities,
  connectionOptions,
});

function dataSourceDecoratorWithEntities(config: TypeormPostgresConfig) {
  return (
      fn: (
        context: { typeormPostgresDataSource: DataSource },
        ...args: any[]
      ) => ReturnType<jest.ProvidesCallback>,
    ) =>
    async (...args: any[]) => {
      const { datasource: typeormPostgresDataSource, close } =
        await getInitializedTypeormPostgres(config);
      let result: any;
      try {
        result = await fn({ typeormPostgresDataSource }, ...args);
      } finally {
        await close();
      }
      return result as ReturnType<jest.ProvidesCallback>;
    };
}

export const prismaPostgresDecorator = createPrismaPostgresDecorator({
  schemaFile: path.join(__dirname, '..', 'prisma', 'schema.prisma'),
  dbEnv: 'DATABASE_URL',
  connectionOptions,
  createPrismaClient: (url) =>
    new PrismaClient({ datasources: { db: { url } } }),
});

function createPrismaPostgresDecorator<T extends PrismaClient>(
  config: PrismaPostgresConfig<T>,
) {
  return (
      fn: (
        context: { prismaPostgresClient: T },
        ...args: any[]
      ) => ReturnType<jest.ProvidesCallback>,
    ) =>
    async (...args: any[]) => {
      const { prismaPostgresClient, close } =
        await getInitializedPrismaPostgres(config);
      let result: any;
      try {
        result = await fn({ prismaPostgresClient }, ...args);
      } finally {
        await close();
      }
      return result as ReturnType<jest.ProvidesCallback>;
    };
}
