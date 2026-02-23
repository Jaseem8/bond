import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow requests from the Vite dev server and any production origin
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      process.env.FRONTEND_ORIGIN ?? '',
    ].filter(Boolean),
  });

  // Validate & transform every incoming request body using class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,   // auto-cast string → number where decorated
      whitelist: true,   // strip unknown properties
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();
