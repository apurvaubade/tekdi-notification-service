import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

export class EmailDto {
  @ApiProperty({ description: "Email subject", example: "This is new subject" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subject?: string;

  @ApiProperty({ example: "This is body of Email", description: "Email body" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  body?: string;
}

export class PushNotificationDto {
  @ApiProperty({ description: "Subject", example: "This is push subject" })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ description: "Body", example: "This is body of Push" })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  body?: string;
}

export class UpdateEventDto {
  @ApiProperty({ example: "EVENT" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  context?: string;

  @ApiProperty({ example: "This is title", description: "Event title" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: "OnAfterAttendeeEnrolled", description: "Event key" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  key?: string;

  @ApiProperty({
    description: "replacementTags",
    example: [
      {
        name: "campaign.first_name",
        description: "Name of Campaign Promoter",
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => ReplacementTagDto)
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  replacementTags?: ReplacementTagDto[];

  //   @ApiProperty({ type: Date, description: "Date created" })
  //   @IsDate()
  //   createdOn: Date;

  //   @ApiProperty({ type: Date, description: "Date updated" })
  //   @IsDate()
  //   updatedOn: Date;

  //   @ApiProperty({
  //     description: "Created By",
  //     example: "123e4567-e89b-12d3-a456-426614174000",
  //   })
  //   @IsOptional()
  //   createdBy?: string;

  //   @ApiProperty({
  //     description: "updated By",
  //     example: "123e4567-e89b-12d3-a456-426614174000",
  //   })
  //   @IsOptional()
  //   updatedBy?: string;

  @ApiProperty({ example: "en", description: "en" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  language?: string;

  @ApiProperty({ example: "Published", description: "Status" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: "email", description: "email/push" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  type?: string;

  @ApiProperty({ type: EmailDto, description: "Email" })
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  @IsOptional()
  @IsNotEmpty()
  email?: EmailDto;

  @ApiProperty({ type: PushNotificationDto, description: "Push details" })
  @ValidateNested({ each: true })
  @Type(() => PushNotificationDto)
  @IsOptional()
  @IsNotEmpty()
  push?: PushNotificationDto;
}

export class ReplacementTagDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;
}
