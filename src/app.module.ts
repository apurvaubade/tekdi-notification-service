import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { NotificationEventsModule } from "./modules/notification_events/notification_events.module";
import { NotificationTemplateConfigModule } from "./modules/notification_template_config/notification_template_config.module";
// import { NotificationModule } from './modules/notification/notification.module';
// import typeOrmConfig from 'src/config/database-modules'
import { DatabaseModule } from "./common/database-modules";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerModule } from "./logger/logger.module";
// import {NotificationModule}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    NotificationEventsModule,
    LoggerModule,
    NotificationTemplateConfigModule,
  ],

  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
