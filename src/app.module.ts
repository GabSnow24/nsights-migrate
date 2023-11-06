import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ConsumerModule } from './consumer/consumer.module';

@Module({
  imports: [
    ClientModule,
    ConsumerModule,
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD
      }
    }
    )
  ],
})
export class AppModule { }
