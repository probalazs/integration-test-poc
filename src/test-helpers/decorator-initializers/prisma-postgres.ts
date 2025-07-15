import { faker } from '@faker-js/faker';
import { execSync } from 'child_process';
import { PrismaClient } from '../../prisma/client';
import { TestPostgresConnectionOptions } from '../types';

export type PrismaPostgresConfig = {
  schemaFile: string;
  dbEnv: string;
  connectionOptions: TestPostgresConnectionOptions;
};

export async function getInitializedPrismaPostgres(
  config: PrismaPostgresConfig,
): Promise<{
  prismaPostgresClient: PrismaClient;
  close: () => Promise<void>;
}> {
  const schemaName = getSchemaName();
  const connectionUrl = getConnectionUrl(config.connectionOptions, schemaName);
  const client = new PrismaClient({
    datasources: {
      db: {
        url: connectionUrl,
      },
    },
  });

  await createTestSchema(client, schemaName);
  initializeDb(connectionUrl, config.schemaFile, config.dbEnv);
  await client.$connect();
  return {
    prismaPostgresClient: client,
    close: () => destroyPrismaPostgres(client, schemaName),
  };
}

function getConnectionUrl(
  connectionOptions: TestPostgresConnectionOptions,
  schemaName: string,
) {
  return `postgresql://${connectionOptions.username}:${connectionOptions.password}@${connectionOptions.host}:${connectionOptions.port}/${connectionOptions.database}?schema=${schemaName}`;
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

function initializeDb(
  connectionUrl: string,
  schemaFile: string,
  dbEnv: string,
): void {
  execSync(
    `npx prisma db push --skip-generate --accept-data-loss --schema=${schemaFile}`,
    {
      env: {
        ...process.env,
        [dbEnv]: connectionUrl,
      },
    },
  );
}
