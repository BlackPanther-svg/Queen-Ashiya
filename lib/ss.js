const { bot, isUrl } = require('../lib/')

bot(
	{
		pattern: 'ss ?(.*)',
		fromMe: true,
		desc: 'Take web page screenshot',
		type: 'download',
	},
	async (message, match) => {
		match = isUrl(match || message.reply_message.text)
		if (!match) return await message.sendMessage('_Example : ss url_')
		await message.sendFromUrl(
			`https://shot.screenshotapi.net/screenshot?&url=${match}&fresh=true&output=image&file_type=png&block_ads=true&no_cookie_banners=true&destroy_screenshot=true&dark_mode=true&wait_for_event=networkidle`
		)
	}
)

bot(
	{
		pattern: 'fullss ?(.*)',
		fromMe: true,
		desc: 'Take web page screenshot',
		type: 'download',
	},
	async (message, match) => {
		match = isUrl(match || message.reply_message.text)
		if (!match) return await message.sendMessage('_Example : fullss url_')
		await message.sendFromUrl(
			`https://shot.screenshotapi.net/screenshot?&url=${match}&full_page=true&output=image&file_type=png&block_ads=true&no_cookie_banners=true&destroy_screenshot=true&dark_mode=true&wait_for_event=networkidle`
		)
	}
)
