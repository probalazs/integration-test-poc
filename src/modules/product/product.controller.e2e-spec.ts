import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductModule } from './product.module';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { CommonModule } from '../common/common.module';
import { dataSourceDecorator } from '../../test-helpers/decorators';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { Product } from './product.entity';
import { createProduct } from './test-data-factory';
import { ProductDto } from './dtos/product.dto';
import { faker } from '@faker-js/faker';

describe('ProductController (e2e)', () => {
  describe('GET /product', () => {
    it(
      'should return status 200',
      dataSourceDecorator(async ({ datasource }) => {
        const app = await createProductModule(
          datasource.options as PostgresConnectionOptions,
        );
        await request(app.getHttpServer()).get('/product').expect(200);
      }),
    );

    it(
      'should return all products',
      dataSourceDecorator(async ({ datasource }) => {
        const products = [createProduct(), createProduct()];
        await addProducts(datasource, products);
        const app = await createProductModule(
          datasource.options as PostgresConnectionOptions,
        );

        const response = await request(app.getHttpServer()).get('/product');

        expect(new Set(response.body)).toEqual(
          new Set(mapToProductDto(products)),
        );
      }),
    );
  });

  describe('GET /product/:id', () => {
    it(
      'should return status 200',
      dataSourceDecorator(async ({ datasource }) => {
        const id = faker.string.uuid();
        const product = createProduct({ id } as any);
        await addProducts(datasource, [product]);
        const app = await createProductModule(
          datasource.options as PostgresConnectionOptions,
        );

        await request(app.getHttpServer()).get(`/product/${id}`).expect(200);
      }),
    );

    it(
      'should return status 404',
      dataSourceDecorator(async ({ datasource }) => {
        const id = faker.string.uuid();
        const app = await createProductModule(
          datasource.options as PostgresConnectionOptions,
        );

        await request(app.getHttpServer()).get(`/product/${id}`).expect(404);
      }),
    );

    it(
      'should return the product',
      dataSourceDecorator(async ({ datasource }) => {
        const id = faker.string.uuid();
        const product = createProduct({ id } as any);
        await addProducts(datasource, [product]);
        const app = await createProductModule(
          datasource.options as PostgresConnectionOptions,
        );

        const response = await request(app.getHttpServer()).get(
          `/product/${id}`,
        );

        expect(response.body).toEqual(mapToProductDto([product])[0]);
      }),
    );
  });

  describe('PUT /product', () => {
    it(
      'should return status 201',
      dataSourceDecorator(async ({ datasource }) => {
        const app = await createProductModule(
          datasource.options as PostgresConnectionOptions,
        );

        const response = await request(app.getHttpServer())
          .put('/product')
          .send({
            name: faker.commerce.productName(),
          });

        expect(response.status).toBe(201);
      }),
    );

    it(
      'should return status 400 if input is invalid',
      dataSourceDecorator(async ({ datasource }) => {
        const app = await createProductModule(
          datasource.options as PostgresConnectionOptions,
        );

        const response = await request(app.getHttpServer())
          .put('/product')
          .send({
            name: '',
          });

        expect(response.status).toBe(400);
      }),
    );

    it(
      'should return created product',
      dataSourceDecorator(async ({ datasource }) => {
        const name = faker.commerce.productName();
        const app = await createProductModule(
          datasource.options as PostgresConnectionOptions,
        );

        const response = await request(app.getHttpServer())
          .put('/product')
          .send({
            name,
          });

        const insertedProduct = await datasource
          .getRepository(Product)
          .findOneByOrFail({ name });

        expect(mapToProductDto([insertedProduct])[0]).toEqual(response.body);
      }),
    );
  });
});

async function createProductModule(
  connectionOptions: PostgresConnectionOptions,
): Promise<INestApplication<App>> {
  const moduleFixture = await Test.createTestingModule({
    imports: [ProductModule, CommonModule.forRoot(connectionOptions)],
  }).compile();
  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}

async function addProducts(datasource: DataSource, products: Product[]) {
  return datasource.getRepository(Product).save(products);
}

function mapToProductDto(products: Product[]): ProductDto[] {
  return products.map((product) => Object.assign(new ProductDto(), product));
}
