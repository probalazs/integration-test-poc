import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TestPostgresConnectionOptions } from './src/test-helpers/types';

export default async function () {
  const started = await getStartedContainer();
  (global as any).__TEST_CONTAINER = started;
  setConnectionOptions(started);
}

function setConnectionOptions(started: StartedPostgreSqlContainer) {
  const connectionOptions = getConnectionOptions(started);
  process.env.__TEST_POSTGRES_CONNECTION_OPTIONS =
    JSON.stringify(connectionOptions);
}

function getStartedContainer(): Promise<StartedPostgreSqlContainer> {
  return new PostgreSqlContainer().start();
}

function getConnectionOptions(
  started: StartedPostgreSqlContainer,
): TestPostgresConnectionOptions {
  return {
    host: started.getHost(),
    port: started.getPort(),
    username: started.getUsername(),
    password: started.getPassword(),
    database: started.getDatabase(),
  };
}
