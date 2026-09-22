const urlParams = new URLSearchParams(location.search)
const tokenFromUrl = urlParams.get('token')

if (tokenFromUrl) {
  localStorage.setItem('token', tokenFromUrl)
  history.replaceState({}, document.title, location.pathname)
}

const errorFromUrl = urlParams.get('error')
if (errorFromUrl) {
  const msg = document.getElementById('loginMsg')
  msg.className = 'msg-error'
  msg.textContent = 'Compte Google non autorisé'
  history.replaceState({}, document.title, location.pathname)
}

function updateAuthUI() {
  const token = localStorage.getItem('token')
  const createSection = document.getElementById('createSection')
  if (token) {
    document.getElementById('loginForm').style.display = 'none'
    document.getElementById('loggedSection').style.display = 'block'
    if (createSection) createSection.style.display = 'block'
  } else {
    document.getElementById('loginForm').style.display = 'block'
    document.getElementById('loggedSection').style.display = 'none'
    if (createSection) createSection.style.display = 'none'
  }
}

document.getElementById('loginBtn').addEventListener('click', () => {
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
      msg.textContent = ''
      updateAuthUI()
    } else {
      msg.className = 'msg-error'
      msg.textContent = data.error || 'Erreur de connexion'
    }
  })
  .catch(() => {
    msg.className = 'msg-error'
    msg.textContent = 'Erreur serveur'
  })
})

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token')
  updateAuthUI()
})

updateAuthUI()
