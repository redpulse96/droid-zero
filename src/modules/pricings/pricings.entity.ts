import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from '../products/products.entity';
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}
enum TaxType {
  Percentage = 'percentage',
  DiscountPercentage = 'discount_percentage',
  Discount = 'discount',
  Absolute = 'absolute',
}

@Entity({ name: 'pricings' })
export class Pricings {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column({
    type: 'enum',
    enum: TaxType,
    default: TaxType.Percentage,
  })
  public type: string;

  @Column()
  public is_tax_applicable: boolean;

  @Column()
  public base_value: number;

  @Column()
  public final_value: number;

  @OneToOne(
    type => Products,
    product => product.id,
  )
  @JoinColumn()
  public product: Products;

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
