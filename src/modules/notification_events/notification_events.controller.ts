import {
  BadRequestException,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  ParseUUIDPipe,
  Patch,
  Res,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { NotificationTemplatesService } from "./notification_events.service";
import { NotificationTemplates } from "./entity/notificationTemplate.entity";
import { Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SearchFilterDto } from "./dto/searchTemplateType.dto";
import { Response } from "express";
import { CreateEventDto } from "./dto/notificationTemplate.dto";
import { UpdateEventDto } from "./dto/updateNotificationTemplate.dto";
import { remove } from "winston";

@Controller("notification-templates")
export class NotificationTemplatesController {
  constructor(
    private readonly notificationTemplatesService: NotificationTemplatesService
  ) {}

  @Post("/list")
  @ApiBody({ type: SearchFilterDto })
  @ApiInternalServerErrorResponse({ description: "Server Error" })
  @ApiBadRequestResponse({ description: "Invalid Request" })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ description: "Get Template List" })
  async getTemplates(
    @Body() searchFilterDto: SearchFilterDto,
    @Res() response: Response
  ) {
    return this.notificationTemplatesService.getTemplatesTypesForEvent(
      searchFilterDto,
      response
    );
  }

  @Post()
  @ApiCreatedResponse({ description: "created" })
  @ApiInternalServerErrorResponse({ description: "internal server error" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @UsePipes(new ValidationPipe({ transform: true }))
  // @ApiBody({type: create})
  // async create(@Body() data, @Res() response: Response) {
  //   return this.notificationTemplatesService.create(data, response);
  // }
  async create(@Body() data: CreateEventDto, @Res() response: Response) {
    return this.notificationTemplatesService.create(data, response);
  }

  @Patch("/:id")
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: "Event updated successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @UsePipes(new ValidationPipe({ transform: true }))
  updateEvent(
    @Param("id") id: string,

    @Body() updateEventDto: UpdateEventDto,
    @Res() response: Response
  ) {
    return this.notificationTemplatesService.updateNotificationTemplate(
      id,
      updateEventDto,
      response
    );
  }
  @Get("/:id")
  async getEvent(@Param("id") id: number, @Res() response: Response) {
    try {
      const result =
        await this.notificationTemplatesService.getNotificationTemplateAndConfig(
          id,
          response
        );
      // Handle the result returned by the service
      if (result.success) {
        return response.status(HttpStatus.OK).send(result.data);
      } else {
        return response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send(result.error);
      }
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send("Internal Server Error");
    }
  }

  @Delete(":id")
  @ApiInternalServerErrorResponse({ description: "Server Error" })
  @ApiBadRequestResponse({ description: "Invalid Request" })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ description: "Deleted Notification template & config" })
  async deleteTemplates(@Param("id") id: number, @Res() response: Response) {
    return this.notificationTemplatesService.deleteNotificationTemplateAndConfig(
      id,
      response
    );
  }
}
