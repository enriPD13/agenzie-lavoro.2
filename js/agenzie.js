// JobApp - Agenzie Module
const Agenzie = {
  agencies: [],
  favorites: [],
  favoriteSedi: [], // ✅ NUOVO: Preferiti per sedi
  filteredAgencies: [],
  
  init() {
    setTimeout(() => {
      const loading = document.getElementById('loadingAgenzie');
      if (loading) loading.classList.add('hidden');
    }, 500);
    this.loadData();
    this.setupSearch();
  },
  
  async loadData() {
    try {
      const response = await fetch('data/agenzie.json');
      this.agencies = await response.json();
      this.agencies.sort((a, b) => a.nome.localeCompare(b.nome));
      this.filteredAgencies = this.agencies;
      this.loadFavorites();
      this.loadFavoriteSedi();
      this.render();
    } catch (error) {
      this.showError(error.message);
    }
  },
  
  setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      
      if (q === '') {
        this.filteredAgencies = this.agencies;
      } else {
        this.filteredAgencies = this.agencies.filter(a => {
          if (a.nome.toLowerCase().startsWith(q)) return true;
          if (a.sedi) {
            return a.sedi.some(s => {
              const citta = s.citta?.toLowerCase() || '';
              const addr = s.indirizzo?.toLowerCase() || '';
              const provMatch = addr.match(/\b(BL|PD|RO|TV|VE|VR|VI)\b/i);
              const prov = provMatch ? provMatch[0].toLowerCase() : '';
              return citta.includes(q) || prov === q;
            });
          }
          return false;
        });
      }
      this.render();
    });
  },
  
  render() {
    const grid = document.getElementById('agenciesGrid');
    if (!grid) return;
    
    // ✅ STATS: Solo 2 card (rimosso Veneto)
    const stats = document.getElementById('statsCards');
    if (stats) {
      const total = this.filteredAgencies.length;
      const sedi = this.filteredAgencies.reduce((s, a) => s + (a.sedi?.length || 0), 0);
      stats.innerHTML = `
        <div class="bg-indigo-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">${total}</div><div class="text-xs">Agenzie</div></div>
        <div class="bg-pink-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">${sedi}</div><div class="text-xs">Sedi</div></div>
      `;
    }
    
    if (this.filteredAgencies.length === 0) {
      grid.innerHTML = '<div class="text-center py-12"><div class="text-6xl mb-4">🔍</div><h3 class="text-xl font-bold">Nessun Risultato</h3></div>';
      return;
    }
    
    grid.innerHTML = this.filteredAgencies.map(a => `
      <div class="bg-white rounded-3xl overflow-hidden shadow-sm">
        ${a.logo ? `<div class="h-36 bg-gray-50 flex items-center justify-center p-6"><img src="${a.logo}" alt="${a.nome}" class="max-h-28 object-contain"/></div>` : ''}
        <div class="p-5">
          <h3 class="text-xl font-bold mb-2">${a.nome}</h3>
          ${a.settori?.length > 0 ? `
            <div class="flex flex-wrap gap-2 mb-3">
              ${a.settori.slice(0, 2).map(s => `<span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">${s}</span>`).join('')}
              ${a.settori.length > 2 ? `<span class="text-xs text-gray-500">+${a.settori.length - 2}</span>` : ''}
            </div>
          ` : ''}
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">${a.descrizione}</p>
          
          <div class="grid grid-cols-2 gap-2">
            ${a.sedi?.length ? `
              <button onclick="Agenzie.openSedi(${a.id})" class="py-3 bg-indigo-600 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Sedi (${a.sedi.length})
              </button>
            ` : '<div></div>'}
            
            ${a.formIscrizione ? `
              <a href="${a.formIscrizione}" target="_blank" class="py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Iscriviti
              </a>
            ` : '<div></div>'}
          </div>
          
          ${a.sito ? `
            <a href="${a.sito}" target="_blank" class="block mt-2 w-full py-3 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Candidati
            </a>
          ` : ''}
        </div>
      </div>
    `).join('');
  },
  
  getProvincia(sede) {
    const addr = sede.indirizzo || '';
    const match = addr.match(/\b(BL|PD|RO|TV|VE|VR|VI)\b/i);
    return match ? match[0].toUpperCase() : 'ALTRE';
  },
  
  getProvinciaName(sigla) {
    const nomi = {
      'BL': 'Belluno', 'PD': 'Padova', 'RO': 'Rovigo', 'TV': 'Treviso',
      'VE': 'Venezia', 'VR': 'Verona', 'VI': 'Vicenza'
    };
    return nomi[sigla] || 'Altre Province';
  },
  
  openSedi(id) {
    const agency = this.agencies.find(a => a.id === id);
    if (!agency) return;
    
    document.getElementById('sediAgencyName').textContent = agency.nome;
    document.getElementById('sediCount').textContent = `${agency.sedi.length} sed${agency.sedi.length === 1 ? 'e' : 'i'} in Veneto`;
    
    const perProv = {};
    agency.sedi.forEach(s => {
      const prov = this.getProvincia(s);
      if (!perProv[prov]) perProv[prov] = [];
      perProv[prov].push(s);
    });
    
    const provOrdinate = Object.keys(perProv).sort();
    
    let html = '';
    provOrdinate.forEach(prov => {
      const sedi = perProv[prov];
      html += `<div class="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-4 mt-6 first:mt-0">📍 Provincia di ${this.getProvinciaName(prov)} (${sedi.length})</div>`;
      
      sedi.forEach((s, idx) => {
        const sedeId = `${id}-${idx}`;
        const isFav = this.isSedeInFavorites(sedeId);
        
        html += `
          <div class="bg-gray-50 rounded-2xl p-4 mb-4">
            <div class="flex items-start justify-between mb-2">
              <div class="font-bold">${s.citta}</div>
              <button onclick="Agenzie.toggleSedeFavorite('${sedeId}', '${agency.nome}', '${s.citta}')" class="w-8 h-8 rounded-full flex items-center justify-center ${isFav ? 'bg-yellow-100' : 'bg-gray-100'}">
                <svg class="w-5 h-5 ${isFav ? 'text-yellow-500' : 'text-gray-400'}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </button>
            </div>
            <div class="text-sm text-gray-600 space-y-2">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                <span>${s.indirizzo}</span>
              </div>
              ${s.telefono ? `<a href="tel:${s.telefono}" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>${s.telefono}</a>` : ''}
              ${s.email ? `<a href="mailto:${s.email}" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline break-all"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>${s.email}</a>` : ''}
              ${s.googleMaps ? `<a href="${s.googleMaps}" target="_blank" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold underline"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>Apri in Google Maps</a>` : ''}
            </div>
          </div>
        `;
      });
    });
    
    document.getElementById('sediContent').innerHTML = html;
    
    const sheet = document.getElementById('sediSheet');
    sheet.classList.remove('hidden');
    setTimeout(() => sheet.querySelector('.bottom-sheet').classList.add('active'), 10);
  },
  
  toggleFavorite(id) {
    if (this.favorites.includes(id)) {
      this.favorites = this.favorites.filter(f => f !== id);
    } else {
      this.favorites.push(id);
    }
    this.saveFavorites();
    this.render();
  },
  
  isFavorite(id) {
    return this.favorites.includes(id);
  },
  
  // ✅ NUOVE FUNZIONI PER PREFERITI SEDI
  toggleSedeFavorite(sedeId, agencyName, city) {
    const fav = { id: sedeId, agency: agencyName, city: city };
    const index = this.favoriteSedi.findIndex(f => f.id === sedeId);
    
    if (index > -1) {
      this.favoriteSedi.splice(index, 1);
    } else {
      this.favoriteSedi.push(fav);
    }
    
    this.saveFavoriteSedi();
    this.openSedi(parseInt(sedeId.split('-')[0])); // Ricarica il bottom sheet
  },
  
  isSedeInFavorites(sedeId) {
    return this.favoriteSedi.some(f => f.id === sedeId);
  },
  
  loadFavorites() {
    const s = localStorage.getItem('agenzie_favorites');
    this.favorites = s ? JSON.parse(s) : [];
  },
  
  saveFavorites() {
    localStorage.setItem('agenzie_favorites', JSON.stringify(this.favorites));
  },
  
  loadFavoriteSedi() {
    const s = localStorage.getItem('agenzie_sedi_favorites');
    this.favoriteSedi = s ? JSON.parse(s) : [];
  },
  
  saveFavoriteSedi() {
    localStorage.setItem('agenzie_sedi_favorites', JSON.stringify(this.favoriteSedi));
  },
  
  showError(msg) {
    const grid = document.getElementById('agenciesGrid');
    if (grid) grid.innerHTML = `<div class="text-center py-12"><p class="text-red-600">${msg}</p></div>`;
  }
};

function closeSedi() {
  const sheet = document.getElementById('sediSheet');
  sheet.querySelector('.bottom-sheet').classList.remove('active');
  setTimeout(() => sheet.classList.add('hidden'), 300);
}
