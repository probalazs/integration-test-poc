import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name!: string;
}
