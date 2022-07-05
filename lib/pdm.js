const { bot, setPdm, genButtonMessage } = require('../lib/')

bot(
	{
		pattern: 'pdm ?(.*)',
		fromMe: true,
		desc: 'To manage promote demote alert',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		if (!match)
			await message.sendMessage(
				await genButtonMessage(
					[
						{ id: 'pdm on', text: 'ON' },
						{ id: 'pdm off', text: 'OFF' },
					],
					'Promote Demote Message'
				),
				{},
				'button'
			)
		if (match == 'on' || match == 'off') {
			await setPdm(message.jid, match)
			await message.sendMessage(
				`_pdm ${match == 'on' ? 'Activated' : 'Deactivated'}_`
			)
		}
	}
)
