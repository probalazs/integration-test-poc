import { faker } from '@faker-js/faker';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { PrismaClient } from '../prisma/client';
import { execSync } from 'child_process';

export async function getInitializedPrismaPostgres(
  schemaFile: string,
  connectionOptions: PostgresConnectionOptions,
): Promise<{
  client: PrismaClient;
  close: () => Promise<void>;
}> {
  const schemaName = getSchemaName();
  const connectionUrl = getConnectionString(connectionOptions, schemaName);
  const client = new PrismaClient({
    datasources: {
      db: {
        url: connectionUrl,
      },
    },
  });

  await createTestSchema(client, schemaName);
  initializeDb(connectionUrl, schemaFile);
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

function initializeDb(connectionUrl: string, schemaFile: string): void {
  execSync(
    `npx prisma db push --skip-generate --accept-data-loss --schema=${schemaFile}`,
    {
      env: {
        ...process.env,
        DATABASE_URL: connectionUrl,
      },
    },
  );
}
