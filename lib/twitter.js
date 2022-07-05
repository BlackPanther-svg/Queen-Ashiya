const { twitter, bot, genButtonMessage, isUrl } = require('../lib/')

bot(
	{
		pattern: 'twitter ?(.*)',
		fromMe: true,
		desc: 'Download twitter video',
		type: 'download',
	},
	async (message, match) => {
		match = isUrl(match || message.reply_message.text)
		if (!match) return await message.sendMessage('_Example : twitter url_')
		const result = await twitter(match)
		if (!result.length)
			return await message.sendMessage('*Not found*', {
				quoted: message.quoted,
			})
		return await message.sendMessage(
			await genButtonMessage(
				result.map((e) => ({
					id: `upload ${e.url}`,
					text: e.quality.split('x')[0],
				})),
				'Choose Video Quality'
			),
			{},
			'button'
		)
	}
)
