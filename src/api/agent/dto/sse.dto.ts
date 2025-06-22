export class SseMessage {
  data: {
    id: string;
    type?: 'ai' | 'tool';
    content: string;
  };
  type: string;
}
