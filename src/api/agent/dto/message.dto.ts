export class MessageDto {
  threadId: string;
  type: 'human';
  content: MessageContentDto[]; // Can contain text message + images, files, etc.
}

export class MessageContentDto {
  type: 'text' | 'image_url'; // Add more types as needed
  text?: string; // Required if type is 'text'
  imageUrl?: string; // Required if type is 'image_url'
  detail?: 'auto' | 'low' | 'high'; // Optional, used for image quality
}

export class SseMessageDto {
  threadId: string;
  type: 'human';
  content: string; // Can contain text message + images, files, etc.
}
