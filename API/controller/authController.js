const axios = require('axios')

exports.googleLogin = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID,
    redirect_uri: process.env.OAUTH_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  })
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
}



exports.googleCallback = async (req, res) => {
  const { code } = req.query

  if (!code) {
    return res.status(400).json({ success: false, error: "Code d'autorisation manquant" })
  }

  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: process.env.OAUTH_REDIRECT_URI,
      grant_type: 'authorization_code'
    })

    const { access_token, id_token } = tokenResponse.data

    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    })

    const userEmail = userResponse.data.email
    const allowedEmail = process.env.SECRET_ADMIN_MAIL

    if (allowedEmail && userEmail !== allowedEmail) {
      if (req.query.format === 'json') {
        return res.status(403).json({ success: false, error: "Compte non autorisé" })
      }
      return res.redirect('/?error=unauthorized')
    }

    const token = process.env.TOKEN_JWT || access_token

    if (req.query.format === 'json') {
      return res.status(200).json({
        success: true,
        token,
        id_token,
        user: userResponse.data
      })
    }

    res.redirect(`/?token=${token}`)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    })
  }
}
