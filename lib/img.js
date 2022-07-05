const { bot, googleImageSearch } = require('../lib')

bot(
	{
		pattern: 'img ?(.*)',
		fromMe: true,
		desc: 'Download img from google',
		type: 'search',
	},
	async (message, match) => {
		if (!match)
			return await message.sendMessage('*Example :  img bot*\n*img 10 bot*')
		let lim = 3
		const count = /\d+/.exec(match)
		if (count) {
			match = match.replace(count[0], '')
			lim = count[0]
		}
		const result = await googleImageSearch(match)
		lim =
			(result.length && (result.length > lim ? lim : result.length)) ||
			result.length
		await message.sendMessage(`_Downloading ${lim} images of ${match.trim()}_`)
		for (let i = 0; i < lim; i++) {
			await message.sendFromUrl(result[i])
		}
	}
)
