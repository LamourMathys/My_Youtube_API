exports.verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.headers['x-access-token'] || req.query.token

  if (!token) {
    return res.status(401).json({ success: false, error: 'Accès refusé : token manquant' })
  }

  if (token !== process.env.TOKEN_JWT) {
    return res.status(403).json({ success: false, error: 'Accès refusé : token invalide' })
  }

  next()
}
