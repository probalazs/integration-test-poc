import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Product } from '../product.entity';
import { omit } from 'ramda';

@Injectable()
export class ProductDalService {
  constructor(private readonly dataSource: DataSource) {}

  async findAll(): Promise<Product[]> {
    return this.dataSource.getRepository(Product).find();
  }

  async findById(id: number): Promise<Product> {
    return this.dataSource.getRepository(Product).findOneByOrFail({ id });
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    return this.dataSource
      .getRepository(Product)
      .save(omit(['id'], product as any));
  }
}
