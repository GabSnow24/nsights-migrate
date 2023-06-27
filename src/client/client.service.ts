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
      let shouldSendMessage: boolean = false
      if (isGroup && isForMakima && isPremium) {
        const msgToSend = {
          mentionedJidList: message.mentionedJidList,
          author: message.author,
          body: message.body,
          chatId: message.chatId,
          isAudio
        }

        try {
          this.client.emit('engine', JSON.stringify({ data: { message: msgToSend } }));
          this.client.emit('engine', JSON.stringify({ data: { message: msgToSend } }));
          Logger.log("Message sent to engine!")
        } catch (error) {
          Logger.error(error)
        }
      }
    });
  }



}


