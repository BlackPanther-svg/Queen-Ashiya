const {
	bot,
	isAdmin,
	setMute,
	addTask,
	genButtonMessage,
	c24to12,
	getMute,
} = require('../lib')

bot(
	{
		pattern: 'amute ?(.*)',
		fromMe: true,
		desc: 'auto group mute scheduler',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.sendMessage(`_I'm not admin._`)
		let msg = message.reply_message.text || 'null'
		const [hour, min] = match.split(' ')
		if (hour == 'info') {
			const task = await getMute(message.jid, 'mute')
			if (!task) return await message.sendMessage('_Not Found AutoMute_')
			const { hour, minute, msg, enabled } = task
			return await message.sendMessage(
				`*Hour :* ${hour}\n*Minute :* ${minute}\n*Time :* ${c24to12(
					`${hour}:${minute}`
				)}\n*Mute :* ${enabled ? 'on' : 'off'}\nMessage : ${msg}`
			)
		}
		if (hour == 'on' || hour == 'off') {
			const isMute = await setMute(message.jid, 'mute', hour == 'on')
			if (!isMute) return await message.sendMessage('_Not Found AutoMute')
			const task = await getMute(message.jid, 'mute')
			if (!task || !task.hour)
				return await message.sendMessage('_Not Found AutoMute_')
			const isTask = addTask(
				message.jid,
				'mute',
				hour == 'off' ? 'off' : task.hour,
				task.minute,
				message.client,
				task.msg
			)
			if (!isTask)
				return await message.sendMessage('_AutoMute Already Disabled_')
			return await message.sendMessage(
				`_AutoMute ${hour == 'on' ? 'Enabled' : 'Disabled'}._`
			)
		}
		if (!hour || !min || isNaN(hour) || isNaN(min))
			return await message.sendMessage(
				await genButtonMessage(
					[
						{ id: 'amute on', text: 'ON' },
						{ id: 'amute off', text: 'OFF' },
						{ id: 'amute info', text: 'INFO' },
					],
					'*Example : amute 6 0*\namute info\namute on/off'
				),
				{},
				'button'
			)
		await setMute(message.jid, 'mute', true, hour, min, msg)
		addTask(message.jid, 'mute', hour, min, message.client, msg)

		return await message.sendMessage(
			`_Group will Mute at ${c24to12(`${hour}:${min}`)}_${
				msg != 'null' ? `\n_Message: ${msg}_` : ''
			}`
		)
	}
)

bot(
	{
		pattern: 'aunmute ?(.*)',
		fromMe: true,
		desc: 'auto group unmute scheduler',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.sendMessage(`_I'm not admin._`)
		let msg = message.reply_message.text || 'null'
		const [hour, min] = match.split(' ')
		if (hour == 'info') {
			const task = await getMute(message.jid, 'unmute')
			if (!task || !task.hour)
				return await message.sendMessage('_Not Found AutoUnMute_')
			const { hour, minute, msg, enabled } = task
			return await message.sendMessage(
				`*Hour :* ${hour}\n*Minute :* ${minute}\n*Time :* ${c24to12(
					`${hour}:${minute}`
				)}\n*unMute :* ${enabled ? 'on' : 'off'}\nMessage : ${msg}`
			)
		}
		if (hour == 'on' || hour == 'off') {
			const isMute = await setMute(message.jid, 'unmute', hour == 'on')
			if (!isMute) return await message.sendMessage('_Not Found AutoUnMute_')
			const task = await getMute(message.jid, 'unmute')
			if (!task) return await message.sendMessage('_Not Found AutoUnMute_')
			const isTask = addTask(
				message.jid,
				'unmute',
				hour == 'off' ? 'off' : task.hour,
				task.minute,
				message.client,
				task.msg
			)
			if (!isTask)
				return await message.sendMessage('_AutoUnMute Already Disabled_')
			return await message.sendMessage(
				`_AutoUnMute ${hour == 'on' ? 'Enabled' : 'Disabled'}._`
			)
		}
		if (!hour || !min || isNaN(hour) || isNaN(min))
			return await message.sendMessage(
				await genButtonMessage(
					[
						{ id: 'aunmute on', text: 'ON' },
						{ id: 'aunmute off', text: 'OFF' },
						{ id: 'aunmute info', text: 'INFO' },
					],
					'*Example : aunmute 6 0*\naunmute info\naunmute on/off'
				),
				{},
				'button'
			)
		await setMute(message.jid, 'unmute', true, hour, min, msg)
		addTask(message.jid, 'unmute', hour, min, message.client, msg)
		return await message.sendMessage(
			`_Group will unMute at ${c24to12(`${hour}:${min}`)}_${
				msg != 'null' ? `\n_Message: ${msg}_` : ''
			}`
		)
	}
)
