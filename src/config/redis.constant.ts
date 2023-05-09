require('dotenv').config()
const prefix = 'restulTypescriptKoa'
export const REDIS_BLACKLIST_KEYNAME = `${process.env.REDIS_PREFIX || prefix}:jwt-blacklist` 