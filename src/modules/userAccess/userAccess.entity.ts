import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../user/user.entity';
import { ObjectType, Field } from 'type-graphql';

@Entity()
@ObjectType()
export class UserAccess {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public userId: string;

  @Column({ default: false })
  @Field()
  public groupAdmin: boolean;

  @Column({ default: 20 })
  @Field()
  public maxGroupUsers: number;

  @OneToOne(
    type => Users,
    user => user.access,
  )
  @JoinColumn()
  public user: Users;
}
