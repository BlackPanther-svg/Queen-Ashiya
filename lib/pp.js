const { bot } = require('../lib/')

bot(
	{
		pattern: 'fullpp ?(.*)',
		fromMe: true,
		desc: 'set full size profile picture',
		type: 'user',
	},
	async (message, match) => {
		if (!message.reply_message || !message.reply_message.image)
			return await message.sendMessage('*Reply to a image.*')
		await message.updateProfilePicture(
			await message.reply_message.downloadMediaMessage(),
			message.client.user.jid
		)
		return await message.sendMessage('_Profile Picture Updated_')
	}
)
