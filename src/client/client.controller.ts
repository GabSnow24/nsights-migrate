import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class ClientController {

    @EventPattern('start-engine')
    async handleBookCreatedEvent(data: Record<string, unknown>) {
        Logger.log(data);
    }

}