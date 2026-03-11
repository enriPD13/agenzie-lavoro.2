// JobApp - Enti di Formazione Module con Firebase
const Enti = {
  allEnti: [],
  favorites: [],
  favoriteSedi: [],
  filteredEnti: [],
  
  async init() {
    setTimeout(() => {
      const loading = document.getElementById('loadingEnti');
      if (loading) loading.classList.add('hidden');
    }, 500);
    this.loadData();
    this.setupSearch();
  },
  
  async loadData() {
    try {
      const response = await fetch('data/enti.json');
      this.allEnti = await response.json();
      this.allEnti.sort((a, b) => a.nome.localeCompare(b.nome));
      this.filteredEnti = this.allEnti;
      await this.loadFavorites();
      this.render();
    } catch (error) {
      this.showError(error.message);
    }
  },
  
  setupSearch() {
    const input = document.getElementById('searchInputEnti');
    if (!input) return;
    
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      
      if (q === '') {
        this.filteredEnti = this.allEnti;
      } else {
        this.filteredEnti = this.allEnti.filter(e => {
          return e.nome.toLowerCase().includes(q) || 
                 e.citta.toLowerCase().includes(q) ||
                 e.provincia_sigla.toLowerCase() === q;
        });
      }
      this.render();
    });
  },
  
  render() {
    const grid = document.getElementById('entiGrid');
    if (!grid) return;
    
    const stats = document.getElementById('statsEnti');
    if (stats) {
      stats.innerHTML = `
        <div class="bg-purple-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">${this.filteredEnti.length}</div><div class="text-xs">Enti</div></div>
        <div class="bg-pink-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">✓</div><div class="text-xs">Veneto</div></div>
      `;
    }
    
    if (this.filteredEnti.length === 0) {
      grid.innerHTML = '<div class="text-center py-12"><div class="text-6xl mb-4">🔍</div><h3 class="text-xl font-bold">Nessun Risultato</h3></div>';
      return;
    }
    
    grid.innerHTML = this.filteredEnti.map(e => this.renderEnteCard(e)).join('');
  },
  
  renderEnteCard(e) {
    const isFav = this.isFavorite(e.id);
    
    return `
      <div class="bg-white rounded-3xl overflow-hidden shadow-sm">
        <div class="h-36 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
          ${e.logo ? `<img src="${e.logo}" alt="${e.nome}" class="max-h-28 object-contain"/>` : `<div class="text-6xl">🎓</div>`}
        </div>
        
        <div class="p-5">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-xl font-bold flex-1">${e.nome}</h3>
            <button onclick="Enti.toggleFavorite('${e.id}')" class="ml-2 w-10 h-10 flex items-center justify-center -mr-2">
              <svg class="w-5 h-5 ${this.isFavorite(e.id) ? 'text-purple-600' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </button>
          </div>
          
          ${e.sede_principale ? `<div class="text-sm text-gray-600 mb-3">${e.sede_principale}</div>` : ''}
          
          ${e.descrizione ? `<p class="text-sm text-gray-600 mb-4 line-clamp-2">${e.descrizione}</p>` : ''}
          
          <div class="space-y-2">
            <div class="flex items-start gap-2 text-sm text-gray-600">
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
              <span>${e.indirizzo}, ${e.cap} ${e.citta}</span>
            </div>
            
            ${e.telefono ? `<a href="tel:${e.telefono}" class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 underline"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>${e.telefono}</a>` : ''}
            
            ${e.email ? `<a href="mailto:${e.email}" class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 underline break-all"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>${e.email}</a>` : ''}
          </div>
          
          <div class="grid grid-cols-2 gap-2 mt-4">
            ${e.googleMaps ? `
              <a href="${e.googleMaps}" target="_blank" class="py-3 bg-purple-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Sedi (${e.sedi || 1})
              </a>
            ` : '<div></div>'}
            
            ${e.sito ? `
              <a href="${e.sito}" target="_blank" class="py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                Sito Web
              </a>
            ` : '<div></div>'}
          </div>
        </div>
      </div>
    `;
  },
  
  async toggleFavorite(enteId) {
    if (!window.FirebaseFavorites) return;
    
    const index = this.favorites.indexOf(enteId);
    if (index > -1) {
      await FirebaseFavorites.removeEnte(enteId);
    } else {
      await FirebaseFavorites.addEnte(enteId);
    }
    await this.loadFavorites();
    this.render();
  },
  
  isFavorite(enteId) {
    return this.favorites.includes(enteId);
  },
  
  async loadFavorites() {
    if (!window.FirebaseFavorites || !FirebaseFavorites.isReady) {
      if (window.FirebaseFavorites) await FirebaseFavorites.init();
    }
    if (window.FirebaseFavorites && FirebaseFavorites.isLoggedIn()) {
      const favs = await FirebaseFavorites.getFavorites();
      if (favs) {
        this.favorites = favs.enti || [];
        this.favoriteSedi = favs.enti_sedi || [];
      }
    } else {
      this.favorites = [];
      this.favoriteSedi = [];
    }
  },
  
  async saveFavorites() {
    // Non serve più - usa FirebaseFavorites
  },
  
  async saveFavoriteSedi() {
    // Non serve più - usa FirebaseFavorites
  },
  
  async toggleSedeFavorite(sedeId, enteNome, city) {
    if (!window.FirebaseFavorites) return;
    
    const fav = { id: sedeId, ente: enteNome, city: city };
    const index = this.favoriteSedi.findIndex(f => f.id === sedeId);
    
    if (index > -1) {
      await FirebaseFavorites.removeEnteSede(sedeId);
    } else {
      await FirebaseFavorites.addEnteSede(fav);
    }
    
    await this.loadFavorites();
  },
  
  isSedeInFavorites(sedeId) {
    return this.favoriteSedi.some(f => f.id === sedeId);
  },
  
  showError(msg) {
    const grid = document.getElementById('entiGrid');
    if (grid) grid.innerHTML = '<div class="text-center py-12"><p class="text-red-600">' + msg + '</p></div>';
  }
};
