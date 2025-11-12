import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Category } from '../types/types';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  tags: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;
}
