import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bull';
import { create, Whatsapp } from 'venom-bot'


const premiumGroups = [
  "5511986116209-1629056430@g.us",
  "557388666787-1590188337@g.us",
  "557388015449-1579919536@g.us",
  "557388015449-1632007808@g.us",
  "120363144462631568@g.us"
]


@Injectable()
export class ClientService {
  constructor(@InjectQueue('engine') private queue: Queue) {
    this.init()
  }
  async init() {
    create(
      'makima-listener',
      (base64Qrimg) => {
        Logger.log('base64 image string qrcode: ', base64Qrimg);
      },
      () => { },
      {
        folderNameToken: 'tokens',
        puppeteerOptions: {
          ignoreDefaultArgs: ['--disable-extensions']
        },
      }
    )
      .then(async (client) => {
        this.start(client)
      })
      .catch((error) => {
        Logger.error(error);
      });
  }

  async start(client: Whatsapp) {
    client.onMessage((message) => {
      const isGroup = message.isGroupMsg
      const isForMakima = message.mentionedJidList.includes(`${process.env.BOT_NUMBER}@c.us`)
      const isPremium = premiumGroups.includes(message.chatId)
      Logger.log(`Message received from: ${message.chatId}`)
      if (isGroup && isPremium && isForMakima) {
        this.sendEvent("predict", JSON.stringify({ data: { message } }))
        Logger.log(`Event sent to engine queue with data: ${JSON.stringify(message)}`)
      }
    });
  }


  async sendEvent(pattern: string, data: any) {
    try {
      await this.queue.add(pattern, data,
        {
          attempts: 5,
          backoff: 8000,
        })
    } catch (error) {
      Logger.error(error)
    }
  }
}


