import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThreadEntity } from '../entities/thread.entity';
import { ThreadResponseDto } from 'src/api/agent/dto/thread.response';

@Injectable()
export class ThreadService {
  constructor(
    @InjectRepository(ThreadEntity)
    private readonly threadRepository: Repository<ThreadEntity>,
  ) {}

  async createThreadIfNotExists(threadId: string): Promise<void> {
    let thread = await this.threadRepository.findOneBy({
      identifier: threadId,
    });
    if (!thread) {
      await this.threadRepository.save({
        identifier: threadId,
      });
    }
  }

  async getThreadById(id: string): Promise<ThreadEntity> {
    const thread = await this.threadRepository.findOneBy({ id });
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return thread;
  }

  async getThreads(): Promise<ThreadResponseDto[]> {
    const threads = await this.threadRepository.find();
    return threads.map((thread) => ({
      id: thread.identifier,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    }));
  }
}
