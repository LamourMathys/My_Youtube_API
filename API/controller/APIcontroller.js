let youtubers = require('../youtubers.json')
const redisClient = require('../config/redis')

exports.getAllYT = async (req, res) => { //get 20 youtubers by page
  try {
    const page = parseInt(req.query.page) || 1 //http://localhost:3000/youtubers?page=1 
    const limit = 20
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const data = youtubers.slice(startIndex, endIndex)
    res.status(200).json({ success: true, data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Une erreur est survenue" })
  }
}


exports.getYTbyID = async (req, res) => {   //find specific youtuber with his id 
  try {
    const id = parseInt(req.params.id)
    const youtuber = youtubers.find(y => y.id === id)

    if (!youtuber) {
      return res.status(404).json({ success: false, error: "YouTubeur non trouvé" })
    }

    res.status(200).json({ success: true, data: youtuber })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Une erreur est survenue" })
  }
}

async function clearCache(id = null) { //clear redis when CUD
  if (!redisClient.isOpen) return
  try {
    const keys = await redisClient.keys('yt:cache:/YTAPI*')
    if (keys.length > 0) {
      await redisClient.del(keys)
    }

    if (id) {
      await redisClient.del(`yt:cache:/YTAPI/${id}`)
    }
  } catch (err) {
    console.error('Erreur invalidation cache :', err.message)
  }
}

function parseSubscribers(subStr) {
  if (typeof subStr === 'number') return subStr
  if (!subStr) return 0
  const str = String(subStr).trim().toUpperCase()
  if (str.endsWith('B')) return parseFloat(str) * 1e9
  if (str.endsWith('M')) return parseFloat(str) * 1e6
  if (str.endsWith('K')) return parseFloat(str) * 1e3
  const num = parseFloat(str)
  return isNaN(num) ? 0 : num
}

function reindex() {
  youtubers.sort((a, b) => parseSubscribers(b.nombre_abonnes) - parseSubscribers(a.nombre_abonnes))
  for (let i = 0; i < youtubers.length; i++) {
    youtubers[i].id = i + 1
    youtubers[i].classement = i + 1
  }
}

exports.createYT = async (req, res) => { //add a youtuber to the json file
  try {
    const { nom_chaine, nombre_abonnes, theme } = req.body

    if (!nom_chaine) {
      return res.status(400).json({ success: false, error: "Le nom de la chaîne est obligatoire" })
    }

    const newYoutuber = {
      id: 0,
      nom_chaine: nom_chaine,
      nombre_abonnes: nombre_abonnes || "?",
      theme: theme || "?",
      classement: 0
    }

    youtubers.push(newYoutuber)
    reindex()
    await clearCache()
    res.status(201).json({ success: true, data: newYoutuber })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Une erreur est survenue" })
  }
}

exports.updateYT = async (req, res) => { //update a specific youtuber with his id in the json file
  try {
    const id = parseInt(req.params.id)
    const youtuber = youtubers.find(y => y.id === id)

    if (!youtuber) {
      return res.status(404).json({ success: false, error: "YouTubeur non trouvé" })
    }

    const { nom_chaine, nombre_abonnes, theme } = req.body

    if (nom_chaine) youtuber.nom_chaine = nom_chaine
    if (nombre_abonnes) youtuber.nombre_abonnes = nombre_abonnes
    if (theme) youtuber.theme = theme

    reindex()
    await clearCache()
    res.status(200).json({ success: true, data: youtuber })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Une erreur est survenue" })
  }
}

exports.deleteYT = async (req, res) => { //delete a youtuber specific youtuber with his id in the json file 
  try {
    const id = parseInt(req.params.id)
    const index = youtubers.findIndex(y => y.id === id)

    if (index === -1) {
      return res.status(404).json({ success: false, error: "YouTubeur non trouvé" })
    }

    const deleted = youtubers.splice(index, 1)
    reindex()
    await clearCache()
    res.status(200).json({ success: true, message: "YouTubeur supprimé avec succès", data: deleted[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Une erreur est survenue" })
  }
}
