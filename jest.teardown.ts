export default async function () {
  await stopContainer();
  clearConnectionOptions();
}

async function stopContainer() {
  const container = (global as any).__TEST_CONTAINER;
  if (!container) {
    await container.stop();
  }
}

function clearConnectionOptions() {
  delete process.env.__TEST_CONNECTION_OPTIONS;
}
