(() => {
  const searchId = document.getElementById('searchId')
  const searchBtn = document.getElementById('searchBtn')
  const resetBtn = document.getElementById('resetBtn')
  const searchMsg = document.getElementById('searchMsg')
  const nav = document.getElementById('paginationNav')

  const avatarColors = [
    'bg-red-600', 'bg-blue-600', 'bg-emerald-600', 
    'bg-amber-600', 'bg-purple-600', 'bg-pink-600', 'bg-indigo-600'
  ]

  function renderDetailCard(y) {
    const token = localStorage.getItem('token')
    const initial = (y.nom_chaine || 'Y').charAt(0).toUpperCase()
    const avatarColor = avatarColors[(y.id || 0) % avatarColors.length]

    const adminButtons = token ? `
      <div class="mt-3 flex gap-2">
        <button id="editBtn" class="px-3 py-1 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition cursor-pointer">Modifier</button>
        <button id="deleteBtn" class="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition cursor-pointer">Supprimer</button>
      </div>
    ` : ''

    return `
      <div class="max-w-sm w-full flex flex-col group">
        <div class="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-800 mb-3 flex items-center justify-center">
          <div class="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-700"></div>
          <span class="relative z-10 text-white text-5xl font-bold">
            ${y.classement || y.id}
          </span>
        </div>

        <div id="cardView">
          <div class="flex gap-3 items-start">
            <div class="w-9 h-9 rounded-full ${avatarColor} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow">
              ${initial}
            </div>

            <div class="flex-1 min-w-0">
              <h3 id="viewNom" class="font-semibold text-black text-base line-clamp-2 leading-snug">
                ${y.nom_chaine}
              </h3>

              <div class="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                <span id="viewTheme" class="truncate">${y.theme || 'Général'}</span>
                <svg class="w-3.5 h-3.5 fill-current text-neutral-400 shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>

              <p class="text-xs text-neutral-400 mt-0.5">
                <span id="viewSubs">${y.nombre_abonnes}</span> abonnés
              </p>
            </div>
          </div>

          ${adminButtons}
        </div>

        <div id="editForm" style="display: none;" class="mt-3 p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-3">
          <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wide">Modifier le YouTubeur</h4>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Nom de la chaîne</label>
            <input type="text" id="editNom" value="${y.nom_chaine}" class="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Abonnés</label>
            <input type="text" id="editSubs" value="${y.nombre_abonnes}" class="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Thème</label>
            <input type="text" id="editTheme" value="${y.theme || ''}" class="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black">
          </div>
          <div class="flex gap-2 pt-1">
            <button id="saveEditBtn" class="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 cursor-pointer">Enregistrer</button>
            <button id="cancelEditBtn" class="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-300 cursor-pointer">Annuler</button>
          </div>
        </div>

        <div id="actionMsg" class="mt-2 text-xs font-medium"></div>
      </div>
    `
  }

  function attachDetailEvents(item) {
    let currentY = item
    const editBtn = document.getElementById('editBtn')
    const deleteBtn = document.getElementById('deleteBtn')
    const saveEditBtn = document.getElementById('saveEditBtn')
    const cancelEditBtn = document.getElementById('cancelEditBtn')
    const cardView = document.getElementById('cardView')
    const editForm = document.getElementById('editForm')
    const actionMsg = document.getElementById('actionMsg')

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        cardView.style.display = 'none'
        editForm.style.display = 'block'
        actionMsg.textContent = ''
      })
    }

    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', () => {
        cardView.style.display = 'block'
        editForm.style.display = 'none'
        actionMsg.textContent = ''
      })
    }

    if (saveEditBtn) {
      saveEditBtn.addEventListener('click', () => {
        const token = localStorage.getItem('token')
        if (!token) {
          actionMsg.className = 'mt-2 text-xs font-medium text-red-600'
          actionMsg.textContent = 'Connexion admin requise'
          return
        }

        const nom_chaine = document.getElementById('editNom').value.trim()
        const nombre_abonnes = document.getElementById('editSubs').value.trim()
        const theme = document.getElementById('editTheme').value.trim()

        fetch('/YTAPI/' + currentY.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ nom_chaine, nombre_abonnes, theme })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            currentY = data.data
            document.getElementById('viewNom').textContent = currentY.nom_chaine
            document.getElementById('viewSubs').textContent = currentY.nombre_abonnes
            document.getElementById('viewTheme').textContent = currentY.theme || '?'
            cardView.style.display = 'block'
            editForm.style.display = 'none'
            actionMsg.className = 'mt-2 text-xs font-medium text-green-600'
            actionMsg.textContent = 'Modifié avec succès'
          } else {
            actionMsg.className = 'mt-2 text-xs font-medium text-red-600'
            actionMsg.textContent = data.error || 'Erreur de modification'
          }
        })
        .catch(() => {
          actionMsg.className = 'mt-2 text-xs font-medium text-red-600'
          actionMsg.textContent = 'Erreur serveur'
        })
      })
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        const token = localStorage.getItem('token')
        if (!token) {
          actionMsg.className = 'mt-2 text-xs font-medium text-red-600'
          actionMsg.textContent = 'Connexion admin requise'
          return
        }

        if (!confirm('Supprimer ce YouTubeur ?')) return

        fetch('/YTAPI/' + currentY.id, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            document.getElementById('liste').innerHTML = '<p class="text-sm font-medium text-green-600">YouTubeur supprimé avec succès</p>'
          } else {
            actionMsg.className = 'mt-2 text-xs font-medium text-red-600'
            actionMsg.textContent = data.error || 'Erreur de suppression'
          }
        })
        .catch(() => {
          actionMsg.className = 'mt-2 text-xs font-medium text-red-600'
          actionMsg.textContent = 'Erreur serveur'
        })
      })
    }
  }

  function searchById() {
    if (!searchId) return
    const id = searchId.value.trim()
    if (!id) return

    fetch('/YTAPI/' + id)
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          if (searchMsg) searchMsg.textContent = ''
          document.getElementById('liste').innerHTML = renderDetailCard(result.data)
          attachDetailEvents(result.data)
          if (nav) nav.style.display = 'none'
          if (resetBtn) resetBtn.style.display = 'inline-block'
        } else {
          if (searchMsg) searchMsg.textContent = result.error || 'Non trouvé'
        }
      })
      .catch(() => {
        if (searchMsg) searchMsg.textContent = 'Erreur serveur'
      })
  }

  if (searchBtn) searchBtn.addEventListener('click', searchById)
  if (searchId) {
    searchId.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchById()
    })
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchId) searchId.value = ''
      if (searchMsg) searchMsg.textContent = ''
      resetBtn.style.display = 'none'
      if (nav) nav.style.display = 'flex'
      if (window.loadPage) window.loadPage(window.currentPage || 1)
    })
  }
})()
