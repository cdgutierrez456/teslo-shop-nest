import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {

  @ApiProperty({ example: 'T-Shirt Teslo', description: 'Product title', minLength: 1 })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ example: 29.99, description: 'Product price', required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 'Classic cotton t-shirt', description: 'Product description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 't_shirt_teslo', description: 'SEO-friendly slug (auto-generated if omitted)', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 10, description: 'Units in stock', required: false })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: ['S', 'M', 'L', 'XL'], description: 'Available sizes' })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({ example: 'men', description: 'Target gender', enum: ['men', 'women', 'kid', 'unisex'] })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({ example: ['shirt', 'cotton'], description: 'Product tags', required: false })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], description: 'Product image filenames', required: false })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];

}
