import { UserAccess } from 'src/modules/userAccess/userAccess.entity';
// import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  OneToMany, PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending'
}

@Entity({ name: 'users' })
// @ObjectType()
export class Users {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  // @Field()
  public id?: string;

  @Column()
  // @Field()
  public name: string;

  @Column()
  // @Field()
  public mobile_number: string;

  @Column({
    type: "simple-json",
    nullable: true
  })
  // @Field()
  public primary_address: any;

  @Column({
    type: "simple-json",
    nullable: true
  })
  // @Field()
  public secondary_address: any;

  @Column({
    nullable: true
  })
  // @Field()
  public email: string;

  @Column({ select: false })
  public password: string;

  @Column({ default: 0 })
  // @Field()
  public login_attempts: number;

  @Column({
    nullable: true
  })
  // @Field()
  public api_key?: string;

  @Column({
    nullable: true
  })
  // @Field()
  public password_reset_token?: string;

  @Column({
    nullable: true
  })
  // @Field()
  public password_reset_token_ttl?: Date;

  @Column({ default: false })
  // @Field()
  public is_locked: boolean;

  @Column({ default: false })
  public is_admin: boolean;

  @Column({ default: false })
  public is_portal_user: boolean;

  @ManyToOne(type => Users, user => user.child_users)
  parent_user: Users;

  @OneToMany(type => Users, user => user.parent_user)
  child_users: Users[];

  @OneToMany(
    type => UserAccess,
    userAccess => userAccess.user,
  )
  // @Field(type => UserAccess)
  public user_access: UserAccess;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.Pending
  })
  public status?: string;

  @CreateDateColumn()
  // @Field()
  public created_at?: Date;

  @UpdateDateColumn()
  // @Field()
  public updated_at?: Date;
}
