import { createMock } from '@golevelup/ts-jest';
import {
  createCreateProductDto,
  createProduct,
  createProductDto,
} from './test-data-factory';
import { ProductOperationsService } from './services/product-operations.service';
import { ProductController } from './product.controller';
import { faker } from '@faker-js/faker';

describe('ProductController', () => {
  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = [createProduct(), createProduct()];
      const controller = createController({
        productOperationsService: createMock<ProductOperationsService>({
          findAllProducts: jest.fn().mockResolvedValue(products),
        }),
      });

      const result = await controller.getAllProducts();

      expect(result).toEqual(products);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const product = createProduct();
      const controller = createController({
        productOperationsService: createMock<ProductOperationsService>({
          findProductById: jest.fn().mockResolvedValue(product),
        }),
      });

      const result = await controller.getProductById(product.id);

      expect(result).toEqual(product);
    });

    it('should get product by id', async () => {
      const id = faker.string.uuid();
      const findProductById = jest.fn().mockResolvedValue(createProductDto());
      const controller = createController({
        productOperationsService: createMock<ProductOperationsService>({
          findProductById,
        }),
      });

      await controller.getProductById(id);

      expect(findProductById).toHaveBeenCalledWith(id);
    });
  });

  describe('createProduct', () => {
    it('should return created product', async () => {
      const product = createProduct();
      const controller = createController({
        productOperationsService: createMock<ProductOperationsService>({
          createProduct: jest.fn().mockResolvedValue(product),
        }),
      });

      const result = await controller.createProduct(createProductDto());

      expect(result).toEqual(product);
    });

    it('should create product from given dto', async () => {
      const dto = createCreateProductDto();
      const createProductFn = jest.fn().mockResolvedValue(createProduct(dto));
      const controller = createController({
        productOperationsService: createMock<ProductOperationsService>({
          createProduct: createProductFn,
        }),
      });

      await controller.createProduct(dto);

      expect(createProductFn).toHaveBeenCalledWith(dto);
    });
  });
});

function createController({
  productOperationsService = createMock<ProductOperationsService>(),
}: Partial<{
  productOperationsService: ProductOperationsService;
}> = {}): ProductController {
  return new ProductController(productOperationsService);
}
