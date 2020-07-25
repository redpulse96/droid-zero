import { UserAccess } from 'src/modules/userAccess/userAccess.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

@Entity({ name: 'users' })
export class Users {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')

  public id?: string;

  @Column()

  public name: string;

  @Column()

  public mobile_number: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })

  public primary_address: any;

  @Column({
    type: 'simple-json',
    nullable: true,
  })

  public secondary_address: any;

  @Column({
    nullable: true,
  })

  public email: string;

  @Column({ select: false })
  public password: string;

  @Column({ default: 0 })

  public login_attempts: number;

  @Column({
    nullable: true,
  })

  public api_key?: string;

  @Column({
    nullable: true,
  })

  public password_reset_token?: string;

  @Column({
    nullable: true,
  })

  public password_reset_token_ttl?: Date;

  @Column({ default: false })

  public is_locked: boolean;

  @Column({ default: false })
  public is_admin: boolean;

  @Column({ default: false })
  public is_portal_user: boolean;

  @ManyToOne(
    type => Users,
    user => user.child_users,
  )
  parent_user: Users;

  @OneToMany(
    type => Users,
    user => user.parent_user,
  )
  child_users: Users[];

  @OneToMany(
    type => UserAccess,
    userAccess => userAccess.user,
  )

  public user_access: UserAccess;

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
