# Local Agent: Fast AI Backend with Docker Model Runner

A flexible, extensible AI agent backend built with NestJS—designed for running local, open-source LLMs (Llama, Gemma, Qwen, DeepSeek, etc.) via Docker Model Runner. Real-time streaming, Redis messaging, web search, and Postgres memory out of the box. No cloud APIs required!

---

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```
2. **Copy and edit environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and fill in your model and service config
   ```
3. **Start required services (Redis, PostgreSQL, Local LLM) with Docker Compose**
   ```bash
   docker compose up -d
   ```
   - PostgreSQL: `localhost:5433`
   - Redis: `localhost:6379`
   - Local LLM runner: `localhost:12434` ([Model Runner guide](https://blog.agentailor.com/posts/docker-model-runner-gemma))
4. **Install dependencies**
   ```bash
   pnpm install
   ```
5. **Start the development server**
   ```bash
   pnpm run start:dev
   ```

---

## 🛠️ Environment Variables

See `.env.example` for all options. Key variables:

- `MODEL_BASE_URL` — e.g. `http://localhost:12434/engines/llama.cpp/v1`
- `MODEL_NAME` — e.g. `ai/gemma3:latest`, `llama-3`, `qwen`, `deepseek`
- `TAVILY_API_KEY` — for web search ([Get your key](https://www.tavily.com/))
- `REDIS_HOST`, `REDIS_PORT`, etc.
- `POSTGRES_*` — for memory

---

## ✨ Features

- 🤖 Local, open-source LLMs (Llama, Gemma, Qwen, DeepSeek, etc.)
- 🌊 Real-time streaming responses
- 💾 Conversation history with Postgres memory
- 🌐 Web search integration (Tavily)
- 🧵 Custom ThreadService for conversations
- 📡 Redis pub/sub for real-time messaging
- 🎯 Clean, maintainable architecture

---

## 🧩 Model Setup (Docker Model Runner)

- This project is designed for local LLMs only, using [Docker Model Runner](https://blog.agentailor.com/posts/docker-model-runner-gemma).
- Supported models: Llama, Gemma, Qwen, DeepSeek, and other open-source models.
- Set `MODEL_BASE_URL` and `MODEL_NAME` in your `.env`.
- Start the `ai_runner` service with Docker Compose.
- For other providers, see [Agent Initializr](https://initializr.agentailor.com/).

---

## 🔌 Web Search (Tavily)
- Set `TAVILY_API_KEY` in `.env`
- Example usage in code:
  ```typescript
  AgentFactory.createAgent(
    ModelProvider.LOCAL,
    [new TavilySearch({ maxResults: 5, topic: 'general' })],
    postgresCheckpointer,
  );
  ```

---

## 🗄️ Project Structure

```
src/
├── agent/       # AI agent implementation
├── api/         # HTTP endpoints and DTOs
└── messaging/   # Redis messaging service
```

---

## 🛣️ API Endpoints

- `POST /api/agent/chat` — Send a message to the agent
- `GET /api/agent/stream` — Stream agent responses (SSE)
- `GET /api/agent/history/:threadId` — Get conversation history
- `GET /api/agent/threads` — List all threads

---

## 💬 Chat UI

For a ready-to-use frontend, use [agentailor-chat-ui](https://github.com/IBJunior/agentailor-chat-ui), which is fully compatible with this backend.

---

## 📝 Required: Postgres Saver Checkpointer

This project uses Postgres for memory. You must initialize the checkpointer before chatting:
```typescript
// In agentService
async stream(message: SseMessageDto): Promise<Observable<SseMessage>> {
  const channel = `agent-stream:${message.threadId}`;
  // Run only once
  this.agent.initCheckpointer();
  // ...rest of code
}
```

---

## ℹ️ Note

- This project is opinionated for local, open-source LLMs only.

---

## 📚 Further Information

For more details and project resources, visit [Initializr](https://github.com/IBJunior/initializr).

---

## 📄 License

[MIT License](LICENSE)