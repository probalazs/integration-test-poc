import { stopContainer } from './src/test-connection';
export default async function () {
  await stopContainer();
  clearConnectionOptions();
}

function clearConnectionOptions() {
  delete process.env.__TEST_CONNECTION_OPTIONS;
}
