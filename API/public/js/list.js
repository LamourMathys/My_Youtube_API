const page = Number(urlParams.get('page')) || 1

document.getElementById('prev').href = '?page=' + Math.max(1, page - 1)
document.getElementById('next').href = '?page=' + (page + 1)

function renderCard(y) {
  return `
    <div class="box">
      <h3 style="margin-top: 0;">${y.nom_chaine}</h3>
      <p><strong>Abonnés :</strong> ${y.nombre_abonnes}</p>
      <p><strong>Thème :</strong> ${y.theme || '?'}</p>
      <p><strong>Classement :</strong> #${y.classement || y.id}</p>
    </div>
  `
}

function loadPage(p) {
  fetch('/YTAPI?page=' + p)
    .then(res => res.json())
    .then(result => {
      document.getElementById('liste').innerHTML = result.data.map(renderCard).join('')
    })
}

loadPage(page)
