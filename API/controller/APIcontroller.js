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
