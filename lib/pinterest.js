const { pinterest, bot, isUrl } = require('../lib/')

bot(
	{
		pattern: 'pinterest ?(.*)',
		fromMe: true,
		desc: 'Download pinterest video/image',
		type: 'download',
	},
	async (message, match) => {
		match = isUrl(match || message.reply_message.text)
		if (!match) return await message.sendMessage('_Example : pinterest url_')
		const result = await pinterest(match)
		if (!result)
			return await message.sendMessage('*Not found*', {
				quoted: message.quoted,
			})
		return await message.sendFromUrl(result)
	}
)
