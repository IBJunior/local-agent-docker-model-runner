import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagingModule } from './messaging/messaging.module';
import { AgentModule } from './agent/agent.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MessagingModule,
    AgentModule,
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
