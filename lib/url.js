const { bot, getUrl } = require('../lib/')

bot(
	{
		pattern: 'url ?(.*)',
		fromMe: true,
		desc: 'Image/Video to url',
		type: 'misc',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.image && !message.reply_message.video)
		)
			return await message.sendMessage('*Reply to a image/video*')
		await message.sendMessage(
			await getUrl(
				await message.reply_message.downloadAndSaveMediaMessage('url'),
				false
			)
		)
	}
)
