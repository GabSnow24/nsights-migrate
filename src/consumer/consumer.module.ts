import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsumerService } from './consumer.service';
import { PrismaService } from 'src/prisma/prisma.service';



@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.registerQueue({
      name: 'nsights',
    }),
  ],
  providers: [ConsumerService, PrismaService,],
})
export class ConsumerModule { }
