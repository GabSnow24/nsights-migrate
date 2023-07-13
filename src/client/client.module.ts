import { Module } from '@nestjs/common';
import { ClientService } from './client.service';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';


@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.registerQueue({
      name: 'engine',
    }),
    // ClientsModule.register([
    //   {
    //     name: 'MAKIMA',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [process.env.RABBIT_URL],
    //       queue: 'engine_queue',
    //       queueOptions: {
    //         durable: false,
    //       },
    //     }
    //   },
    // ]),
    // ClientsModule.register([
    //   {
    //     name: 'MAKIMA-TRANSCRIBE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [process.env.RABBIT_URL],
    //       queue: 'sender_queue',
    //       queueOptions: {
    //         durable: false,
    //       },
    //     }
    //   },
    // ]),

  ],
  providers: [ClientService]
})
export class ClientModule { }
