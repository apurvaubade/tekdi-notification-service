import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
// import { Notification_Template_Config } from './entity/notification_template_config.entity';
import { NotificationTemplateConfig } from "./entity/notification_template_config.entity";

@Injectable()
export class NotificationTemplateConfigService {
  constructor(
    @InjectRepository(NotificationTemplateConfig)
    private notificationTempConfigRepository: Repository<NotificationTemplateConfig>
  ) {}

  async findAll(): Promise<NotificationTemplateConfig[]> {
    return await this.notificationTempConfigRepository.find();
  }

  async create(
    notification_template_config: NotificationTemplateConfig
  ): Promise<NotificationTemplateConfig> {
    return await this.notificationTempConfigRepository.save(
      notification_template_config
    );
  }

  async update(
    notification_template_config: NotificationTemplateConfig
  ): Promise<UpdateResult> {
    return await this.notificationTempConfigRepository.update(
      notification_template_config.id,
      notification_template_config
    );
  }

  async delete(id): Promise<DeleteResult> {
    return await this.notificationTempConfigRepository.delete(id);
  }

  // async getNotificationConfigByIDandLanguage(id,language): Promise<Notification_Template_Config>
  // {
  //     console.log(id,language);
  //     let Notification_Config_Event = null;
  //     Notification_Config_Event = await this.notificationTempConfigRepository.find(
  //         { where:
  //             { template_id: "2",language:"en-US"}
  //         }
  //     );
  //     return  Promise.resolve(Notification_Config_Event);
  //    // return await this.notificationEventsRepository.findOne({Notification_Events.action:action});

  // }

  async getNotificationConfigByIDandLanguage(
    id,
    language
  ): Promise<NotificationTemplateConfig> {
    const Notification_Config_Event =
      await this.notificationTempConfigRepository.findOne({
        where: { language: language, template_id: id },
      });
    return Notification_Config_Event;
    // return await this.notificationEventsRepository.findOne({Notification_Events.action:action});
  }
}
