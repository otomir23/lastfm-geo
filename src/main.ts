import { TelegramClient } from '@mtcute/node'
import SimpleFM from '@solely/simple-fm'

import { env } from './env.js'

const updateIntervalMs = 1000 * env.UPDATE_INTERVAL_SECONDS
const lastFm = new SimpleFM(env.LASTFM_KEY)
const tg = new TelegramClient({
    apiId: env.API_ID,
    apiHash: env.API_HASH,
    storage: 'bot-data/session',
    updates: false,
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

const user = await tg.start()
console.log('Logged in as', user.username)
await updateNowPlayingStatus()
