const { bot } = require('../lib/')
const jimp = require('jimp')
const QRReader = require('qrcode-reader')

bot(
	{ pattern: 'qr ?(.*)', fromMe: true, desc: 'Read/Write Qr.', type: 'misc' },
	async (message, match) => {
		if (match)
			return await message.sendFromUrl(
				`https://levanter.up.railway.app/gqr?text=${match}`
			)
		if (!message.reply_message || !message.reply_message.image)
			return await message.sendMessage(
				'*Example : qr test*\n*Reply to a qr image.*'
			)

		const { bitmap } = await jimp.read(
			await message.reply_message.downloadMediaMessage()
		)
		const qr = new QRReader()
		qr.callback = (err, value) =>
			message.sendMessage(err ?? value.result, { quoted: message.data })
		qr.decode(bitmap)
	}
)
