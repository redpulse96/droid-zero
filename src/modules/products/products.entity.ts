import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Category } from '../category/category.entity';
import { SubCategory } from '../sub-category/sub-category.entity';
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
  public image_path: string;

  @ManyToOne(type => Category, category => category.id)
  category: Category;

  @ManyToOne(type => SubCategory, sub_category => sub_category.id)
  sub_category: SubCategory;

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
