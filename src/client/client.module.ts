import { Module } from '@nestjs/common';
import { ClientService } from './client.service';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ClientController } from './client.controllers';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.registerQueue({
      name: 'nsights',
    }),
  ],
  controllers: [ClientController],
  providers: [ClientService, PrismaService]
})
export class ClientModule { }
