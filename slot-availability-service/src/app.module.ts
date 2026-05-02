import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { SlotsModule } from './slots/slots.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [PrismaModule, RedisModule, SlotsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
