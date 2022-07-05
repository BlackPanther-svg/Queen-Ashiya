const { getFilter, bot, setFilter, deleteFilter, lydia } = require('../lib/')
const fm = true

bot(
	{
		pattern: 'stop ?(.*)',
		fromMe: fm,
		desc: 'Delete filters in chat',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		if (!match) return await message.sendMessage(`*Example : .stop hi*`)
		const isDel = await deleteFilter(message.jid, match)
		if (!isDel)
			return await message.sendMessage(`_${match} not found in filters_`)
		return await message.sendMessage(`_${match} deleted._`)
	}
)

bot(
	{
		pattern: 'filter ?(.*)',
		fromMe: fm,
		desc: 'filter in groups',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		match = match.match(/[\'\"](.*?)[\'\"]/gms)
		if (!match) {
			const filters = await getFilter(message.jid)
			if (!filters)
				return await message.sendMessage(
					`_Not set any filter_\n*Example filter 'hi' 'hello'*`
				)
			let msg = ''
			filters.map(({ pattern }) => {
				msg += `=> ${pattern} \n`
			})
			return await message.sendMessage(msg.trim())
		} else {
			if (match.length < 2) {
				return await message.sendMessage(`Example filter 'hi' 'hello'`)
			}
			await setFilter(
				message.jid,
				match[0].replace(/['"]+/g, ''),
				match[1].replace(/['"]+/g, ''),
				match[0][0] === "'" ? true : false
			)
			await message.sendMessage(
				`_${match[0].replace(/['"]+/g, '')}_ added to filters.`
			)
		}
	}
)

bot({ on: 'text', fromMe: false }, async (message, match) => {
	const filters = await getFilter(message.jid)
	if (filters)
		filters.map(async ({ pattern, regex, text }) => {
			pattern = new RegExp(regex ? pattern : `\\b(${pattern})\\b`, 'gm')
			if (pattern.test(message.text)) {
				await message.sendMessage(text, {
					quoted: message.data,
				})
			}
		})

	const isLydia = await lydia(message)
	if (isLydia)
		return await message.sendMessage(isLydia, { quoted: message.data })
})

bot({ on: 'text', fromMe: true }, async (message, match) => {
	const isLydia = await lydia(message)
	if (isLydia)
		return await message.sendMessage(isLydia, { quoted: message.data })
})
