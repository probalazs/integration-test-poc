import { stopPostgres } from './src/test-helpers/loaders';

export default async function () {
  await stopPostgres();
}
