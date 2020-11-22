import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Brands } from '../brands/brands.entity';
import { Category } from '../category/category.entity';
import { Users } from '../user/user.entity';
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}
interface prices {
  name: string;
  description: string;
  type: string;
  is_tax_applicable: boolean;
  base_value: number;
  final_value: number;
}

@Entity({ name: 'products' })
export class Products {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public name: string;

  @Column({
    type: 'varchar',
    default: null,
    nullable: true,
  })
  public code: string;

  @Column({
    type: 'varchar',
    default: null,
    nullable: true,
  })
  public group: string;

  @Column({
    type: 'varchar',
    default: null,
    nullable: true,
  })
  public description: string;

  @Column({
    type: 'varchar',
    default: null,
    nullable: true,
  })
  public image_path: string;

  @ManyToOne(
    (type) => Brands,
    (brand) => brand.id,
  )
  public brand: Brands;

  @ManyToOne(
    (type) => Category,
    (category) => category.id,
  )
  public category: Category;

  @Column({
    default: 0,
    nullable: true,
  })
  public available_quantity: number;

  @Column({
    default: 1000,
    nullable: true,
  })
  public maximum_allowed_quantity: number;

  @Column({
    default: null,
    nullable: true,
  })
  public base_price: number;

  @Column({
    default: null,
    nullable: true,
  })
  public total_amount: number;

  @Column({
    default: false,
  })
  public is_tax_applicable: boolean;

  @Column({
    default: null,
    nullable: true,
  })
  public tax_type: string;

  @Column({
    default: null,
    nullable: true,
  })
  public tax_value: number;

  @OneToOne(
    (type) => Users,
    (user) => user.id,
  )
  @JoinColumn()
  public created_by: Users;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Pending,
  })
  public status?: string;

  @CreateDateColumn()
  public created_at?: Date;

  @UpdateDateColumn()
  public updated_at?: Date;
}
