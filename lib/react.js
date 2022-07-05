const { bot } = require('../lib/')
bot(
	{
		pattern: 'react ?(.*)',
		fromMe: true,
		desc: 'React to msg',
		type: 'misc',
	},
	async (message, match) => {
		if (!match || !message.reply_message)
			return await message.sendMessage('_Example : react ❣_')
		return await message.sendMessage(
			{
				text: match,
				key: message.reply_message.key,
			},
			{},
			'react'
		)
	}
)
