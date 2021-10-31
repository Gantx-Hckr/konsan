import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import request from '../../lib/request'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'xp',
            description: 'Displays user-exp📜',
            category: 'general',
            usage: `${client.config.prefix}exp (@tag)`,
            aliases: ['📈']
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        const user = M.mentioned[0] ? M.mentioned[0] : M.sender.jid
        let username = user === M.sender.jid ? M.sender.username : ''
        if (!username) {
            const contact = this.client.getContact(user)
            username = contact.notify || contact.vname || contact.name || user.split('@')[0]
        }
        let pfp: string
        try {
            pfp = await this.client.getProfilePicture(user)
        } catch (err) {
            M.reply(`Profile Picture not Accessible of ${username}`)
            pfp =
                'https://i.pinimg.com/originals/d0/4b/b1/d04bb1b91dfd87bb8b65e98abd32aa3d.jpg'
        }
        const data = await this.client.getUser(user)
        await M.reply(
            await request.buffer(
                pfp ||
                    'https://i.pinimg.com/originals/d0/4b/b1/d04bb1b91dfd87bb8b65e98abd32aa3d.jpg'
            ),
            MessageType.image,
            undefined,
            undefined,
            `🏮 *Username: ${username}*\n\n⭐ *XP: ${data.Xp || 0}*`
        )
    }
}
