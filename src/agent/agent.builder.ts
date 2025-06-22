import {
  StateGraph,
  MessagesAnnotation,
  END,
  START,
  CompiledStateGraph,
  BaseCheckpointSaver,
} from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { SystemMessage } from '@langchain/core/messages';
import { REACT_AGENT_SYSTEM_PROMPT } from './prompts';

export class ReactAgentBuilder {
  private readonly toolNode: ToolNode;
  private readonly model: BaseChatModel;
  private readonly tools: any[];
  private readonly stateGraph: StateGraph<typeof MessagesAnnotation>;

  constructor(tools: any[], llm: BaseChatModel) {
    if (!llm) {
      throw new Error('Language model (llm) is required');
    }
    this.tools = tools || [];
    this.toolNode = new ToolNode(tools || []);
    this.model = llm;
    this.stateGraph = new StateGraph(MessagesAnnotation);
    this.initializeGraph();
  }

  private shouldContinue(state: typeof MessagesAnnotation.State) {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1];
    if (
      'tool_calls' in lastMessage &&
      Array.isArray(lastMessage.tool_calls) &&
      lastMessage.tool_calls?.length
    ) {
      return 'tools';
    }
    return END;
  }

  private async callModel(state: typeof MessagesAnnotation.State) {
    if (!this.model || !this.model.bindTools) {
      throw new Error('Invalid or missing language model (llm)');
    }
    const messages = [
      // Add always system prompt so it is not duplicated in the messages
      new SystemMessage(REACT_AGENT_SYSTEM_PROMPT),
      ...state.messages,
    ];
    const modelInvoker = this.model.bindTools(this.tools);
    const response = await modelInvoker.invoke(messages);
    return { messages: response };
  }

  private initializeGraph(): void {
    this.stateGraph
      .addNode('agent', this.callModel.bind(this))
      .addNode('tools', this.toolNode)
      .addEdge(START, 'agent')
      .addConditionalEdges('agent', this.shouldContinue.bind(this), [
        'tools',
        END,
      ])
      .addEdge('tools', 'agent');
  }

  /**
   * Builds and compiles the state graph for the agent.
   * @returns {CompiledStateGraph<typeof MessagesAnnotation, any>} The compiled state graph.
   */
  public build(
    checkpointer?: BaseCheckpointSaver,
  ): CompiledStateGraph<typeof MessagesAnnotation, any> {
    return this.stateGraph.compile(
      checkpointer
        ? {
            checkpointer: checkpointer,
            // Store can be used to enable persistence and memory that can be shared across threads,
          }
        : {},
    );
  }
}
