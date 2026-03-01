// JobApp - Agenzie Module (con province)
const Agenzie = {
  agencies: [],
  favorites: [],
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
          if (a.nome.toLowerCase().includes(q)) return true;
          if (a.sedi) {
            return a.sedi.some(s => {
              const citta = s.citta?.toLowerCase() || '';
              const addr = s.indirizzo?.toLowerCase() || '';
              const provMatch = addr.match(/\b(BL|PD|RO|TV|VE|VR|VI)\b/i);
              const prov = provMatch ? provMatch[0].toLowerCase() : '';
              return citta.includes(q) || prov.includes(q);
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
        <div class="bg-blue-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">✓</div><div class="text-xs">Veneto</div></div>
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
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">${a.descrizione}</p>
          ${a.sedi?.length ? `<button onclick="Agenzie.openSedi(${a.id})" class="w-full py-3 bg-indigo-600 text-white rounded-2xl font-semibold">📍 Vedi ${a.sedi.length} Sedi</button>` : ''}
          ${a.sito ? `<a href="${a.sito}" target="_blank" class="block mt-2 w-full py-3 bg-blue-500 text-white rounded-2xl font-semibold text-center">🌐 Sito</a>` : ''}
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
    
    // Raggruppa per provincia
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
      html += `<div class="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3 mt-4 first:mt-0">📍 Provincia di ${this.getProvinciaName(prov)} (${sedi.length})</div>`;
      
      sedi.forEach(s => {
        html += `
          <div class="bg-gray-50 rounded-2xl p-4 mb-3">
            <div class="font-bold mb-2">${s.citta}</div>
            <div class="text-sm text-gray-600 space-y-2">
              <div>📍 ${s.indirizzo}</div>
              ${s.telefono ? `<a href="tel:${s.telefono}" class="text-indigo-600 block">📞 ${s.telefono}</a>` : ''}
              ${s.email ? `<a href="mailto:${s.email}" class="text-indigo-600 block break-all">✉️ ${s.email}</a>` : ''}
              ${s.googleMaps ? `<a href="${s.googleMaps}" target="_blank" class="text-indigo-600 font-bold block">🗺️ Apri in Google Maps</a>` : ''}
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
  
  loadFavorites() {
    const s = localStorage.getItem('agenzie_favorites');
    this.favorites = s ? JSON.parse(s) : [];
  },
  
  saveFavorites() {
    localStorage.setItem('agenzie_favorites', JSON.stringify(this.favorites));
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
