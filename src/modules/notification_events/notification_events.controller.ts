import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Res,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
// import { NotificationTemplates } from "./notification-templates.entity";
import { NotificationTemplates } from "./entity/notification_events.entity";
// import { NotificationTemplatesService } from "./notification-templates.service";
import { NotificationTemplatesService } from "./notification_events.service";
import { Response } from "express";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import { remove } from "winston";

@Controller("notification-templates")
export class NotificationTemplatesController {
  constructor(
    private readonly notificationTemplatesService: NotificationTemplatesService
  ) {}

  @Get()
  findAll(): Promise<NotificationTemplates[]> {
    return this.notificationTemplatesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<NotificationTemplates | undefined> {
    return this.notificationTemplatesService.findOne(+id);
  }

  // @Post()
  // @ApiCreatedResponse()
  // create(@Body() data, @Res() response: Response) {
  //   return this.notificationTemplatesService.create(data, response);
  // }
  @Post()
  @ApiCreatedResponse({ description: "created" })
  @ApiInternalServerErrorResponse({ description: "internal server error" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @UsePipes(new ValidationPipe({ transform: true }))
  // @ApiBody({type: create})
  async create(@Body() data, @Res() response: Response) {
    return this.notificationTemplatesService.create(data, response);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() data: Partial<NotificationTemplates>
  ): Promise<NotificationTemplates | undefined> {
    return this.notificationTemplatesService.update(+id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    return this.notificationTemplatesService.remove(+id);
  }
}
