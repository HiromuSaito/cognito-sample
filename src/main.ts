import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log('tdestd')
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableShutdownHooks()
  app.setGlobalPrefix('api');

  await app.listen(3000);
}

bootstrap();
