import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from '../products/products.entity';
import { Users } from '../user/user.entity';
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}
@Entity({ name: 'carts' })
export class Carts {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @ManyToOne(
    (type) => Users,
    (user) => user.id,
  )
  @JoinColumn()
  public user: Users;

  @ManyToOne(
    (type) => Products,
    (product) => product.id,
  )
  @JoinColumn()
  public product: Products;

  @Column({
    default: 0,
  })
  public quantity: number;

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
