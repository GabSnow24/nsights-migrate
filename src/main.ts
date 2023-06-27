import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { otelSDK } from './tracing';

const loggerInstance = new Logger('Bootstrap')

async function bootstrap() {
  await otelSDK.start()
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_URL],
        queue: 'engine_queue',
        queueOptions: {
          durable: false,
        },
        noAck: false
      },
    }
  );
  await app.listen();
  loggerInstance.log(`Makima Listener MS running!`)
}

bootstrap().catch((error) => loggerInstance.error(error))
