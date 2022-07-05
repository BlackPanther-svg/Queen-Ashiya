const { bot, genListMessage, getJson } = require('../lib/')

bot(
	{
		pattern: 'news ?(.*)',
		fromMe: true,
		desc: 'malayalam news',
		type: 'misc',
	},
	async (message, match) => {
		if (!match) {
			const { result } = await getJson('https://levanter.up.railway.app/news')
			return await message.sendMessage(
				genListMessage(
					result.map(({ title, url }) => ({
						text: title,
						id: `news ${url}`,
					})),
					result.map(({ title }) => title).join('\n\n'),
					'READ'
				),
				{},
				'list'
			)
		}
		if (match.startsWith('http')) {
			const { result } = await getJson(
				`https://levanter.up.railway.app/news?url=${match}`
			)
			return await message.sendMessage(result, { quoted: message.data })
		}
	}
)
