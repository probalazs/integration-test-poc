import { Product } from '../product.entity';
import { createMock } from '@golevelup/ts-jest';
import { DataSource, EntityNotFoundError } from 'typeorm';
import { ProductDalService } from './product-dal.service';
import { dataSourceDecorator } from '../../../test-helpers/decorators';
import { createProduct } from '../test-data-factory';
import { omit } from 'ramda';

describe('ProductDalService', () => {
  describe('findAll', () => {
    it(
      'should return empty array if no products exist',
      dataSourceDecorator(async ({ datasource }) => {
        const service = createService({ datasource });

        const products = await service.findAll();

        expect(products).toEqual([]);
      }),
    );

    it(
      'should return all products',
      dataSourceDecorator(async ({ datasource }) => {
        const service = createService({ datasource });

        const products = [createProduct(), createProduct()];
        await addProducts(datasource, products);

        const result = await service.findAll();

        expect(result).toEqual(products);
      }),
    );
  });

  describe('findOne', () => {
    it(
      'should return an existing product',
      dataSourceDecorator(async ({ datasource }) => {
        const product = createProduct();
        await addProducts(datasource, [product]);
        const service = createService({ datasource });

        const result = await service.findOne(product.id);

        expect(result).toEqual(product);
      }),
    );

    it(
      'should throw an error if the product does not exist',
      dataSourceDecorator(async ({ datasource }) => {
        const service = createService({ datasource });

        await expect(service.findOne(1)).rejects.toThrow(EntityNotFoundError);
      }),
    );
  });

  describe('create', () => {
    it(
      'should create a product',
      dataSourceDecorator(async ({ datasource }) => {
        const service = createService({ datasource });
        const product = createProduct();
        const result = await service.create(product);

        expect(result).toEqual(expect.objectContaining(omit(['id'], product)));
      }),
    );
  });
});

function createService({
  datasource = createMock<DataSource>(),
}: Partial<{ datasource: DataSource }> = {}): ProductDalService {
  return new ProductDalService(datasource);
}

async function addProducts(datasource: DataSource, products: Product[]) {
  const repository = datasource.getRepository(Product);
  await repository.save(products);
}
