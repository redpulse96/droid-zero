import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

@Entity({ name: 'sub_category' })
export class SubCategory {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  public name: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  public code: string;

  @Column({
    type: 'varchar',
    default: null,
    nullable: true,
  })
  public description: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  public image_path: string;

  @ManyToOne(
    (type) => Category,
    (category) => category.sub_categories,
  )
  public category: Category;

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
