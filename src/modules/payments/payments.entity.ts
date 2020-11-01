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

@Entity({ name: 'payments' })
export class Payments {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column()
  public entity: string;

  @Column()
  public payment_id: string;

  @Column()
  public currency: string;

  @Column()
  public amount: string;

  @Column({
    default: null,
  })
  public description: string;

  @Column()
  public email: string;

  @Column()
  public contact: string;

  @Column()
  public bank: string;

  @Column()
  public method: string;

  @Column()
  public order_id: string;

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
