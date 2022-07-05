const {
	enableGreetings,
	setMessage,
	deleteMessage,
	bot,
	getMessage,
	genHydratedButtons,
	greetingsPreview,
	clearGreetings,
} = require('../lib/')

bot(
	{
		pattern: 'welcome ?(.*)',
		fromMe: true,
		desc: 'Welcome new members',
		onlyGroup: true,
		type: 'group',
	},
	async (message, match) => {
		const welcome = await getMessage(message.jid, 'welcome')
		if (!match && !welcome)
			return await message.sendMessage('*Example : welcome Hi &mention*')
		if (!match) {
			await message.sendMessage(welcome.message)
			return await message.sendMessage(
				await genHydratedButtons(
					[
						{
							urlButton: {
								text: 'Example',
								url: 'https://github.com/lyfe00011//whatsapp-bot-md/wiki/Greetings',
							},
						},
						{ button: { id: 'welcome on', text: 'ON' } },
						{ button: { id: 'welcome off', text: 'OFF' } },
					],
					'Welcome'
				),
				{},
				'template'
			)
		}
		if (match == 'on' || match == 'off') {
			if (!welcome)
				return await message.sendMessage('*Example : welcome Hi #mention*')
			await enableGreetings(message.jid, 'welcome', match)
			return await message.sendMessage(
				`_Welcome  ${match == 'on' ? 'Enabled' : 'Disabled'}_`
			)
		}
		if (match === 'delete') {
			await message.sendMessage('_Welcome deleted_')
			clearGreetings(message.jid, 'welcome')
			return await deleteMessage(message.jid, 'welcome')
		}
		await setMessage(message.jid, 'welcome', match)
		const { msg, options, type } = await greetingsPreview(message, 'welcome')
		await message.sendMessage(msg, options, type)
		return await message.sendMessage('_Welcome set_')
	}
)

bot(
	{
		pattern: 'goodbye ?(.*)',
		fromMe: true,
		desc: 'Goodbye members',
		onlyGroup: true,
		type: 'group',
	},
	async (message, match) => {
		const welcome = await getMessage(message.jid, 'goodbye')
		if (!match && !welcome)
			return await message.sendMessage('*Example : goodbye Bye &mention*')
		if (!match) {
			await message.sendMessage(welcome.message)
			return await message.sendMessage(
				await genHydratedButtons(
					[
						{
							urlButton: {
								url: 'https://github.com/lyfe00011/whatsapp-bot-md/wiki/Greetings',
								text: 'Example',
							},
						},
						{
							button: { id: 'goodbye on', text: 'ON' },
						},
						{ button: { id: 'goodbye off', text: 'OFF' } },
					],
					'Goodbye'
				),
				{},
				'template'
			)
		}
		if (match == 'on' || match == 'off') {
			if (!welcome)
				return await message.sendMessage('*Example : goodbye Bye #mention*')
			await enableGreetings(message.jid, 'goodbye', match)
			return await message.sendMessage(
				`_Goodbye ${match == 'on' ? 'Enabled' : 'Disabled'}_`
			)
		}
		if (match === 'delete') {
			await message.sendMessage('_Goodbye deleted_')
			clearGreetings(message.jid, 'goodbye')
			return await deleteMessage(message.jid, 'goodbye')
		}
		await setMessage(message.jid, 'goodbye', match)
		const { msg, options, type } = await greetingsPreview(message, 'goodbye')
		await message.sendMessage(msg, options, type)
		return await message.sendMessage('_Goodbye set_')
	}
)
