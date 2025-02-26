import { getInitializedDataSource } from './test-helpers';
import { Product } from './entities/product';
import { faker } from '@faker-js/faker';

describe('Main', () => {
  it('should create a new product', async () => {
    const price = faker.number.int({ min: 1, max: 100 });
    const dataSource = await getInitializedDataSource();
    const productRepository = dataSource.getRepository(Product);

    const product = new Product();
    product.price = price;

    await productRepository.save(product);
    const savedProduct = await productRepository.findOneBy({ price });

    expect(savedProduct?.id).toBeDefined();
    expect(parseInt(savedProduct?.price.toString() ?? '0')).toBe(price);
  });
});
