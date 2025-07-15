import { faker } from '@faker-js/faker';
import { execSync } from 'child_process';
import { PrismaClientSkeleton, TestPostgresConnectionOptions } from '../types';

export type PrismaPostgresConfig<T extends PrismaClientSkeleton> = {
  schemaFile: string;
  dbEnv: string;
  connectionOptions: TestPostgresConnectionOptions;
  createPrismaClient: (url: string) => T;
};

export async function getInitializedPrismaPostgres<
  T extends PrismaClientSkeleton,
>(
  config: PrismaPostgresConfig<T>,
): Promise<{
  prismaPostgresClient: T;
  close: () => Promise<void>;
}> {
  const schemaName = getSchemaName();
  const connectionUrl = getConnectionUrl(config.connectionOptions, schemaName);
  const client = config.createPrismaClient(connectionUrl);

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
  client: PrismaClientSkeleton,
  schemaName: string,
): Promise<void> {
  await dropTestSchema(client, schemaName);
  await client.$disconnect();
}

async function createTestSchema(
  client: PrismaClientSkeleton,
  schemaName: string,
): Promise<void> {
  await client.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
  );
  await client.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
}

async function dropTestSchema(
  client: PrismaClientSkeleton,
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
