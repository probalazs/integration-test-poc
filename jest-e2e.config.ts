import config from './jest.config';
import { Config } from 'jest';

const e2eConfig: Config = {
  ...config,
  testMatch: ['**/*.e2e-spec.ts'],
  collectCoverage: false,
};

export default e2eConfig;
