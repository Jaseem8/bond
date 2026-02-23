import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Headers (CSP, XSS protection, HSTS, etc.)
  app.use(helmet());

  // Allow requests only from whitelisted origins
  const origins = [
    'http://localhost:5173',
    'http://localhost:4173',
  ];
  if (process.env.FRONTEND_ORIGIN) {
    origins.push(process.env.FRONTEND_ORIGIN);
  }

  app.enableCors({
    origin: origins,
    methods: 'GET,POST',
    credentials: true,
  });

  // Validate & transform every incoming request body
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Secure Backend running on http://localhost:${port}`);
}
bootstrap();
