import { TelegramClient } from '@mtcute/node'
import SimpleFM from '@solely/simple-fm'

import { env } from './env.js'

const lastFm = new SimpleFM(env.LASTFM_KEY)
const tg = new TelegramClient({
    apiId: env.API_ID,
    apiHash: env.API_HASH,
    storage: 'bot-data/session',
})

const user = await tg.start()
console.log('Logged in as', user.username)
