import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { SubCategory } from '../sub-category/sub-category.entity';
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

  @Column()
  public name: string;

  @Column()
  public code: string;

  @Column()
  public description: string;

  @Column({ default: null })
  public group: string;

  @Column({ default: null })
  public image_path: string;

  @ManyToOne(
    type => SubCategory,
    sub_category => sub_category.id,
  )
  sub_category: SubCategory;

  @Column()
  public total_amount: number;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  prices: prices[];

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
