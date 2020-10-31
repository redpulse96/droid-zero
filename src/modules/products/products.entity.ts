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
import { Brands } from '../brands/brands.entity';
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
    nullable: false,
  })
  public description: string;

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
  public image_path: string;

  @ManyToOne(
    (type) => Brands,
    (brand) => brand.id,
  )
  public brand: Brands;

  @Column()
  public total_amount: number;

  @Column()
  public available_quantity: number;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  public prices: prices[];

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
