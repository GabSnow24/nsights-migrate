import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ClientModule, ConfigModule.forRoot()],
})
export class AppModule {}
