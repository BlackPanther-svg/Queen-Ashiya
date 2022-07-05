const {
	audioCut,
	videoTrim,
	mergeVideo,
	getFfmpegBuffer,
	videoHeightWidth,
	avm,
	blackVideo,
	cropVideo,
	bot,
} = require('../lib/')
const fs = require('fs')
const fm = true

bot(
	{
		pattern: 'rotate ?(.*)',
		fromMe: true,
		desc: 'rotate video',
		type: 'video',
	},
	async (message, match) => {
		if (!message.reply_message || !message.reply_message.video)
			return await message.sendMessage('*Reply to a video*')
		if (match === '')
			return await message.sendMessage('*Example : rotate right|left|flip*')
		const location = await message.reply_message.downloadAndSaveMediaMessage(
			'rotate'
		)
		if (/right/.test(match)) {
			await message.sendMessage('_Converting..._')
			return await message.sendMessage(
				await getFfmpegBuffer(location, 'orotate.mp4', 'right'),
				{ mimetype: 'video/mp4', quoted: message.data },
				'video'
			)
		} else if (/left/.test(match)) {
			await message.sendMessage('_Converting..._')
			return await message.sendMessage(
				await getFfmpegBuffer(location, 'orotate.mp4', 'left'),
				{ mimetype: 'video/mp4', quoted: message.data },
				'video'
			)
		} else if (/flip/.test(match)) {
			await message.sendMessage('_Converting..._')
			return await message.sendMessage(
				await getFfmpegBuffer(location, 'orotate.mp4', 'flip'),
				{ mimetype: 'video/mp4', quoted: message.data },
				'video'
			)
		} else await message.sendMessage('*Example : rotate right|left|flip*')
	}
)

bot(
	{
		pattern: 'mp3',
		fromMe: fm,
		desc: 'video to audio or audio to voice note',
		type: 'video',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.video && !message.reply_message.audio)
		)
			return await message.sendMessage('*Reply to a video/audio*')
		return await message.sendMessage(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('mp3'),
				'mp3.mp3',
				'mp3'
			),
			{
				filename: 'mp3.mp3',
				mimetype: 'audio/mpeg',
				ptt: !message.reply_message.ptt,
				quoted: message.data,
			},
			'audio'
		)
	}
)

bot(
	{ pattern: 'photo', fromMe: fm, desc: 'sticker to image', type: 'sticker' },
	async (message, match) => {
		if (
			!message.reply_message.sticker ||
			message.reply_message === false ||
			message.reply_message.animated
		)
			return await message.sendMessage('*Reply to photo sticker*')
		return await message.sendMessage(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('photo'),
				'photo.png',
				'photo'
			),
			{ quoted: message.data, mimetype: 'image/png' },
			'image'
		)
	}
)

bot(
	{
		pattern: 'reverse',
		fromMe: true,
		desc: 'reverse video/audio',
		type: 'video',
	},
	async (message, match) => {
		if (
			!message.reply_message.audio &&
			!message.reply_message.video &&
			!message.reply_message
		)
			return await message.sendMessage('*Reply to video/audio*')
		const location = await message.reply_message.downloadAndSaveMediaMessage(
			'reverse'
		)
		if (message.reply_message.video == true) {
			return await message.sendMessage(
				await getFfmpegBuffer(location, 'revered.mp4', 'videor'),
				{ mimetype: 'video/mp4', quoted: message.data },
				'video'
			)
		} else if (message.reply_message.audio == true) {
			return await message.sendMessage(
				await getFfmpegBuffer(location, 'revered.mp3', 'audior'),
				{
					filename: 'revered.mp3',
					mimetype: 'audio/mpeg',
					ptt: false,
					quoted: message.data,
				},
				'audio'
			)
		}
	}
)

bot(
	{
		pattern: 'cut ?(.*)',
		fromMe: fm,
		desc: 'cut audio/video',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.sendMessage('*Reply to a audio/video.*')
		if (!match) return await message.sendMessage('*Example : trim 0;30*')
		const [start, duration] = match.split(';')
		if (!start || !duration || isNaN(start) || isNaN(duration))
			return await message.sendMessage('*Example : trim 10;30*')
		return await message.sendMessage(
			await audioCut(
				await message.reply_message.downloadAndSaveMediaMessage('cut'),
				start.trim(),
				duration.trim()
			),
			{
				filename: 'cut.mp3',
				mimetype: 'audio/mpeg',
				ptt: false,
				quoted: message.data,
			},
			'audio'
		)
	}
)

