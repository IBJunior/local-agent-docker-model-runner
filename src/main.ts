import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Prefix all routes with 'api'
  app.setGlobalPrefix('api');
  // Configure CORS for local development
  // Adjust the allowed origins as necessary for your environment
  const allowedOrigins = ['http://localhost:3000'];
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
