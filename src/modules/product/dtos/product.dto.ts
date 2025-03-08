import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsNumber()
  @IsDefined()
  id!: number;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  name!: string;
}