bot(
	{
		pattern: 'trim ?(.*)',
		fromMe: fm,
		desc: 'trim video',
		type: 'video',
	},
	async (message, match) => {
		if (!message.reply_message || !message.reply_message.video)
			return await message.sendMessage('*Reply to a video*')
		if (!match) return await message.sendMessage('*Example : trim 10;30*')
		const [start, duration] = match.split(';')
		if (!start || !duration || isNaN(start) || isNaN(duration))
			return await message.sendMessage('*Example : trim 60;30*')
		return await message.sendMessage(
			await videoTrim(
				await message.reply_message.downloadAndSaveMediaMessage('trim'),
				start,
				duration
			),
			{ mimetype: 'video/mp4', quoted: message.data },
			'video'
		)
	}
)
// bot(
//   { pattern: 'page ?(.*)', fromMe: fm, desc: 'To add images.' },
//   async (message, match) => {
//     if (!message.reply_message || !message.reply_message.image)
//       return await message.sendMessage('*Reply to a image.*')
//     if (isNaN(match))
//       return await message.sendMessage(
//         '*Reply with order number*\n*Ex: .page 1*'
//       )
//     if (!fs.existsSync('./pdf')) {
//       fs.mkdirSync('./pdf')
//     }
//     await message.reply_message.downloadAndSaveMediaMessage(`./pdf/${match}`)
//     return await message.sendMessage('```Added page``` ' + match)
//   }
// )

// bot(
//   {
//     pattern: 'pdf ?(.*)',
//     fromMe: fm,
//     desc: 'Convert images to pdf.',
//   },
//   async (message, match) => {
//     if (!fs.existsSync('./pdf')) {
//       fs.mkdirSync('./pdf')
//     }
//     const length = fs.readdirSync('./pdf').length
//     if (length == 0)
//       return await message.sendMessage(
//         '```Add pages in order with``` _page_ *command.*'
//       )
//     const pages = []
//     let i = 1
//     while (i <= length) {
//       let path = './pdf/' + i + '.jpeg'
//       if (fs.existsSync(path)) {
//         pages.push(path)
//         i++
//       } else return message.sendMessage('```' + `Missing page ${i}` + '```')
//     }
//     await message.sendMessage('```Uploading pdf...``` ')
//     pdf(pages)
//       .pipe(fs.createWriteStream('./pdf.pdf'))
//       .on('finish', async () => {
//         fsExtra.emptyDirSync('./pdf')
//         return await message.sendMessage(
//           fs.readFileSync('pdf.pdf'),
//           {
//             filename: Math.floor(Math.random() * 999999),
//             mimetype: Mimetype.pdf,
//             quoted: message.data,
//           },
//           'document'
//         )
//       })
//   }
// )

bot(
	{
		pattern: 'merge ?(.*)',
		fromMe: true,
		desc: 'Merge videos',
		type: 'video',
	},
	async (message, match) => {
		if (!fs.existsSync('./media/merge')) {
			fs.mkdirSync('./media/merge')
		}
		if (
			match == '' &&
			message.reply_message != false &&
			!message.reply_message.video
		)
			return await message.sendMessage('*Reply to a video*')
		if (match == '' && isNaN(match))
			return await message.sendMessage(
				'*Reply with order number*\n*Ex: .merge 1*'
			)
		if (/[0-9]+/.test(match)) {
			await message.reply_message.downloadAndSaveMediaMessage(
				'./media/merge/' + match
			)
			return await message.sendMessage('```video ' + match + ' added```')
		} else {
			let length = fs.readdirSync('./media/merge').length
			if (!(length > 0))
				return await message.sendMessage(
					'```Add videos in order.```\n*Example .merge 1*'
				)
			await message.sendMessage('```Merging ' + length + ' videos...```')
			return await message.sendMessage(
				await mergeVideo(length),
				{ mimetype: 'video/mp4', quoted: message.data },
				'video'
			)
		}
	}
)

bot(
	{
		pattern: 'compress ?(.*)',
		fromMe: true,
		desc: 'compress video',
		type: 'video',
	},
	async (message, match) => {
		if (!message.reply_message || !message.reply_message.video)
			return await message.sendMessage('*Reply to a video*')
		return await message.sendMessage(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('compress'),
				'ocompress.mp4',
				'compress'
			),
			{ quoted: message.data },
			'video'
		)
	}
)

bot(
	{
		pattern: 'bass ?(.*)',
		fromMe: true,
		desc: 'alter audio bass',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.sendMessage('*Reply to a audio/video.*')
		return await message.sendMessage(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('basso'),
				'bass.mp3',
				`bass,${match == '' ? 10 : match}`
			),
			{ mimetype: 'audio/mpeg', quoted: message.data },
			'audio'
		)
	}
)

bot(
	{
		pattern: 'treble ?(.*)',
		fromMe: true,
		desc: 'alter audio treble',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.sendMessage('*Reply to a audio/video.*')
		return await message.sendMessage(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('trebleo'),
				'treble.mp3',
				`treble,${match == '' ? 10 : match}`
			),
			{ mimetype: 'audio/mpeg', quoted: message.data },
			'audio'
		)
	}
)

