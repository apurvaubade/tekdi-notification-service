import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
// import { NotificationEvents } from 'src/modules/notification_events/entity/notification_events.entity';

@Entity("NotificationTemplateConfig")
export class NotificationTemplateConfig {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  //@ManyToOne(() => Notification_Events, (Notification_Events) => Notification_Events.id)
  // @JoinColumn({ name: 'template_id', referencedColumnName: 'id' })
  //test: string;

  @Column()
  template_id: number;

  @Column()
  language: string;

  @Column()
  type: string;

  @Column()
  subject: string;

  @Column()
  body: string;

  @Column()
  status: string;

  @Column()
  createdOn: Date;

  @Column({ type: "uuid" })
  createdBy?: string;

  @Column()
  updatedOn?: Date;

  @Column({ type: "uuid" })
  updatedBy?: string;
}
