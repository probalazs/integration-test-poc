import { faker } from '@faker-js/faker';
import { config, Config } from './config';
import { DataSource, createConnection } from 'typeorm';
import { User } from './entities/user';
import { Product } from './entities/product';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export function getSchemaName() {
  return `test_schema_${faker.string.uuid()}`;
}

export async function getInitializedDataSource(): Promise<{
  datasource: DataSource;
  close: () => Promise<void>;
}> {
  const datasource = getDataSource();
  await createTestSchema(getSchemaFromDataSource(datasource));
  await datasource.initialize();
  return {
    datasource,
    close: () => destroyDataSource(datasource),
  };
}

async function destroyDataSource(datasource: DataSource): Promise<void> {
  await dropTestSchema(getSchemaFromDataSource(datasource));
  await datasource.destroy();
}

function getDataSource(): DataSource {
  return new DataSource({
    ...getConnectionOptions(config),
    schema: getSchemaName(),
    entities: [User, Product],
    synchronize: true,
  });
}

async function createTestSchema(schemaName: string): Promise<void> {
  const adminConnection = await createConnection(getConnectionOptions(config));
  await adminConnection.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
  await adminConnection.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  await adminConnection.close();
}

async function dropTestSchema(schemaName: string): Promise<void> {
  const adminConnection = await createConnection(getConnectionOptions(config));
  await adminConnection.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
  await adminConnection.close();
}

function getConnectionOptions(config: Config): PostgresConnectionOptions {
  return {
    type: 'postgres',
    host: config.pgHost,
    port: config.pgPort,
    username: config.pgUser,
    password: config.pgPassword,
    database: config.pgDb,
  };
}

function getSchemaFromDataSource(datasource: DataSource): string {
  return (datasource.options as PostgresConnectionOptions).schema!;
}