bot(
	{
		pattern: 'histo',
		fromMe: true,
		desc: 'audio to video',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.sendMessage('*Reply to a audio/video.*')
		return await message.sendMessage(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('histo'),
				'histo.mp4',
				'histo'
			),
			{ mimetype: 'video/mp4', quoted: message.data },
			'video'
		)
	}
)

bot(
	{
		pattern: 'vector',
		fromMe: true,
		desc: 'audio to video',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.sendMessage('*Reply to a audio/video.*')
		return await message.sendMessage(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('vector'),
				'vector.mp4',
				'vector'
			),
			{ mimetype: 'video/mp4', quoted: message.data },
			'video'
		)
	}
)
bot(
	{
		pattern: 'crop ?(.*)',
		fromMe: true,
		desc: 'To crop video\nExample \n.crop 512,512,0,512\n.crop outW,outH,WtoCrop,HtoCrop',
		type: 'video',
	},
	async (message, match) => {
		if (!message.reply_message || !message.reply_message.video)
			return await message.sendMessage('*Reply to a video*')
		const [vw, vh, w, h] = match.split(',')
		if (
			!vh ||
			!vw ||
			!w ||
			!h ||
			typeof +vh !== 'number' ||
			typeof +w !== 'number' ||
			typeof +h !== 'number' ||
			typeof +vw !== 'number'
		)
			return await message.sendMessage(
				`*Example :*\ncrop out_w,out_h,x,y\nx and y are top left where to start croping`
			)
		const location = await message.reply_message.downloadAndSaveMediaMessage(
			'plain'
		)
		const { height, width } = await videoHeightWidth(location)
		if (vw > width || vh > height)
			return await message.sendMessage(
				`*Video width: ${width}, height: ${height}*\n*Choose output size in between.*`
			)
		return await message.sendMessage(
			await cropVideo(location, vw, vh, w, h),
			{ mimetype: 'video/mp4', quoted: message.data },
			'video'
		)
	}
)

bot(
	{
		pattern: 'low',
		fromMe: true,
		desc: 'alter audio',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.sendMessage('*Reply to a audio/video.*')
		return await message.sendMessage(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('lowmp3'),
				'lowmp3.mp3',
				'pitch'
			),
			{ filename: 'lowmp3.mp3', mimetype: 'audio/mpeg', quoted: message.data },
			'audio'
		)
	}
)
bot(
	{
		pattern: 'pitch',
		fromMe: true,
		desc: 'alter audio',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.sendMessage('*Reply to a audio/video.*')
		return await message.sendMessage(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('pitchmp3'),
				'lowmp3.mp3',
				'lowmp3'
			),
			{ filename: 'lowmp3.mp3', mimetype: 'audio/mpeg', quoted: message.data },
			'audio'
		)
	}
)
bot(
	{
		pattern: 'avec',
		fromMe: true,
		desc: 'audio to video',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.sendMessage('*Reply to a audio/video.*')
		return await message.sendMessage(
			await getFfmpegBuffer(
				await message.reply_message.downloadAndSaveMediaMessage('avec'),
				'avec.mp4',
				'avec'
			),
			{ mimetype: 'video/mp4', quoted: message.data },
			'video'
		)
	}
)

bot(
	{
		pattern: 'avm',
		fromMe: true,
		desc: 'Merge audio and video',
		type: 'misc',
	},
	async (message, match) => {
		if (!fs.existsSync('./media/avm')) {
			fs.mkdirSync('./media/avm')
		}
		let files = fs.readdirSync('./media/avm/')
		if (
			(!message.reply_message && files.length < 2) ||
			(message.reply_message &&
				!message.reply_message.audio &&
				!message.reply_message.video)
		)
			return await message.sendMessage(
				'*add audio & video to merge*\n*Reply to a message.*'
			)
		if (message.reply_message.audio) {
			await message.reply_message.downloadAndSaveMediaMessage(
				'./media/avm/audio'
			)
			return await message.sendMessage('```Added audio.```')
		}
		if (message.reply_message.video) {
			await message.reply_message.downloadAndSaveMediaMessage(
				'./media/avm/video'
			)
			return await message.sendMessage('```Added video.```')
		}
		return await message.sendMessage(
			await avm(files),
			{ quoted: message.data },
			'video'
		)
	}
)

bot(
	{
		pattern: 'black',
		fromMe: true,
		desc: 'Audio to video.',
		type: 'audio',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.sendMessage('*Reply to a audio/video.*')
		await message.sendMessage(
			await blackVideo(
				await message.reply_message.downloadAndSaveMediaMessage('black')
			),
			{ quoted: message.data },
			'video'
		)
	}
)
