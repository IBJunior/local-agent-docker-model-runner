import { Module } from '@nestjs/common';
import { ReactAgent } from './implementations/react.agent';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadEntity } from './entities/thread.entity';
import { ThreadService } from './thread/thread.service';

@Module({
  controllers: [],
  providers: [ReactAgent, ThreadService],
  imports: [TypeOrmModule.forFeature([ThreadEntity])],
})
export class AgentModule {}
