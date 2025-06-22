import { Module } from '@nestjs/common';
import { AgentController } from './agent/controller/agent.controller';
import { AgentService } from './agent/service/agent/agent.service';
import { RedisService } from 'src/messaging/redis/redis.service';
import { ReactAgent } from 'src/agent/implementations/react.agent';

@Module({
  imports: [],
  controllers: [AgentController],
  providers: [AgentService, RedisService, ReactAgent],
})
export class ApiModule {}
