import { Module } from '@nestjs/common';
import { ReactAgent } from './implementations/react.agent';

@Module({
  controllers: [],
  providers: [ReactAgent],
})
export class AgentModule {}
