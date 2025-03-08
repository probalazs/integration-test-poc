import { createObjectFactory } from '../../test-helpers/factory';
import { Product } from './product.entity';
import { faker } from '@faker-js/faker';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductDto } from './dtos/product.dto';

export const createProduct = createObjectFactory(() => new Product())(() => ({
  name: faker.commerce.productName(),
}));

export const createProductDto = createObjectFactory(() => new ProductDto())(
  () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
  }),
);

export const createCreateProductDto = createObjectFactory(
  () => new CreateProductDto(),
)(() => ({
  name: faker.commerce.productName(),
}));
