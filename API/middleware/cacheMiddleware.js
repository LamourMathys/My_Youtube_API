const redisClient = require('../config/redis')

const cache = async (req, res, next) => {
  if (!redisClient.isOpen) return next()

  const key = `yt:cache:${req.originalUrl}`

  const cachedData = await redisClient.get(key)
  if (cachedData) {
    return res.json(JSON.parse(cachedData))
  }

  // pas en cache intercepter res.json pour save
  const sendJson = res.json.bind(res)
  res.json = (body) => {
    if (res.statusCode === 200) {
      redisClient.set(key, JSON.stringify(body), { EX: 300 }).catch(() => {}) 
    }
    return sendJson(body)
  }

  next()
}

module.exports = cache