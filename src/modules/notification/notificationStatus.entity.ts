import { Notification } from 'src/modules/notification/notification.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class NotificationStatus {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ select: false })
  public userId: string;

  @Column({ select: false })
  public userNotificationId: string;

  @Column()
  public status: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column()
  public uuid: string;

  @ManyToOne(
    (type) => Notification,
    (notification) => notification.notificationStatuses,
  )
  public notification: Notification;
}
