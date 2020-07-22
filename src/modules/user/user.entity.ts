import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { NotificationStatus } from 'src/modules/notification/notificationStatus.entity';
import { UserAccess } from 'src/modules/userAccess/userAccess.entity';
import { ObjectType, Field } from 'type-graphql';

@Entity({ name: 'users' })
@ObjectType()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  public id: string;

  @Column()
  @Field()
  public email: string;

  @Column({ select: false })
  public password: string;

  @CreateDateColumn()
  @Field()
  public createdAt: Date;

  @Column({ nullable: true })
  @Field()
  public lastLogin: Date;

  @UpdateDateColumn()
  @Field()
  public updatedAt: Date;

  @Column({ default: '' })
  @Field()
  public group: string;

  @Column('simple-json', {})
  @Field(type => [String])
  public subGroups: string[];

  @Column()
  @Field()
  public apiKey: string;

  @Column({ default: 0 })
  @Field()
  public loginAttempts: number;

  @Column({ default: false })
  @Field()
  public locked: boolean;

  @Column({ default: 0 })
  @Field()
  public defaultPriority: number;

  @Column({ nullable: true })
  @Field()
  public resetToken: string;

  @Column({ nullable: true })
  public resetTokenExpires: Date;

  @Column({ default: false })
  public isAdmin: boolean;

  @Column({ default: false })
  @Field()
  public needsPasswordChange: boolean;

  @OneToMany(
    type => NotificationStatus,
    notificationStatus => notificationStatus.user,
  )
  public notifications: NotificationStatus[];

  @OneToOne(
    type => UserAccess,
    userAccess => userAccess.user,
  )
  @Field(type => UserAccess)
  public access: UserAccess;
}
