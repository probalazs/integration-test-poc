import { faker } from '@faker-js/faker';
import { DataSource, createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export async function getInitializedDataSource(
  entities: any[],
  connectionOptions: PostgresConnectionOptions,
): Promise<{
  datasource: DataSource;
  close: () => Promise<void>;
}> {
  const datasource = getDataSource(connectionOptions, entities);
  await createTestSchema(
    getSchemaFromDataSource(datasource),
    connectionOptions,
  );
  await datasource.initialize();
  return {
    datasource,
    close: () => destroyDataSource(datasource, connectionOptions),
  };
}

function getSchemaName() {
  return `test_schema_${faker.string.uuid()}`;
}

async function destroyDataSource(
  datasource: DataSource,
  connectionOptions: PostgresConnectionOptions,
): Promise<void> {
  await dropTestSchema(getSchemaFromDataSource(datasource), connectionOptions);
  await datasource.destroy();
}

function getDataSource(
  connectionOptions: PostgresConnectionOptions,
  entities: any[],
): DataSource {
  return new DataSource({
    ...connectionOptions,
    schema: getSchemaName(),
    entities,
    synchronize: true,
  });
}

async function createTestSchema(
  schemaName: string,
  connectionOptions: PostgresConnectionOptions,
): Promise<void> {
  const adminConnection = await createConnection(connectionOptions);
  await adminConnection.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
  await adminConnection.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  await adminConnection.close();
}

async function dropTestSchema(
  schemaName: string,
  connectionOptions: PostgresConnectionOptions,
): Promise<void> {
  const adminConnection = await createConnection(connectionOptions);
  await adminConnection.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
  await adminConnection.close();
}

function getSchemaFromDataSource(datasource: DataSource): string {
  return (datasource.options as PostgresConnectionOptions).schema!;
}
