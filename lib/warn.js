const config = require('../config')
const {
	bot,
	setWarn,
	jidToNum,
	genButtonMessage,
	isAdmin,
	deleteWarn,
} = require('../lib/')

bot(
	{
		pattern: 'warn ?(.*)',
		fromMe: true,
		desc: 'warn users in chat',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		let [m, u] = match.split(' ')
		if (m && m.toLowerCase() == 'reset') {
			u = u.endsWith('@s.whatsapp.net')
				? u
				: message.mention[0] || message.reply_message.jid
			if (!u) return await message.sendMessage('*Reply or Mention to a user*')
			const count = await setWarn(u, message.jid, (!isNaN(u) && u) || -1)
			return await message.sendMessage(
				`WARN RESET\nUser : @${jidToNum(u)}\nRemaining : ${
					config.WARN_LIMIT - count
				}`,
				{ contextInfo: { mentionedJid: [u] } }
			)
		}
		const user = message.mention[0] || message.reply_message.jid
		if (!user) return await message.sendMessage('*Reply or Mention to a user*')
		const count = await setWarn(user, message.jid)
		if (count > config.WARN_LIMIT) {
			const participants = await message.groupMetadata(message.jid)
			const isImAdmin = await isAdmin(participants, message.client.user.jid)
			if (!isImAdmin) return await message.sendMessage(`_I'm not admin._`)
			const isUserAdmin = await isAdmin(participants, user)
			if (isUserAdmin)
				return await message.sendMessage(`_I can't Remove admin._`)
			await message.sendMessage(
				`_@${jidToNum(user)} Kicked, Reached Max warning._`,
				{ contextInfo: { mentionedJid: [user] } }
			)
			await deleteWarn(user, message.jid)
			return await message.Kick(user)
		}
		return await message.sendMessage(
			await genButtonMessage(
				[{ id: `warn reset ${user}`, text: 'RESET' }],
				`⚠️WARNING⚠️\n*User :* @${jidToNum(
					user
				)}\n*Warn :* ${count}\n*Remaining :* ${config.WARN_LIMIT - count}`
			),
			{ contextInfo: { mentionedJid: [user] } },
			'button'
		)
	}
)
