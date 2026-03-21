import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { AuthModule } from '../auth/auth.module';

import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService, TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    AuthModule
  ]
})
export class ProductsModule {}
