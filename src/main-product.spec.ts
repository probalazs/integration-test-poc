import { Product } from './entities/product';
import { faker } from '@faker-js/faker';
import { dataSourceDecorator } from './test-decorators';

describe('Product', () => {
  it(
    'should create a new product',
    dataSourceDecorator(async ({ datasource }) => {
      const price = faker.number.int({ min: 1, max: 100 });
      const productRepository = datasource.getRepository(Product);

      const product = new Product();
      product.price = price;

      await productRepository.save(product);
      const savedProduct = await productRepository.findOneBy({ price });

      expect(savedProduct?.id).toBeDefined();
      expect(parseInt(savedProduct?.price.toString() ?? '0')).toBe(price);
    }),
  );
});
