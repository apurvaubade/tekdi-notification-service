// NotificationTemplates.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { NotificationTemplateConfig } from "./notificationTemplateConfig.entity";

@Entity("NotificationTemplates")
export class NotificationTemplates {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  title: string;

  @Column({ default: () => "now()" })
  createdOn: Date;

  @Column({ default: () => "now()" })
  updatedOn: Date;

  @Column()
  key: string;

  @Column()
  status: string;

  @Column({ type: "uuid" })
  createdBy: string;

  @Column({ type: "uuid" })
  updatedBy: string;

  @Column()
  context: string;

  @Column("jsonb")
  replacementTags: Record<string, any>;

  @OneToMany(
    () => NotificationTemplateConfig,
    (templateconfig) => templateconfig.template
  )
  templateconfig: NotificationTemplateConfig[];
}
