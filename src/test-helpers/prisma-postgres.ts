import { faker } from '@faker-js/faker';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { PrismaClient } from '../prisma/client';

export async function getInitializedPrismaPostgres(): Promise<{
  client: PrismaClient;
  close: () => Promise<void>;
}> {
  const connectionOptions = getConnectionOptions();
  const schemaName = getSchemaName();
  const client = new PrismaClient({
    datasources: {
      db: {
        url: getConnectionString(connectionOptions, schemaName),
      },
    },
  });

  await createTestSchema(client, schemaName);
  await client.$connect();
  return {
    client,
    close: () => destroyPrismaPostgres(client, schemaName),
  };
}

function getConnectionString(
  options: PostgresConnectionOptions,
  schemaName: string,
): string {
  return `postgresql://${options.username}:${options.password as string}@${options.host}:${options.port}/${options.database}?schema=${schemaName}`;
}

function getSchemaName() {
  return `test_schema_${faker.string.uuid()}`;
}

async function destroyPrismaPostgres(
  client: PrismaClient,
  schemaName: string,
): Promise<void> {
  await dropTestSchema(client, schemaName);
  await client.$disconnect();
}

async function createTestSchema(
  client: PrismaClient,
  schemaName: string,
): Promise<void> {
  await client.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
  );
  await client.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
}

async function dropTestSchema(
  client: PrismaClient,
  schemaName: string,
): Promise<void> {
  await client.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
  );
}

function getConnectionOptions(): PostgresConnectionOptions {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(process.env.__TEST_CONNECTION_OPTIONS!);
}
