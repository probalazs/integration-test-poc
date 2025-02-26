import { faker } from '@faker-js/faker';
import { config, Config } from './config';
import { DataSource, createConnection } from 'typeorm';
import { User } from './entities/user';
import { Product } from './entities/product';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export async function getInitializedDataSource(): Promise<DataSource> {
  const schemaName = getSchemaName();
  await createTestSchema(config, schemaName);
  return getDataSource(config, schemaName).initialize();
}

function getDataSource(config: Config, schema: string): DataSource {
  return new DataSource({
    ...getConnectionOptions(config),
    schema,
    entities: [User, Product],
    synchronize: true,
  });
}

async function createTestSchema(
  config: Config,
  schemaName: string,
): Promise<void> {
  const adminConnection = await createConnection(getConnectionOptions(config));
  await adminConnection.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  await adminConnection.close();
}

function getSchemaName() {
  return `test_schema_${faker.string.uuid()}`;
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
