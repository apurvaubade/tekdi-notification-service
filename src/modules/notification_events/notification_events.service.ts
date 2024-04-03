import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
// import { NotificationTemplates } from "./notification-templates.entity";
import { NotificationTemplates } from "./entity/notification_events.entity";
import { Response } from "express";
import APIResponse from "src/common/utils/response";
import { NotificationTemplateConfig } from "../notification_template_config/entity/notification_template_config.entity";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class NotificationTemplatesService {
  constructor(
    @InjectRepository(NotificationTemplates)
    private readonly notificationTemplatesRepository: Repository<NotificationTemplates>,
    @InjectRepository(NotificationTemplateConfig)
    private readonly notificationTempConfigRepository: Repository<NotificationTemplateConfig>
  ) {}

  async findAll(): Promise<NotificationTemplates[]> {
    return await this.notificationTemplatesRepository.find();
  }

  async findOne(id: number): Promise<NotificationTemplates | undefined> {
    return await this.notificationTemplatesRepository.findOne({
      where: { id },
    });
  }

  async create(data, response: Response): Promise<Response> {
    const apiId = "create.notification.notificationtemplate";

    try {
      // Check if context already exists in the template table
      const existingTemplate =
        await this.notificationTemplatesRepository.findOne({
          where: { context: data.context },
        });
      if (existingTemplate) {
        throw new Error(
          "Context already exists. Please provide a unique context."
        );
      }
      // Create NotificationTemplates entity
      const entity = await this.notificationTemplatesRepository.save(data);

      // Create Email NotificationTemplateConfig entity
      const emailConfigData: NotificationTemplateConfig = {
        id: uuidv4(),
        language: "en",
        type: "email",
        subject: data.email.subject,
        status: "Published",
        template_id: entity.id,
        body: data.email.body,
        createdOn: new Date(),
      };
      console.log("Email Config data => ", emailConfigData);
      await this.notificationTempConfigRepository.save(emailConfigData);

      // Check if push notification data exists
      if (data.push) {
        // Create Push NotificationTemplateConfig entity
        const pushConfigData: NotificationTemplateConfig = {
          id: uuidv4(),
          language: "en",
          type: "push",
          // Assuming push notification data is provided in the data object
          subject: data.push.subject,

          body: data.push.body,
          status: "Published",
          template_id: entity.id,
          createdOn: new Date(),
        };
        console.log("Push Config data => ", pushConfigData);
        await this.notificationTempConfigRepository.save(pushConfigData);
      }

      const finalResponse = entity;

      return response
        .status(HttpStatus.OK)
        .send(APIResponse.success(apiId, finalResponse, "OK"));
    } catch (e) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(
          APIResponse.error(
            apiId,
            "Something went wrong in event creation",
            JSON.stringify(e),
            "INTERNAL_SERVER_ERROR"
          )
        );
    }
  }

  async update(
    id: number,
    data: Partial<NotificationTemplates>
  ): Promise<NotificationTemplates | undefined> {
    await this.notificationTemplatesRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.notificationTemplatesRepository.delete(id);
  }
}
