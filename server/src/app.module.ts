import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // 1. Cấu hình ConfigModule để đọc file .env
    ConfigModule.forRoot({
      isGlobal: true, // Để dùng được ở mọi nơi mà không cần import lại
    }),

    // 2. Cấu hình TypeORM kết nối PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Tự động load tất cả file .entity.ts
        synchronize: true, // Lưu ý: Chỉ dùng true khi đang dev, production phải dùng migrations
      }),
    }),
  ],
})
export class AppModule {}