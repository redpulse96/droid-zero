import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubCategory } from '../sub-category/sub-category.entity';
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

@Entity({ name: 'category' })
export class Category {
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

  @Column({
    default: null,
  })
  public image_path: string;

  @OneToMany(
    (type) => SubCategory,
    (sub_category) => sub_category.category,
  )
  public sub_categories: SubCategory[];

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
