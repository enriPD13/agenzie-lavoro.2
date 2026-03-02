// JobApp - Preferiti Module
const Preferiti = {
  
  favorites: [],
  
  init() {
    console.log('✅ Preferiti.init()');
    this.loadFavorites();
    this.render();
  },
  
  loadFavorites() {
    const stored = localStorage.getItem('jobapp_favorites');
    this.favorites = stored ? JSON.parse(stored) : [];
  },
  
  render() {
    const content = document.getElementById('preferitiContent');
    const emptyState = document.getElementById('emptyState');
    
    if (!content) return;
    
    if (this.favorites.length === 0) {
      content.classList.add('hidden');
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }
    
    content.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    
    // Raggruppa per tipo
    const agenzie = this.favorites.filter(f => f.type === 'agenzia');
    const cpi = this.favorites.filter(f => f.type === 'cpi');
    const piattaforme = this.favorites.filter(f => f.type === 'piattaforma');
    
    let html = '';
    
    // Agenzie
    if (agenzie.length > 0) {
      html += `
        <div class="mb-6">
          <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>💼</span> Agenzie (${agenzie.length})
          </h2>
          <div class="space-y-3">
            ${agenzie.map(a => `
              <div class="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-4">
                ${a.logo ? `
                  <div class="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                    <img src="${a.logo}" alt="${a.nome}" class="max-w-full max-h-full object-contain"/>
                  </div>
                ` : `
                  <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-2xl font-bold">${a.nome.substring(0, 2)}</span>
                  </div>
                `}
                
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-900 mb-1">${a.nome}</h3>
                  <p class="text-sm text-gray-600 line-clamp-2 mb-2">${a.descrizione || ''}</p>
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    ${a.sedi ? `<span>📍 ${a.sedi} sed${a.sedi === 1 ? 'e' : 'i'}</span>` : ''}
                  </div>
                </div>
                
                <div class="flex flex-col gap-2">
                  <button onclick="Preferiti.removeFavorite(${a.id})" class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                  <button onclick="openAgenzieApp()" class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // CPI
    if (cpi.length > 0) {
      html += `
        <div class="mb-6">
          <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>🏢</span> Centri Per l'Impiego (${cpi.length})
          </h2>
          <div class="space-y-3">
            ${cpi.map(c => `
              <div class="bg-white rounded-2xl p-4 shadow-sm">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-bold text-gray-900">${c.nome}</h3>
                    <p class="text-sm text-gray-600">${c.citta || ''}</p>
                  </div>
                  <button onclick="Preferiti.removeFavorite(${c.id})" class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Piattaforme
    if (piattaforme.length > 0) {
      html += `
        <div class="mb-6">
          <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>📢</span> Piattaforme (${piattaforme.length})
          </h2>
          <div class="space-y-3">
            ${piattaforme.map(p => `
              <div class="bg-white rounded-2xl p-4 shadow-sm">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-bold text-gray-900">${p.nome}</h3>
                  </div>
                  <button onclick="Preferiti.removeFavorite(${p.id})" class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    content.innerHTML = html;
  },
  
  removeFavorite(id) {
    this.favorites = this.favorites.filter(f => f.id !== id);
    localStorage.setItem('jobapp_favorites', JSON.stringify(this.favorites));
    this.render();
  }
  
};
