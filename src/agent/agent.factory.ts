import { ChatOpenAI } from '@langchain/openai';
import * as dotenv from 'dotenv';
import { ModelProvider } from './enum/model-provider.enum';
import { ReactAgentBuilder } from './agent.builder';
import { CompiledStateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';

dotenv.config();

export class AgentFactory {
  public static createAgent(
    modelProvider: ModelProvider,
    tools: any[],
    checkpointer?: PostgresSaver,
  ): CompiledStateGraph<typeof MessagesAnnotation, any> {
    if (!modelProvider) {
      throw new Error('Model provider is required');
    }

    switch (modelProvider) {
      // OpenAI
      case ModelProvider.OPENAI: {
        return new ReactAgentBuilder(
          tools,
          new ChatOpenAI({
            configuration: {
              baseURL: process.env.MODEL_BASE_URL,
            },
            model: 'ai/gemma3:latest',
          }),
        ).build(checkpointer);
      }

      /// Add other model providers here as needed
    }
    throw new Error(`Unsupported model provider: ${modelProvider}`);
  }
}
