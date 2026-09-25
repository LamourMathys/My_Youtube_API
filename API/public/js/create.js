(() => {
  const toggleCreateBtn = document.getElementById('toggleCreateBtn')
  const createSection = document.getElementById('createSection')
  const createBtn = document.getElementById('createBtn')
  const createMsg = document.getElementById('createMsg')

  if (toggleCreateBtn && createSection) {
    toggleCreateBtn.addEventListener('click', () => {
      const isHidden = createSection.style.display === 'none' || createSection.classList.contains('hidden')
      createSection.style.display = isHidden ? 'block' : 'none'
      if (isHidden) {
        const inputNom = document.getElementById('newNom')
        if (inputNom) inputNom.focus()
      }
    })
  }

  function handleCreate() {
    const token = localStorage.getItem('token')
    if (!token) {
      if (createMsg) {
        createMsg.className = 'text-xs text-red-500 font-medium'
        createMsg.textContent = 'Connexion admin requise'
      }
      return
    }

    const nom_chaine = document.getElementById('newNom').value.trim()
    const nombre_abonnes = document.getElementById('newSubs').value.trim()
    const theme = document.getElementById('newTheme').value.trim()

    if (!nom_chaine) {
      if (createMsg) {
        createMsg.className = 'text-xs text-red-500 font-medium'
        createMsg.textContent = 'Le nom de la chaîne est obligatoire'
      }
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
        if (createMsg) {
          createMsg.className = 'text-xs text-green-600 font-medium'
          createMsg.textContent = `Ajouté avec succès en #${data.data.classement} (ID: ${data.data.id})`
        }
        document.getElementById('newNom').value = ''
        document.getElementById('newSubs').value = ''
        document.getElementById('newTheme').value = ''
        if (window.loadPage) window.loadPage(window.currentPage || 1)
      } else {
        if (createMsg) {
          createMsg.className = 'text-xs text-red-500 font-medium'
          createMsg.textContent = data.error || "Erreur lors de l'ajout"
        }
      }
    })
    .catch(() => {
      if (createMsg) {
        createMsg.className = 'text-xs text-red-500 font-medium'
        createMsg.textContent = 'Erreur serveur'
      }
    })
  }

  if (createBtn) {
    createBtn.addEventListener('click', handleCreate)
  }

  ['newNom', 'newSubs', 'newTheme'].forEach(id => {
    const input = document.getElementById(id)
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleCreate()
      })
    }
  })
})()
