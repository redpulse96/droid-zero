import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pricings } from '../pricings/pricings.entity';
import { SubCategory } from '../sub-category/sub-category.entity';
import { Users } from '../user/user.entity';
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

@Entity({ name: 'products' })
export class Products {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column()
  public name: string;

  @Column()
  public code: string;

  @Column()
  public description: string;

  @Column()
  public group: string;

  @Column()
  public image_path: string;

  @ManyToOne(
    type => SubCategory,
    sub_category => sub_category.id,
  )
  sub_category: SubCategory;

  @Column()
  public total_amount: number;

  @OneToMany(
    type => Pricings,
    price => price.product,
  )
  @JoinColumn()
  prices: Pricings[];

  @OneToOne(
    type => Users,
    user => user.id,
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
