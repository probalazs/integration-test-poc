import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import { ProductDalService } from './product-dal.service';
import { ProductOperationsService } from './product-operations.service';
import {
  createCreateProductDto,
  createProduct,
  createProductDto,
} from '../test-data-factory';
import { EntityNotFoundError } from 'typeorm';
import { Product } from '../product.entity';
import { NotFoundException } from '@nestjs/common';
describe('ProductOperationsService', () => {
  describe('createProduct', () => {
    it('should return created product', async () => {
      const product = createProduct();
      const service = createService({
        productDalService: createMock<ProductDalService>({
          create: jest.fn().mockResolvedValue(product),
        }),
      });

      const result = await service.createProduct(createProductDto());

      expect(result).toEqual(
        createProductDto({ id: product.id, name: product.name }),
      );
    });

    it('should throw error if product is not created', async () => {
      const error = new Error('Product not created');
      const service = createService({
        productDalService: createMock<ProductDalService>({
          create: jest.fn().mockRejectedValue(error),
        }),
      });

      await expect(service.createProduct(createProductDto())).rejects.toThrow(
        error,
      );
    });

    it('should create product from given dto', async () => {
      const dto = createCreateProductDto();
      const create = jest.fn().mockResolvedValue(createProduct(dto));
      const service = createService({
        productDalService: createMock<ProductDalService>({
          create,
        }),
      });

      await service.createProduct(dto);

      expect(create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllProducts', () => {
    it('should return all products', async () => {
      const products = [createProduct(), createProduct()];
      const service = createService({
        productDalService: createMock<ProductDalService>({
          findAll: jest.fn().mockResolvedValue(products),
        }),
      });

      const result = await service.findAllProducts();

      expect(result).toEqual(products.map(createProductDto));
    });
  });

  describe('findProductById', () => {
    it('should return product by id', async () => {
      const product = createProduct();
      const service = createService({
        productDalService: createMock<ProductDalService>({
          findById: jest.fn().mockResolvedValue(product),
        }),
      });

      const result = await service.findProductById(product.id);

      expect(result).toEqual(createProductDto(product));
    });

    it('should throw error if product is not found', async () => {
      const id = faker.string.uuid();
      const service = createService({
        productDalService: createMock<ProductDalService>({
          findById: jest
            .fn()
            .mockRejectedValue(new EntityNotFoundError(Product, { id })),
        }),
      });

      await expect(service.findProductById(id)).rejects.toThrow(
        new NotFoundException('Product not found'),
      );
    });
  });
});

function createService({
  productDalService = createMock<ProductDalService>(),
}: Partial<{
  productDalService: ProductDalService;
}> = {}): ProductOperationsService {
  return new ProductOperationsService(productDalService);
}
