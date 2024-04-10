import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationTemplates } from "./entity/notificationTemplate.entity";
import { UpdateResult, DeleteResult } from "typeorm";
import { SearchFilterDto } from "./dto/searchTemplateType.dto";
import APIResponse from "src/common/utils/response";
import { Response } from "express";
import { async } from "rxjs";
import { remove } from "winston";
import { NotificationTemplateConfig } from "./entity/notificationTemplateConfig.entity";
import { v4 as uuidv4 } from "uuid";
import { CreateEventDto } from "./dto/notificationTemplate.dto";
import { UpdateEventDto } from "./dto/updateNotificationTemplate.dto";
import { title } from "process";
// import { NotificationTemplates } from "./entity/notification_events.entity";

@Injectable()
export class NotificationTemplatesService {
  constructor(
    @InjectRepository(NotificationTemplates)
    private readonly notificationTemplatesRepository: Repository<NotificationTemplates>,
    @InjectRepository(NotificationTemplateConfig)
    private readonly notificationTempConfigRepository: Repository<NotificationTemplateConfig>
  ) {}

  async getTemplatesTypesForEvent(
    searchFilterDto: SearchFilterDto,
    response: Response
  ) {
    const apiId = "api.get.TemplateTypeOfEvent";
    try {
      const context = searchFilterDto.filters.context;
      const queryBuilder = this.notificationTemplatesRepository
        .createQueryBuilder("template")
        .select([
          "template.title AS title",
          "template.status AS status",
          "template.key AS key",
          "templateconfig.language AS language",
          "templateconfig.subject AS subject",
          "templateconfig.body AS body",
          "templateconfig.type AS type",
        ])
        .leftJoin(
          "template.templateconfig",
          "templateconfig",
          "templateconfig.template_id = template.id"
        )
        .where("template.context = :context", { context: context });
      const result = await queryBuilder.getRawMany();
      if (result.length === 0) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .send(
            APIResponse.error(
              apiId,
              `No temnplate tyoe found`,
              "No records found.",
              "NOT_FOUND"
            )
          );
      }
      const templateconfig = result.reduce((acc, item) => {
        const { type, language, subject, body } = item;
        if (!acc[type]) {
          acc[type] = {};
        }
        Object.assign(acc[type], { language, subject, body });
        return acc;
      }, {});

      const finalResponse = {
        title: result[0]?.title || "",
        status: result[0]?.status || "",
        key: result[0]?.key || "",
        templates: templateconfig,
      };
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

  async create(data: CreateEventDto, response: Response): Promise<Response> {
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
      const emailConfigData = new NotificationTemplateConfig();
      emailConfigData.language = "en";
      emailConfigData.type = "email";
      emailConfigData.subject = data.email.subject;
      emailConfigData.status = "Published";
      emailConfigData.template_id = entity.id;
      emailConfigData.body = data.email.body;
      emailConfigData.createdOn = new Date();
      emailConfigData.updatedOn = null; // or undefined
      emailConfigData.createdBy = uuidv4();
      emailConfigData.updatedBy = uuidv4();

      console.log("Email Config data => ", emailConfigData);
      await this.notificationTempConfigRepository.save(emailConfigData);

      // Check if push notification data exists
      //   if (data.push) {
      //     // Create Push NotificationTemplateConfig entity
      //     const pushConfigData = new NotificationTemplateConfig();
      //     pushConfigData.language = "en";
      //     pushConfigData.type = "push";
      //     pushConfigData.subject = data.push.subject;
      //     pushConfigData.body = data.push.body;
      //     pushConfigData.status = "Published";
      //     pushConfigData.template_id = entity.id;
      //     pushConfigData.createdOn = new Date();
      //     pushConfigData.updatedOn = null; // or undefined
      //     pushConfigData.createdBy = uuidv4();
      //     pushConfigData.updatedBy = uuidv4();

      //     console.log("Push Config data => ", pushConfigData);
      //     await this.notificationTempConfigRepository.save(pushConfigData);
      //   }

      const finalResponse = entity;

      return response
        .status(HttpStatus.OK)
        .send(APIResponse.success(apiId, finalResponse, "OK"));
    } catch (e) {
      console.log(e);
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

  async updateNotificationTemplate(
    id: string,
    updateEventDto: UpdateEventDto,
    response: Response
  ) {
    const apiId = "update.notification.notificationtemplate";
    var result = {};
    try {
      var type = "";
      const templateUpdateFields: any = {};
      if (updateEventDto.hasOwnProperty("title"))
        templateUpdateFields.title = updateEventDto.title;
      if (updateEventDto.hasOwnProperty("key"))
        templateUpdateFields.key = updateEventDto.key;
      if (updateEventDto.hasOwnProperty("status"))
        templateUpdateFields.status = updateEventDto.status;
      if (updateEventDto.hasOwnProperty("context"))
        templateUpdateFields.context = updateEventDto.context;
      if (updateEventDto.hasOwnProperty("replacementTags"))
        templateUpdateFields.replacementTags = updateEventDto.replacementTags;

      if (Object.keys(templateUpdateFields).length > 0) {
        templateUpdateFields.updatedOn = new Date();
        result = await this.notificationTemplatesRepository.update(
          id,
          templateUpdateFields
        );
      }
      console.log("result", result);
      const templateConfigUpdateFields: any = {};
      if (updateEventDto.hasOwnProperty("language"))
        templateConfigUpdateFields.language = updateEventDto.language;
      if (updateEventDto.hasOwnProperty("status"))
        templateConfigUpdateFields.status = updateEventDto.status;
      if (updateEventDto.hasOwnProperty("type")) {
        type = updateEventDto.type;
      }

      var isEmailPresent = 0;
      var isPushPresent = 0;
      var emailSubject = "";
      var emailBody = "";
      var pushSubject = "";
      var pushBody = "";
      if (updateEventDto.hasOwnProperty("email")) {
        isEmailPresent = 1;
        if (updateEventDto.email.hasOwnProperty("subject"))
          emailSubject = updateEventDto.email.subject;
        if (updateEventDto.email.hasOwnProperty("body"))
          emailBody = updateEventDto.email.body;
      }
      if (updateEventDto.hasOwnProperty("push")) {
        isPushPresent = 1;
        if (updateEventDto.push.hasOwnProperty("subject"))
          pushSubject = updateEventDto.push.subject;
        if (updateEventDto.push.hasOwnProperty("body"))
          pushBody = updateEventDto.push.body;
      }

      if (type != "") {
        templateUpdateFields.type = type;
      }
      if (isEmailPresent == 0 && isPushPresent == 0) {
        if (Object.keys(templateConfigUpdateFields).length > 0) {
          templateUpdateFields.updatedOn = new Date();
          result = await this.notificationTempConfigRepository.update(
            { template_id: id } as unknown,
            templateConfigUpdateFields
          );
        }
      } else {
        if (isEmailPresent == 1) {
          templateConfigUpdateFields.subject = emailSubject;
          templateConfigUpdateFields.body = emailBody;
          if (Object.keys(templateConfigUpdateFields).length > 0) {
            templateUpdateFields.updatedOn = new Date();
            result = await this.notificationTempConfigRepository.update(
              { template_id: id, type: "email" } as unknown,
              templateConfigUpdateFields
            );
          }
        }
        if (isPushPresent == 1) {
          templateConfigUpdateFields.subject = pushSubject;
          templateConfigUpdateFields.body = pushBody;
          if (Object.keys(templateConfigUpdateFields).length > 0) {
            templateUpdateFields.updatedOn = new Date();
            result = await this.notificationTempConfigRepository.update(
              { template_id: id, type: "push" } as unknown,
              templateConfigUpdateFields
            );
          }
        }
      }

      return response
        .status(HttpStatus.OK)
        .send(APIResponse.success(apiId, { result }, "Updated"));
    } catch (e) {
      console.log(e);

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
  async getNotificationTemplateAndConfig(
    id: number,
    response: Response
  ): Promise<any> {
    const apiId = "api.get.templateAndTemplateConfig";

    try {
      const notificationTemplate =
        await this.notificationTemplatesRepository.findOne({
          where: { id },
          relations: ["templateconfig"],
        });

      return response
        .status(HttpStatus.OK)
        .send(APIResponse.success(apiId, notificationTemplate, "OK"));
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

  async deleteNotificationTemplateAndConfig(
    id: number,
    response
  ): Promise<void> {
    const apiId = "delete.notification.notificationtemplateandconfig";

    try {
      const templateExists = await this.notificationTemplatesRepository.findOne(
        { where: { id } }
      );

      if (!templateExists) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .send(
            APIResponse.error(
              apiId,
              `Template with ID ${id} not found`,
              undefined,
              "NOT_FOUND"
            )
          );
      }

      await this.notificationTempConfigRepository.query(
        `DELETE FROM "NotificationTemplateConfig" WHERE "template_id" = $1`,
        [id]
      );

      const templateResult = await this.notificationTemplatesRepository.delete(
        id
      );

      return response
        .status(HttpStatus.OK)
        .send(APIResponse.success(apiId, templateResult, "Record Deleted"));
    } catch (e) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(
          APIResponse.error(
            apiId,
            "Something went wrong in Deletion",
            JSON.stringify(e),
            "INTERNAL_SERVER_ERROR"
          )
        );
    }
  }
}
