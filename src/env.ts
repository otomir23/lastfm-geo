import process from 'node:process'

import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
    server: {
        API_ID: z.coerce.number().int(),
        API_HASH: z.string(),
        LASTFM_KEY: z.string(),
        LASTFM_USERNAME: z.string(),
        UPDATE_INTERVAL_SECONDS: z.coerce.number().int().default(10),
        FALLBACK_MESSAGE: z.string().default('Nothing playing!'),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
})
