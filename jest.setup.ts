import { startPostgres } from './src/test-helpers/loaders';

export default async function () {
  await startPostgres();
}
