const searchId = document.getElementById('searchId')
const searchBtn = document.getElementById('searchBtn')
const resetBtn = document.getElementById('resetBtn')
const searchMsg = document.getElementById('searchMsg')
const nav = document.getElementById('paginationNav')

function renderDetailCard(y) {
  const token = localStorage.getItem('token')
  const adminButtons = token ? `
        <div style="margin-top: 12px; display: flex; gap: 8px;">
          <button id="editBtn" class="action-btn">Modifier</button>
          <button id="deleteBtn" class="action-btn danger">Supprimer</button>
        </div>
  ` : ''

  return `
    <div class="box" style="width: 280px;">
      <div id="cardView">
        <h3 id="viewNom" style="margin-top: 0;">${y.nom_chaine}</h3>
        <p><strong>Abonnés :</strong> <span id="viewSubs">${y.nombre_abonnes}</span></p>
        <p><strong>Thème :</strong> <span id="viewTheme">${y.theme || '?'}</span></p>
        <p><strong>Classement :</strong> #${y.classement || y.id}</p>
        ${adminButtons}
      </div>

      <div id="editForm" style="display: none; margin-top: 10px;">
        <div style="margin-bottom: 8px;">
          <input type="text" id="editNom" value="${y.nom_chaine}" placeholder="Nom de la chaîne" style="width: 90%; padding: 5px;">
        </div>
        <div style="margin-bottom: 8px;">
          <input type="text" id="editSubs" value="${y.nombre_abonnes}" placeholder="Nombre d'abonnés" style="width: 90%; padding: 5px;">
        </div>
        <div style="margin-bottom: 8px;">
          <input type="text" id="editTheme" value="${y.theme || ''}" placeholder="Thème" style="width: 90%; padding: 5px;">
        </div>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button id="saveEditBtn" class="action-btn">Enregistrer</button>
          <button id="cancelEditBtn" class="action-btn">Annuler</button>
        </div>
      </div>
      <div id="actionMsg" style="margin-top: 8px;"></div>
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
        actionMsg.className = 'msg-error'
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
          actionMsg.className = 'msg-success'
          actionMsg.textContent = 'Modifié avec succès'
        } else {
          actionMsg.className = 'msg-error'
          actionMsg.textContent = data.error || 'Erreur de modification'
        }
      })
      .catch(() => {
        actionMsg.className = 'msg-error'
        actionMsg.textContent = 'Erreur serveur'
      })
    })
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      const token = localStorage.getItem('token')
      if (!token) {
        actionMsg.className = 'msg-error'
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
          document.getElementById('liste').innerHTML = '<p class="msg-success">YouTubeur supprimé avec succès</p>'
        } else {
          actionMsg.className = 'msg-error'
          actionMsg.textContent = data.error || 'Erreur de suppression'
        }
      })
      .catch(() => {
        actionMsg.className = 'msg-error'
        actionMsg.textContent = 'Erreur serveur'
      })
    })
  }
}

function searchById() {
  const id = searchId.value.trim()
  if (!id) return

  fetch('/YTAPI/' + id)
    .then(res => res.json())
    .then(result => {
      if (result.success && result.data) {
        searchMsg.textContent = ''
        document.getElementById('liste').innerHTML = renderDetailCard(result.data)
        attachDetailEvents(result.data)
        nav.style.display = 'none'
        resetBtn.style.display = 'inline-block'
      } else {
        searchMsg.textContent = result.error || 'Non trouvé'
      }
    })
    .catch(() => {
      searchMsg.textContent = 'Erreur serveur'
    })
}

searchBtn.addEventListener('click', searchById)
searchId.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchById()
})

resetBtn.addEventListener('click', () => {
  searchId.value = ''
  searchMsg.textContent = ''
  resetBtn.style.display = 'none'
  nav.style.display = 'block'
  loadPage(page)
})
