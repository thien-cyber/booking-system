import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  
  // DÒNG NÀY ĐÃ ĐƯỢC XÓA (app.enableCors() mặc định)
  
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const frontendUrl =
    configService.get<string>('FRONTEND_URL') || 'http://localhost:4200';

  // Cấu hình CORS duy nhất nằm ở đây
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}

bootstrap();