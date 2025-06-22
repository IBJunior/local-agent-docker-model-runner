import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import { MessageDto } from '../dto/message.dto';

export class MessageUtil {
  static toHumanMessages(message: MessageDto): BaseMessage[] {
    const messages: BaseMessage[] = [];

    for (const content of message.content) {
      if (content?.type === 'text' && content?.text) {
        messages.push(new HumanMessage(content.text));
      } else {
        // Handle other content types as needed
        throw new Error(`Unsupported content type: ${content.type}`);
      }
    }

    return messages;
  }
}
