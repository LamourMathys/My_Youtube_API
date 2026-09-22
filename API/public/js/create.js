const createBtn = document.getElementById('createBtn')
if (createBtn) {
  createBtn.addEventListener('click', () => {
    const token = localStorage.getItem('token')
    const createMsg = document.getElementById('createMsg')
    if (!token) {
      createMsg.className = 'msg-error'
      createMsg.textContent = 'Connexion admin requise'
      return
    }

    const nom_chaine = document.getElementById('newNom').value.trim()
    const nombre_abonnes = document.getElementById('newSubs').value.trim()
    const theme = document.getElementById('newTheme').value.trim()

    if (!nom_chaine) {
      createMsg.className = 'msg-error'
      createMsg.textContent = 'Le nom de la chaîne est obligatoire'
      return
    }

    fetch('/YTAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ nom_chaine, nombre_abonnes, theme })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data) {
        createMsg.className = 'msg-success'
        createMsg.textContent = `Ajouté avec succès en #${data.data.classement} (ID: ${data.data.id})`
        document.getElementById('newNom').value = ''
        document.getElementById('newSubs').value = ''
        document.getElementById('newTheme').value = ''
        loadPage(page)
      } else {
        createMsg.className = 'msg-error'
        createMsg.textContent = data.error || "Erreur lors de l'ajout"
      }
    })
    .catch(() => {
      createMsg.className = 'msg-error'
      createMsg.textContent = 'Erreur serveur'
    })
  })
}
