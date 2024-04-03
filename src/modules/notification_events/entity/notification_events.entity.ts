import { Json } from "twilio/lib/interfaces";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "NotificationTemplates" })
export class NotificationTemplates {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  context: string;

  @Column()
  key: string;

  @Column()
  status: string;

  @Column()
  title: string;

  @Column({ type: "jsonb" })
  replacement: object;

  @Column()
  createdOn: Date;

  @Column({ type: "uuid" })
  createdBy: string;

  @Column()
  updatedOn: Date;

  @Column({ type: "uuid" })
  updatedBy: string;
}
