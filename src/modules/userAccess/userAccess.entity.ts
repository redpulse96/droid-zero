import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../user/user.entity';
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

@Entity()
@ObjectType()
export class UserAccess {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public user_id: string;

  @Column({ default: null })
  @Field()
  public access_right: string;

  @OneToOne(
    (type) => Users,
    (user) => user.user_access,
  )
  @JoinColumn()
  public user: Users;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Active,
  })
  public status?: string;

  @CreateDateColumn()
  @Field()
  public created_at?: Date;

  @UpdateDateColumn()
  @Field()
  public updated_at?: Date;
}
