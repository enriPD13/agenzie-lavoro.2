// JobApp - Agenzie Module
const Agenzie = {
  agencies: [],
  favorites: [],
  favoriteSedi: [],
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
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-xl font-bold flex-1">${a.nome}</h3>
            <button onclick="Agenzie.toggleFavorite(${a.id})" class="ml-2 w-10 h-10 rounded-full flex items-center justify-center ${this.isFavorite(a.id) ? 'bg-yellow-100' : 'bg-gray-100'}">
              <svg class="w-6 h-6 ${this.isFavorite(a.id) ? 'text-yellow-500' : 'text-gray-400'}" fill="${this.isFavorite(a.id) ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </button>
          </div>
          
          ${a.settori?.length > 0 ? `
            <div class="flex flex-wrap gap-2 mb-3">
              ${a.settori.slice(0, 2).map(s => `<span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">${s}</span>`).join('')}
              ${a.settori.length > 2 ? `<span class="text-xs text-gray-500">+${a.settori.length - 2}</span>` : ''}
            </div>
          ` : ''}
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">${a.descrizione}</p>
          
          <div class="grid grid-cols-2 gap-2">
            ${a.sedi?.length ? `
              <button onclick="Agenzie.openSedi(${a.id})" class="py-3 bg-indigo-600 text-white rounded-2xl font-semibold text-sm">
                📍 Sedi (${a.sedi.length})
              </button>
            ` : '<div></div>'}
            
            ${a.formIscrizione ? `
              <a href="${a.formIscrizione}" target="_blank" class="py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center">
                ✉️ Iscriviti
              </a>
            ` : '<div></div>'}
          </div>
          
          ${a.sito ? `
            <a href="${a.sito}" target="_blank" class="block mt-2 w-full py-3 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl font-semibold text-sm text-center">
              🌐 Candidati
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
      // ✅ RIMOSSA EMOJI provincia
      html += `<div class="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-4 mt-6 first:mt-0">Provincia di ${this.getProvinciaName(prov)} (${sedi.length})</div>`;
      
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
              <div>📍 ${s.indirizzo}</div>
              ${s.telefono ? `<a href="tel:${s.telefono}" class="text-blue-600 hover:text-blue-800 underline block">📞 ${s.telefono}</a>` : ''}
              ${s.email ? `<a href="mailto:${s.email}" class="text-blue-600 hover:text-blue-800 underline block break-all">✉️ ${s.email}</a>` : ''}
              ${s.googleMaps ? `<a href="${s.googleMaps}" target="_blank" class="text-blue-600 hover:text-blue-800 font-bold underline block">🗺️ Apri in Google Maps</a>` : ''}
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
  
  // ✅ FIX: Solo agenzia cliccata
  toggleFavorite(id) {
    const agency = this.agencies.find(a => a.id === id);
    if (!agency) return;
    
    const index = this.favorites.findIndex(f => f.id === id);
    
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push({
        id: id,
        type: 'agenzia',
        nome: agency.nome,
        descrizione: agency.descrizione,
        logo: agency.logo,
        sito: agency.sito,
        sedi: agency.sedi?.length || 0
      });
    }
    
    this.saveFavorites();
    this.render();
  },
  
  isFavorite(id) {
    return this.favorites.some(f => f.id === id);
  },
  
  toggleSedeFavorite(sedeId, agencyName, city) {
    const fav = { id: sedeId, agency: agencyName, city: city };
    const index = this.favoriteSedi.findIndex(f => f.id === sedeId);
    
    if (index > -1) {
      this.favoriteSedi.splice(index, 1);
    } else {
      this.favoriteSedi.push(fav);
    }
    
    this.saveFavoriteSedi();
    this.openSedi(parseInt(sedeId.split('-')[0]));
  },
  
  isSedeInFavorites(sedeId) {
    return this.favoriteSedi.some(f => f.id === sedeId);
  },
  
  loadFavorites() {
    const s = localStorage.getItem('jobapp_favorites');
    this.favorites = s ? JSON.parse(s) : [];
  },
  
  saveFavorites() {
    localStorage.setItem('jobapp_favorites', JSON.stringify(this.favorites));
  },
  
  loadFavoriteSedi() {
    const s = localStorage.getItem('jobapp_sedi_favorites');
    this.favoriteSedi = s ? JSON.parse(s) : [];
  },
  
  saveFavoriteSedi() {
    localStorage.setItem('jobapp_sedi_favorites', JSON.stringify(this.favoriteSedi));
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
