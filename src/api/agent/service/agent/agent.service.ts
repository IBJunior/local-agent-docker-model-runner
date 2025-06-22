import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { SseMessage } from '../../dto/sse.dto';
import { MessageDto, SseMessageDto } from '../../dto/message.dto';
import { MessageUtil } from '../../utils/message.util';
import { IAgentService } from '../iagent.service';
import { ReactAgent } from 'src/agent/implementations/react.agent';
import { MessageResponseDto } from '../../dto/message.response.dto';
import { RedisService } from 'src/messaging/redis/redis.service';
import { ThreadService } from 'src/agent/thread/thread.service';

@Injectable()
export class AgentService implements IAgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    private agent: ReactAgent,
    private redisService: RedisService,
    private threadService: ThreadService,
  ) {}

  async chat(messageDto: MessageDto): Promise<MessageResponseDto> {
    const messages = MessageUtil.toHumanMessages(messageDto);
    // Ensure the thread exists before sending the message
    await this.threadService.createThreadIfNotExists(messageDto.threadId);
    const config = {
      configurable: { thread_id: messageDto.threadId },
    };
    try {
      const message = await this.agent.chat(
        {
          messages,
        },
        config,
      );
      return {
        id: message.id || 'unknown',
        type: message.getType() as 'human' | 'ai' | 'tool',
        content: message.content,
      };
    } catch (error) {
      this.logger.error('Error in chat:', error);
      throw new BadRequestException(
        error.message || 'An error occurred while processing your request.',
      );
    }
  }

  async stream(message: SseMessageDto): Promise<Observable<SseMessage>> {
    const channel = `agent-stream:${message.threadId}`;
    // should be run once to initialize the checkpointer
    // Uncomment the line below if you want to initialize the checkpointer
    //this.agent.initCheckpointer();
    // You may want to save the thread ID  or associate it with a user for later retrieval
    this.logger.log(`Streaming messages to channel: ${channel}`);
    // These entities are provide (ThreadEntity, UserEntity) in the src/api/agent/entity directory
    // Start streaming to Redis in the background
    this.streamMessagesToRedis(
      [new HumanMessage(message.content)],
      { configurable: { thread_id: message.threadId } },
      channel,
    );

    // Return an Observable that subscribes to the Redis channel
    return this.redisService
      .subscribe(channel)
      .pipe(map((msg) => JSON.parse(msg) as SseMessage));
  }

  private async streamMessagesToRedis(
    messages: BaseMessage[],
    configurable: Record<string, any>,
    channel: string,
  ) {
    try {
      // Ensure the thread exists before streaming messages
      this.logger.log(`Creating thread if not exists for channel: ${channel}`);
      await this.threadService.createThreadIfNotExists(
        configurable.configurable?.thread_id || 'default-thread',
      );
      const streams = await this.agent.stream(
        { messages },
        {
          streamMode: 'messages',
          ...configurable,
        },
      );

      for await (const chunk of streams) {
        if (!chunk) continue;

        const messageChunks = Array.isArray(chunk)
          ? chunk.filter((item) => item?.constructor?.name === 'AIMessageChunk')
          : [];

        for (const messageChunk of messageChunks) {
          await this.redisService.publish(
            channel,
            JSON.stringify({
              data: {
                id: messageChunk.id,
                type: messageChunk.getType() as 'human' | 'ai' | 'tool',
                content: messageChunk.content,
              },
              type: 'message',
            }),
          );
        }
      }

      await this.redisService.publish(
        channel,
        JSON.stringify({ data: { id: 'done', content: '' }, type: 'done' }),
      );
    } catch (error) {
      this.logger.error('Error in streamMessagesToRedis:', error);
      await this.redisService.publish(
        channel,
        JSON.stringify({ type: 'error', data: { message: error.message } }),
      );
    }
  }

  async getHistory(threadId: string): Promise<MessageResponseDto[]> {
    try {
      const history = await this.agent.getHistory(threadId);
      // console.log('History:', history);
      return history.map((msg: BaseMessage) => ({
        id: msg.id || 'unknown', // Ensure id is always present
        type: msg.getType() as 'human' | 'ai' | 'tool',
        content: msg.content,
      }));
    } catch (error) {
      this.logger.error('Error fetching history:', error);
      throw new BadRequestException(
        error.message || 'An error occurred while fetching history.',
      );
    }
  }
}
