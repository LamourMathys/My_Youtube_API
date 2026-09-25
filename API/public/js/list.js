(() => {
  const urlParams = new URLSearchParams(location.search)
  const page = Number(urlParams.get('page')) || 1

  const prevBtn = document.getElementById('prev')
  const nextBtn = document.getElementById('next')
  if (prevBtn) prevBtn.href = '?page=' + Math.max(1, page - 1)
  if (nextBtn) nextBtn.href = '?page=' + (page + 1)

  const avatarColors = [
    'bg-red-600', 'bg-blue-600', 'bg-emerald-600', 
    'bg-amber-600', 'bg-purple-600', 'bg-pink-600', 'bg-indigo-600'
  ]

  function renderCard(y) {
    const initial = (y.nom_chaine || 'Y').charAt(0).toUpperCase()
    const avatarColor = avatarColors[(y.id || 0) % avatarColors.length]

    return `
      <div class="flex flex-col group">
        <div class="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-800 mb-3 flex items-center justify-center">
          <div class="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-700"></div>

          <span class="relative z-10 text-white text-5xl font-bold">
            ${y.classement || y.id}
          </span>
        </div>

        <div class="flex gap-3 items-start">
          <div class="w-9 h-9 rounded-full ${avatarColor} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow">
            ${initial}
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-black text-sm line-clamp-2 leading-snug">
              ${y.nom_chaine}
            </h3>

            <div class="text-xs text-neutral-400 mt-1 flex items-center gap-1">
              <span class="truncate">${y.theme || 'Général'}</span>
              <svg class="w-3.5 h-3.5 fill-current text-neutral-400 shrink-0" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>

            <p class="text-xs text-neutral-400 mt-0.5">
              ${y.nombre_abonnes} abonnés
            </p>
          </div>
        </div>
      </div>
    `
  }

  function loadPage(p) {
    window.currentPage = p
    fetch('/YTAPI?page=' + p)
      .then(res => res.json())
      .then(result => {
        document.getElementById('liste').innerHTML = result.data.map(renderCard).join('')
      })
  }

  window.loadPage = loadPage
  window.currentPage = page
  loadPage(page)
})()
