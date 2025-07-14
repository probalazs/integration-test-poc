import { faker } from '@faker-js/faker';
import { createObjectFactoryWithEmptyOverrides } from '../../test-helpers/factory';
import { Warehouse } from '../../prisma/client';

export const createWarehouse = createObjectFactoryWithEmptyOverrides<Warehouse>(
  () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    country: faker.location.country(),
  }),
);
