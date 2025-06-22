import { Module } from '@nestjs/common';
import { AgentController } from './agent/controller/agent.controller';
import { AgentService } from './agent/service/agent/agent.service';
import { RedisService } from 'src/messaging/redis/redis.service';
import { ReactAgent } from 'src/agent/implementations/react.agent';
import { ThreadService } from 'src/agent/thread/thread.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadEntity } from 'src/agent/entities/thread.entity';

@Module({
  controllers: [AgentController],
  providers: [AgentService, RedisService, ReactAgent, ThreadService],
  imports: [TypeOrmModule.forFeature([ThreadEntity])],
})
export class ApiModule {}
