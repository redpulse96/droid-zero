import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../user/user.entity';
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}
export interface components {
  product_id: string;
  ordered_quantity: number;
  is_tax_applicable: boolean;
  tax_type: string;
  tax_value: number;
  base_value: number;
  final_value: number;
}
enum PaymentModes {
  CASH = 'cash',
  ONLINE = 'online',
}

@Entity({ name: 'orders' })
export class Orders {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public mobile_number: string;

  @Column({
    type: 'text',
    default: null,
    nullable: true,
  })
  public reference_id: string;

  @Column({
    type: 'enum',
    enum: PaymentModes,
    default: PaymentModes.CASH,
  })
  public payment_mode: PaymentModes;

  @Column({
    type: 'text',
    default: null,
    nullable: true,
  })
  public payment_id: string;

  @Column({
    type: 'text',
    default: null,
    nullable: true,
  })
  public remarks: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  public price_components: components[];

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
