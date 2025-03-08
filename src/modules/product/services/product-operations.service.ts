import { Injectable } from '@nestjs/common';
import { ProductDalService } from './product-dal.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { Product } from '../product.entity';
import { EntityNotFoundError } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductOperationsService {
  constructor(private readonly productDalService: ProductDalService) {}

  async createProduct(createProductDto: CreateProductDto): Promise<ProductDto> {
    return mapProductToDto(
      await this.productDalService.create(createProductDto),
    );
  }

  async findAllProducts(): Promise<ProductDto[]> {
    return (await this.productDalService.findAll()).map(mapProductToDto);
  }

  async findProductById(id: string): Promise<ProductDto> {
    try {
      return mapProductToDto(await this.productDalService.findById(id));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Product not found');
      }
      throw error;
    }
  }
}

function mapProductToDto(product: Product): ProductDto {
  return {
    id: product.id,
    name: product.name,
  };
}
