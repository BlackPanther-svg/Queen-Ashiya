const { bot, tts } = require('../lib/')
const config = require('../config')
bot(
	{
		pattern: 'tts ?(.*)',
		fromMe: true,
		desc: 'text to speach',
		type: 'misc',
	},
	async (message, match) => {
		match = match || message.reply_message.text
		if (!match)
			return await message.sendMessage('*Example : tts Hi*\n*tts Hi {ml}*')
		let LANG = config.LANG
		const lang = match.match('\\{([a-z]+)\\}')
		if (lang) {
			match = match.replace(lang[0], '')
			LANG = lang[1]
		}
		await message.sendMessage(
			await tts(LANG, match),
			{ ptt: true, mimetype: 'audio/ogg; codecs=opus' },
			'audio'
		)
	}
)
