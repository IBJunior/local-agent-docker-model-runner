import {
  BaseCheckpointSaver,
  CompiledStateGraph,
  MessagesAnnotation,
} from '@langchain/langgraph';
import { Injectable } from '@nestjs/common';
import { AgentFactory } from '../agent.factory';
import { BaseMessage } from '@langchain/core/messages';
import { ModelProvider } from '../enum/model-provider.enum';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import { postgresCheckpointer } from '../memory/memory';
import { TavilySearch } from '@langchain/tavily';

@Injectable()
export class ReactAgent {
  private readonly agent: CompiledStateGraph<typeof MessagesAnnotation, any>;
  private readonly checkpointer: BaseCheckpointSaver;

  constructor() {
    this.agent = AgentFactory.createAgent(
      ModelProvider.OPENAI,
      [
        new TavilySearch({
          maxResults: 5,
          topic: 'general',
        }),
      ],
      postgresCheckpointer,
    );
    this.checkpointer = postgresCheckpointer;
  }

  async chat(input: any, chatOptions: any): Promise<any> {
    const response = await this.agent.invoke(input, chatOptions);
    return response?.messages[response?.messages.length - 1] || null;
  }

  async stream(input: any, chatOptions: any): Promise<any> {
    return this.agent.stream(input, chatOptions);
  }

  async getHistory(threadId: string): Promise<BaseMessage[]> {
    const history = await this.checkpointer.get({
      configurable: { thread_id: threadId },
    });
    return Array.isArray(history?.channel_values?.messages)
      ? history.channel_values.messages
      : [];
  }
  /**
   * Initializes the checkpointer for the agent.
   * This method sets up the PostgresSaver by creating necessary tables.
   * It should be called once before using the agent to ensure
   * that the database is ready for checkpointing.
   */
  async initCheckpointer(): Promise<void> {
    if (this.checkpointer && this.checkpointer instanceof PostgresSaver) {
      try {
        // Attempt to create tables synchronously
        await this.checkpointer.setup();
      } catch (err: any) {
        console.error('Error setting up PostgresSaver:', err);
      }
    }
  }
}
