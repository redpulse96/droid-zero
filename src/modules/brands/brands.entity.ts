import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @Column()
  public name: string;

  @Column()
  public code: string;

  @Column()
  public description: string;

  @Column()
  public image_path: string;

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
