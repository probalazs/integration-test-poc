import { getInitializedDataSource } from './database';
import { DataSource } from 'typeorm';
import { entities } from '../entities';
import { getInitializedPrismaPostgres } from './prisma-postgres';
import { PrismaClient } from '../prisma/client';
import * as path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const connectionOptions = JSON.parse(
  process.env.__TEST_CONNECTION_OPTIONS!,
) as PostgresConnectionOptions;

export const dataSourceDecorator = dataSourceDecoratorWithEntities(
  entities,
  connectionOptions,
);

export function dataSourceDecoratorWithEntities(
  entities: any[],
  connectionOptions: PostgresConnectionOptions,
) {
  return (
      fn: (
        context: { datasource: DataSource },
        ...args: any[]
      ) => ReturnType<jest.ProvidesCallback>,
    ) =>
    async (...args: any[]) => {
      const { datasource, close } = await getInitializedDataSource(
        entities,
        connectionOptions,
      );
      let result: any;
      try {
        result = await fn({ datasource }, ...args);
      } finally {
        await close();
      }
      return result as ReturnType<jest.ProvidesCallback>;
    };
}

export const prismaPostgresDecorator = createPrismaPostgresDecorator(
  path.join(__dirname, '..', 'prisma', 'schema.prisma'),
  connectionOptions,
);

export function createPrismaPostgresDecorator(
  schemaFile: string,
  connectionOptions: PostgresConnectionOptions,
) {
  return (
      fn: (
        context: { prismaPostgres: PrismaClient },
        ...args: any[]
      ) => ReturnType<jest.ProvidesCallback>,
    ) =>
    async (...args: any[]) => {
      const { client, close } = await getInitializedPrismaPostgres(
        schemaFile,
        connectionOptions,
      );
      let result: any;
      try {
        result = await fn({ prismaPostgres: client }, ...args);
      } finally {
        await close();
      }
      return result as ReturnType<jest.ProvidesCallback>;
    };
}
