import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { create, Whatsapp } from 'venom-bot'


const premiumGroups = [
  "5511986116209-1629056430@g.us",
  "557388666787-1590188337@g.us",
  "557388015449-1579919536@g.us",
  "557388015449-1632007808@g.us"
]


@Injectable()
export class ClientService {
  constructor(@Inject('MAKIMA') private client: ClientProxy) {
    this.init()
    this.client.connect()
  }
  async init() {
    create(
      'makima-listener',
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
      const isForMakima = message.mentionedJidList.includes(`${process.env.BOT_NUMBER}@c.us`)
      const isAudio = message.mimetype?.includes("audio")
      const isPremium = premiumGroups.includes(message.chatId)
      let dataToSend: { pattern: string, data: any }
      console.log({ isGroup, isPremium, isForMakima })
      if (isGroup && isPremium && isForMakima) {
        this.sendEvent("engine", JSON.stringify({ data: { message } }))
      }
    });
  }


  sendEvent(pattern: string, data: any) {
    try {
      this.client.emit(pattern, data);
      this.client.emit(pattern, data);
      Logger.log("Message sent to engine!")
    } catch (error) {
      Logger.error(error)
    }
  }
}


