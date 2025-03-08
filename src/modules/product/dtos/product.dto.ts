import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ProductDto {
  @IsString()
  @IsDefined()
  id!: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  name!: string;
}
