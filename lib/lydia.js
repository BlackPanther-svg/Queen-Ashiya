const { setLydia, bot } = require('../lib/')

bot(
	{
		pattern: 'lydia ?(.*)',
		fromMe: true,
		desc: 'to on off chat bot',
		type: 'misc',
	},
	async (message, match) => {
		if (!match)
			return await message.sendMessage(
				'*Example : lydia on/off*\n_Reply or mention to activate for a person only._'
			)
		const user = message.mention[0] || message.reply_message.jid || message.jid
		await setLydia(message.jid, match == 'on', user)
		await message.sendMessage(
			`_Lydia ${
				match == 'on' ? 'Activated' : 'Deactivated'
			}_\n*Only works from reply msg.`
		)
	}
)
