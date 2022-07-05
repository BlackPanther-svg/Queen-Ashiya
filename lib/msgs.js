const { bot, getMsg, jidToNum, resetMsgs } = require('../lib')

bot(
	{
		pattern: 'msgs ?(.*)',
		fromMe: true,
		desc: 'shows groups message count',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const user = message.mention[0] || message.reply_message.jid
		// if (match) {
		// 	if (match == 'all') {
		// 		await resetMsgs(message.jid)
		// 		return await message.sendMessage('_Everyones message count deleted._')
		// 	}
		// 	await resetMsgs(message.jid, match)
		// 	return await message.sendMessage(
		// 		`_@${jidToNum(match)} message count deleted._`,
		// 		{ contextInfo: { mentionedJid: [match] } }
		// 	)
		// }
		const { participants } = await getMsg(message.jid, user)
		let msg = ''
		for (const participant in participants) {
			msg += `*Number :* ${jidToNum(participant)}\n*Name :* ${
				participants[participant].name
			}\n*Total Msgs :* ${participants[participant].total}\n`
			const { type } = participants[participant]
			for (const item in type) msg += `*${item} :* ${type[item]}\n`
			msg += '\n'
		}
		await message.sendMessage(msg.trim())
	}
)
