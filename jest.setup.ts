import { getConnectionOptions, initContainer } from './src/test-connection';

export default async function () {
  await initContainer();
  await setConnectionOptions();
}

async function setConnectionOptions() {
  const connectionOptions = await getConnectionOptions();
  process.env.__TEST_CONNECTION_OPTIONS = JSON.stringify(connectionOptions);
}
