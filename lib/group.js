const {
	isAdmin,
	sleep,
	bot,
	numToJid,
	jidToNum,
	formatTime,
} = require('../lib/')
const fm = true

bot(
	{
		pattern: 'kick ?(.*)',
		fromMe: fm,
		desc: 'Remove members from Group.',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.sendMessage(`_I'm not admin._`)
		let user =
			message.mention[0] ||
			message.reply_message.jid ||
			(match == 'all' && match)
		if (!user) return await message.sendMessage(`_Give me a user_`)
		const isUserAdmin = user != 'all' && (await isAdmin(participants, user))
		if (isUserAdmin) return await message.sendMessage(`_User is admin._`)
		if (user == 'all') {
			user = participants
				.filter((member) => !member.admin == true)
				.map(({ id }) => id)
			await message.sendMessage(
				`_kicking everyone(${user.length})_\n*Restart bot if u wanna stop.*`
			)
			await sleep(10 * 1000)
		}
		return await message.Kick(user)
	}
)

bot(
	{
		pattern: 'add ?(.*)',
		fromMe: true,
		desc: 'To add members',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.sendMessage(`_I'm not admin._`)
		match = match || message.reply_message.jid
		if (!match) return await message.sendMessage('Example : add 91987654321')
		match = jidToNum(match)
		const res = await message.Add(match)
		if (res == '403') return await message.sendMessage('_Failed, Invite sent_')
		else if (res && res != '200')
			return await message.sendMessage(res, { quoted: message.data })
	}
)

bot(
	{
		pattern: 'promote ?(.*)',
		fromMe: fm,
		desc: 'Give admin role.',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.sendMessage(`_I'm not admin._`)
		const user = message.mention[0] || message.reply_message.jid
		if (!user) return await message.sendMessage(`_Give me a user._`)
		const isUserAdmin = await isAdmin(participants, user)
		if (isUserAdmin)
			return await message.sendMessage(`_User is already admin._`)
		return await message.Promote(user)
	}
)

bot(
	{
		pattern: 'demote ?(.*)',
		fromMe: fm,
		desc: 'Remove admin role.',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.sendMessage(`_I'm not admin._`)
		const user = message.mention[0] || message.reply_message.jid
		if (!user) return await message.sendMessage(`_Give me a user._`)
		const isUserAdmin = await isAdmin(participants, user)
		if (!isUserAdmin)
			return await message.sendMessage(`_User is not an admin._`)
		return await message.Demote(user)
	}
)

bot(
	{
		pattern: 'invite ?(.*)',
		fromMe: fm,
		desc: 'Get Group invite',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.sendMessage(`_I'm not admin._`)
		return await message.sendMessage(await message.inviteCode(message.jid))
	}
)

bot(
	{
		pattern: 'mute ?(.*)',
		fromMe: fm,
		desc: 'Makes Groups Admins Only.',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.sendMessage(`_I'm not admin._`)
		if (!match || isNaN(match))
			return await message.GroupSettingsChange(message.jid, true)
		await message.GroupSettingsChange(message.jid, true)
		await message.sendMessage(`_Muted for ${match} min._`)
		await sleep(1000 * 60 * match)
		return await message.GroupSettingsChange(message.jid, false)
	}
)

bot(
	{
		pattern: 'unmute ?(.*)',
		fromMe: fm,
		desc: 'Makes Group All participants can send Message.',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.sendMessage(`_I'm not admin._`)
		return await message.GroupSettingsChange(message.jid, false)
	}
)

bot(
	{
		pattern: 'join ?(.*)',
		fromMe: fm,
		type: 'group',
		desc: 'Join invite link.',
	},
	async (message, match) => {
		match = match || message.reply_message.text
		if (!match)
			return await message.sendMessage(`_Give me a Group invite link._`)
		const wa = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/
		const [_, code] = match.match(wa) || []
		if (!code)
			return await message.sendMessage(`_Give me a Group invite link._`)
		const res = await message.infoInvite(code)
		if (res.size > 512) return await message.sendMessage('*Group full!*')
		await message.acceptInvite(code)
		return await message.sendMessage(`_Joined_`)
	}
)

bot(
	{
		pattern: 'revoke',
		fromMe: fm,
		onlyGroup: true,
		type: 'group',
		desc: 'Revoke Group invite link.',
	},
	async (message, match) => {
		const participants = await message.groupMetadata(message.jid)
		const im = await isAdmin(participants, message.client.user.jid)
		if (!im) return await message.sendMessage(`_I'm not admin._`)
		await message.revokeInvite(message.jid)
	}
)

bot(
	{
		pattern: 'ginfo ?(.*)',
		fromMe: fm,
		type: 'group',
		desc: 'Shows group invite info',
	},
	async (message, match) => {
		match = match || message.reply_message.text
		if (!match)
			return await message.sendMessage('*Example : info group_invte_link*')
		const linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
		const [_, code] = match.match(linkRegex) || []
		if (!code) return await message.sendMessage('_Invalid invite link_')
		const res = await message.infoInvite(code)
		return await message.sendMessage(
			'```' +
				`Name    : ${res.subject}
Jid     : ${res.id}@g.us
Owner   : ${jidToNum(res.creator)}
Members : ${res.size}
Created : ${formatTime(res.creation)}` +
				'```'
		)
	}
)
