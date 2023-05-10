require('dotenv').config()
export const REDIS_BLACKLIST_KEYNAME = `${process.env.REDIS_PREFIX}:jwt-blacklist` 