import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { create, Whatsapp } from 'venom-bot'


const premiumGroups = [
  "5511986116209-1629056430@g.us",
  "557388666787-1590188337@g.us",
  "557388015449-1579919536@g.us",
  "557388015449-1632007808@g.us"
]


export interface IMenu {
  parentMenu: number | null
  options: IOptions[]
}

interface IOptions {
  message: string,
  value: string
}


@Injectable()
export class ClientService {
  constructor(@Inject('MAKIMA') private client: ClientProxy) {
    // this.init()
  }
  async init() {
    create(
      'makima-sender',
      () => { },
      () => { },
      {
        folderNameToken: 'tokens',
        headless: true,
        puppeteerOptions: {
          ignoreDefaultArgs: ['--disable-extensions']
        },
      }
    )
      .then(async (client) => {
        this.start(client)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async start(client: Whatsapp) {
    client.onMessage(async (message) => {
      const isGroup = message.isGroupMsg
      const isForMakima = message.mentionedJidList.includes("557388015449@c.us")
      const isPremium = premiumGroups.includes(message.chatId)
      let shouldSendMessage: boolean = false
      console.log({ isForMakima, isGroup, isPremium })
      if (isGroup && isForMakima && isPremium) {
        shouldSendMessage = true
      }
      if (shouldSendMessage) {
        await this.getHello()
        console.log('enviou')
      }
    });
  }

  async getHello() {
    try {
      const send = await lastValueFrom(this.client.send({ cmd: 'greeting' }, 'Progressive Coder'));
      console.log(send)
    } catch (error) {
      console.log(error)
    }
  }

  @MessagePattern({ cmd: 'greeting' })
  getGreetingMessage(name: string): string {
    return `Hello ${name}`;
  }
}


