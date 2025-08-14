import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ImageController } from './image.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
// app.module.tsなどにThrottlerModuleを登録

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,    // 期間（秒）
      limit: 10,  // 制限回数
    }),
  ],
  controllers: [AppController, ImageController],
})

export class AppModule {}
