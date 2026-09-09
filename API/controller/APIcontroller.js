let youtubers = require('../youtubers.json')

exports.getAllYT = async (req, res) => { //json
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

//change when the data will be on a db

exports.getYTbyID = async (req, res) => {   //json
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

exports.createYT = async (req, res) => {
  try {
    const { nom_chaine, nombre_abonnes, theme } = req.body

    if (!nom_chaine) {
      return res.status(400).json({ success: false, error: "Le nom de la chaîne est obligatoire" })
    }

    const newYoutuber = {
      id: youtubers.length + 1,
      nom_chaine: nom_chaine,
      nombre_abonnes: nombre_abonnes || "?",
      theme: theme || "?",
      classement: youtubers.length + 1
    }

    youtubers.push(newYoutuber)

    res.status(201).json({ success: true, data: newYoutuber })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Une erreur est survenue" })
  }
}

exports.deleteYT = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const index = youtubers.findIndex(y => y.id === id)

    if (index === -1) {
      return res.status(404).json({ success: false, error: "YouTubeur non trouvé" })
    }

    const deleted = youtubers.splice(index, 1)

    res.status(200).json({ success: true, message: "YouTubeur supprimé avec succès", data: deleted[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Une erreur est survenue" })
  }
}
