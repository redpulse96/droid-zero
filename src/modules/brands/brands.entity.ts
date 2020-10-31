import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

@Entity({ name: 'brands' })
export class Brands {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({
    default: null,
  })
  public name: string;

  @Column({
    default: null,
  })
  public code: string;

  @Column({
    default: null,
  })
  public description: string;

  @Column()
  public image_path: string;

  @OneToMany(
    (type) => Products,
    (product) => product.brand,
  )
  public product: Products[];

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
