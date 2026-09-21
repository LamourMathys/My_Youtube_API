const { createClient } = require('redis')

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

client.on('error', (err) => console.log('Erreur Redis :', err))

client.connect()

module.exports = client

//to verity that page are in the cache you can use docker exec -it redis-yt redis-cli then ----> KEYS "yt:*"