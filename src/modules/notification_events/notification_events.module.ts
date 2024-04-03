import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationTemplates } from "./entity/notification_events.entity";
import { NotificationTemplatesService } from "./notification_events.service";
import { NotificationTemplatesController } from "./notification_events.controller";
import { NotificationTemplateConfig } from "../notification_template_config/entity/notification_template_config.entity";
import { NotificationTemplateConfigService } from "../notification_template_config/notification_template_config.service";
import { NotificationTemplateConfigController } from "../notification_template_config/notification_template_config.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationTemplates,
      NotificationTemplateConfig,
    ]),
  ],
  providers: [NotificationTemplatesService, NotificationTemplateConfigService],
  controllers: [
    NotificationTemplatesController,
    NotificationTemplateConfigController,
  ],
  exports: [NotificationTemplatesService, NotificationTemplateConfigService],
})
export class NotificationEventsModule {}
