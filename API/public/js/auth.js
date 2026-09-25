(() => {
  const urlParams = new URLSearchParams(location.search)
  const tokenFromUrl = urlParams.get('token')

  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl)
    history.replaceState({}, document.title, location.pathname)
  }

  const errorFromUrl = urlParams.get('error')
  if (errorFromUrl) {
    const msg = document.getElementById('loginMsg')
    if (msg) msg.textContent = 'Compte Google non autorisé'
    history.replaceState({}, document.title, location.pathname)
  }

  function updateAuthUI() {
    const token = localStorage.getItem('token')
    const loginForm = document.getElementById('loginForm')
    const loggedSection = document.getElementById('loggedSection')
    const createSection = document.getElementById('createSection')

    if (token) {
      if (loginForm) loginForm.style.display = 'none'
      if (loggedSection) loggedSection.style.display = 'flex'
    } else {
      if (loginForm) loginForm.style.display = 'flex'
      if (loggedSection) loggedSection.style.display = 'none'
      if (createSection) createSection.style.display = 'none'
    }
  }

  const loginBtn = document.getElementById('loginBtn')
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const username = document.getElementById('username').value
      const password = document.getElementById('password').value
      const msg = document.getElementById('loginMsg')

      fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.token) {
          localStorage.setItem('token', data.token)
          if (msg) msg.textContent = ''
          updateAuthUI()
        } else {
          if (msg) msg.textContent = data.error || 'Erreur de connexion'
        }
      })
      .catch(() => {
        if (msg) msg.textContent = 'Erreur serveur'
      })
    })
  }

  const passwordInput = document.getElementById('password')
  if (passwordInput && loginBtn) {
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loginBtn.click()
    })
  }

  const logoutBtn = document.getElementById('logoutBtn')
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token')
      updateAuthUI()
    })
  }

  updateAuthUI()
})()
