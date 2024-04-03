import { Module } from "@nestjs/common";
import { NotificationTemplateConfigService } from "./notification_template_config.service";
import { NotificationTemplateConfigController } from "./notification_template_config.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { Notification_Template_Config } from './entity/notification_template_config.entity';
import { NotificationTemplateConfig } from "./entity/notification_template_config.entity";
@Module({
  imports: [TypeOrmModule.forFeature([NotificationTemplateConfig])],

  providers: [NotificationTemplateConfigService],
  controllers: [NotificationTemplateConfigController],
  exports: [NotificationTemplateConfigService],
})
export class NotificationTemplateConfigModule {}
