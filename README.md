# AI Agent Backend Template

A beginner-friendly NestJS template for building AI agents with streaming capabilities and conversation management.

## Features

- 🤖 Ready-to-use AI agent implementation
- 🌊 Real-time streaming responses
- 💾 Conversation history management
- 🔄 Support for multiple LLM providers (OpenAI, Google)
- 📡 Built-in Redis pub/sub for real-time messaging
- 🎯 Clean and maintainable architecture

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose (for local development)
- OpenAI API key or Google AI API key

## Quick Start

1. Start the required services (Redis and PostgreSQL) using Docker Compose:
```bash
docker compose up -d
```
This will start:
- PostgreSQL at `localhost:5433`
- Redis at `localhost:6379`

You can check the status of the services with:
```bash
docker compose ps
```

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Update the `.env` file in the root directory:
```env
# Choose your model provider
MODEL_PROVIDER=GOOGLE  # or OPENAI

# For Google AI
GOOGLE_GENAI_API_KEY=your_api_key
GOOGLE_GENAI_MODEL=gemini-pro

# For OpenAI
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-3.5-turbo

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=

# App Configuration
PORT=3001
```

4. Start the development server:
```bash
pnpm run start:dev
```

5. When using Postgres Saver as memory, the checkpointer should be initialized before chating with the agent
   
```typescript
// For example in agentService
 async stream(message: SseMessageDto): Promise<Observable<SseMessage>> {
    const channel = `agent-stream:${message.threadId}`;
    // !!! it should be run only once
    this.agent.initCheckpointer(); 
    // the rest of the code
 }
```   

## API Endpoints

- `POST /api/agent/chat` - Send a message to the agent
- `GET /api/agent/stream` - Stream agent responses (SSE)
- `GET /api/agent/history/:threadId` - Get conversation history

## Basic Usage Example

```typescript
// Chat endpoint
await fetch('http://localhost:3001/api/agent/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    threadId: 'unique-thread-id',
    content: [{ type: 'text', text: 'Hello, AI!' }],
    type: 'human'
  })
});

// Stream endpoint (using EventSource)
const sse = new EventSource('http://localhost:3001/api/agent/stream?threadId=unique-thread-id&content=Hello');
sse.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.content);
};
```

## Project Structure

```
src/
├── agent/              # AI agent implementation
├── api/               # HTTP endpoints and DTOs
└── messaging/         # Redis messaging service
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)