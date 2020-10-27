import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, OneToOne, PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Users } from '../user/user.entity';
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}
interface components {
  name: string;
  description: string;
  type: string;
  is_tax_applicable: boolean;
  base_value: number;
  tax_value: number;
  final_value: number;
}

@Entity({ name: 'orders' })
export class Orders {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({
    type: 'text',
    default: null,
    unique: true,
  })
  public reference_id: string;

  @Column({
    type: 'text',
    default: null,
  })
  public remarks: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  public components: components[];

  @Column({
    type: 'double precision',
    default: null,
  })
  public total_amount: number;

  @OneToOne(
    (type) => Users,
    (user) => {
      return user.id;
    },
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
