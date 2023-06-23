import { Module } from '@nestjs/common';
import { ClientService } from './client.service';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { ClientController } from './client.controller';


@Module({
  imports: [ClientsModule.register([
    {
      name: 'MAKIMA',
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost:5672"],
        queue: 'engine_queue',
        noAck: false,
        queueOptions: {
          durable: false
        }
      }
    },
  ]),
  ConfigModule.forRoot()
  ],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule { }
