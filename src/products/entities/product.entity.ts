import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {

  @ApiProperty({
    example: '94f05e2a-32c4-4942-8c6f-9049d3870c2e',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '94f05e2a-32c4-4942-8c6f-9049d3870c2e',
    description: 'Product ID',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  title: string;

  @ApiProperty({
    example: '94f05e2a-32c4-4942-8c6f-9049d3870c2e',
    description: 'Product ID',
    uniqueItems: true
  })
  @Column('float', {
    default: 0
  })
  price: number;

  @ApiProperty({
    example: '94f05e2a-32c4-4942-8c6f-9049d3870c2e',
    description: 'Product ID',
    uniqueItems: true
  })
  @Column('text', {
    nullable: true
  })
  description: string;

  @ApiProperty({
    example: '94f05e2a-32c4-4942-8c6f-9049d3870c2e',
    description: 'Product ID',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  slug: string;

  @ApiProperty({
    example: '20',
    description: 'Stock Quantity',
    uniqueItems: true
  })
  @Column('int', {
    default: 0
  })
  stock: number;

  @ApiProperty({
    example: '["S","M"]',
    description: 'Product ID',
    uniqueItems: true
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'men/women',
    description: 'Gender',
    uniqueItems: true
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: '["shirt", "jacket"]',
    description: 'Product tags',
    uniqueItems: true
  })
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];

  @ApiProperty({
    example: '["1740176-00-A_0_2000.jpg","1740176-00-A_1.jpg"]',
    description: 'Image IDs',
    uniqueItems: true
  })
  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[];

  // MenyToOne
  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }
  )
  user: User

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

}
