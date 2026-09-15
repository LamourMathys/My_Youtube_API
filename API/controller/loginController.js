const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
  const username = req.body.username ? String(req.body.username).trim() : ''
  const password = req.body.password ? String(req.body.password).trim() : ''

  const expectedUser = (process.env.SECRET_ADMIN || process.env.SECRET_ADMIN_MAIL || '').trim()
  const expectedHash = process.env.SECRET_ADMIN_PASSWORD_HASH
  const expectedPlain = process.env.SECRET_ADMIN_PASSWORD

  if (!username || username !== expectedUser) {
    return res.status(401).json({ success: false, error: "Identifiant incorrect" })
  }

  let match = false
  if (expectedHash) {
    match = await bcrypt.compare(password, expectedHash)
  }
  if (!match && expectedPlain && password === expectedPlain) {
    match = true
  }

  if (!match) {
    return res.status(401).json({ success: false, error: "Mot de passe incorrect" })
  }

  res.status(200).json({ success: true, token: process.env.TOKEN_JWT })
}
