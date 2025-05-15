import { TelegramClient } from '@mtcute/node'
import SimpleFM from '@solely/simple-fm'

import { env } from './env.js'

const onlineIntervalMs = 1000 * env.ONLINE_INTERVAL_SECONDS
const updateIntervalMs = 1000 * env.UPDATE_INTERVAL_SECONDS
const lastFm = new SimpleFM(env.LASTFM_KEY)
const tg = new TelegramClient({
    apiId: env.API_ID,
    apiHash: env.API_HASH,
    storage: 'bot-data/session',
    disableUpdates: true,
})

async function getCurrentSongName() {
    const { tracks, search: { nowPlaying } } = await lastFm.user.getRecentTracks({ username: env.LASTFM_USERNAME })
    const currentTrack = tracks[0]
    if (!nowPlaying || !currentTrack) return null
    return currentTrack.artist ? `${currentTrack.artist.name} - ${currentTrack.name}` : currentTrack.name
}

async function updateNowPlayingStatus() {
    const currentSong = await getCurrentSongName()
    const nowPlaying = `🎵 ${currentSong || env.FALLBACK_MESSAGE}`
    await tg.call({
        _: 'account.updateBusinessLocation',
        address: nowPlaying,
    })
    setTimeout(updateNowPlayingStatus, updateIntervalMs)
}

async function sendOnline() {
    const me = await tg.getMe()
    await tg.call({
        _: "account.updateStatus",
        offline: false,
    })
    if (me.status !== "online") {
        await tg.call({
            _: "account.updateStatus",
            offline: true,
        })
    }
    setTimeout(sendOnline, onlineIntervalMs)
}

const user = await tg.start()
console.log('Logged in as', user.username)
await updateNowPlayingStatus()
setTimeout(sendOnline, onlineIntervalMs)
