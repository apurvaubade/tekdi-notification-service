import { Module } from "@nestjs/common";
import { NotificationTemplatesService } from "./notification_events.service";
import { NotificationTemplatesController } from "./notification_events.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationTemplates } from "./entity/notificationTemplate.entity";
import { NotificationTemplateConfig } from "./entity/notificationTemplateConfig.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationTemplates,
      NotificationTemplateConfig,
    ]),
  ],
  providers: [NotificationTemplatesService],
  controllers: [NotificationTemplatesController],
  exports: [NotificationTemplatesService],
})
export class NotificationEventsModule {}
