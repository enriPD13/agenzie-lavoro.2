// JobApp - CPI Module
const CPI = {
  allCPI: [],
  favorites: [],
  favoriteSedi: [],
  filteredProvinces: [],
  provinceData: {},
  
  init() {
    setTimeout(() => {
      const loading = document.getElementById('loadingCPI');
      if (loading) loading.classList.add('hidden');
    }, 500);
    this.loadData();
    this.setupSearch();
  },
  
  async loadData() {
    try {
      const response = await fetch('data/cpi.json');
      this.allCPI = await response.json();
      
      this.provinceData = {};
      this.allCPI.forEach(cpi => {
        const prov = cpi.provincia;
        if (!this.provinceData[prov]) {
          this.provinceData[prov] = {
            nome: prov,
            sigla: cpi.provincia_sigla,
            sedi: []
          };
        }
        this.provinceData[prov].sedi.push(cpi);
      });
      
      this.filteredProvinces = Object.values(this.provinceData).sort((a, b) => a.nome.localeCompare(b.nome));
      this.loadFavorites();
      this.loadFavoriteSedi();
      this.render();
    } catch (error) {
      this.showError(error.message);
    }
  },
  
  setupSearch() {
    const input = document.getElementById('searchInputCPI');
    if (!input) return;
    
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      
      if (q === '') {
        this.filteredProvinces = Object.values(this.provinceData).sort((a, b) => a.nome.localeCompare(b.nome));
      } else {
        this.filteredProvinces = Object.values(this.provinceData).filter(p => {
          if (p.nome.toLowerCase().includes(q)) return true;
          if (p.sigla.toLowerCase() === q) return true;
          return p.sedi.some(s => s.citta.toLowerCase().includes(q));
        });
      }
      this.render();
    });
  },
  
  render() {
    const grid = document.getElementById('cpiGrid');
    if (!grid) return;
    
    const stats = document.getElementById('statsCPI');
    if (stats) {
      const totalProv = this.filteredProvinces.length;
      const totalSedi = this.filteredProvinces.reduce((s, p) => s + p.sedi.length, 0);
      stats.innerHTML = `
        <div class="bg-blue-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">${totalProv}</div><div class="text-xs">Province</div></div>
        <div class="bg-cyan-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">${totalSedi}</div><div class="text-xs">Sedi CPI</div></div>
      `;
    }
    
    if (this.filteredProvinces.length === 0) {
      grid.innerHTML = '<div class="text-center py-12"><div class="text-6xl mb-4">🔍</div><h3 class="text-xl font-bold">Nessun Risultato</h3></div>';
      return;
    }
    
    grid.innerHTML = this.filteredProvinces.map(p => this.renderProvinciaCard(p)).join('');
  },
  
  renderProvinciaCard(p) {
    const isFav = this.isFavorite(p.sigla);
    const favClass = isFav ? 'bg-yellow-100' : 'bg-gray-100';
    const starColor = isFav ? 'text-yellow-500' : 'text-gray-400';
    const starFill = isFav ? 'currentColor' : 'none';
    
    const provinciaLower = p.nome.toLowerCase();
    const flagPath = `images/province/${provinciaLower}.png`;
    
    return `
      <div class="bg-white rounded-3xl overflow-hidden shadow-sm">
        <div class="h-36 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-6">
          <img src="${flagPath}" alt="Provincia di ${p.nome}" class="max-h-28 max-w-full object-contain" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));" />
        </div>
        
        <div class="p-5">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-xl font-bold flex-1">Provincia di ${p.nome}</h3>
            <button onclick="CPI.toggleFavorite(&quot;${p.sigla}&quot;)" class="ml-2 w-10 h-10 flex items-center justify-center -mr-2">
              <svg class="w-5 h-5 ${isFav ? 'text-blue-600' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </button>
          </div>
          
          <div class="flex gap-2 mb-3">
            <span class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">${p.sigla}</span>
            <span class="text-xs text-gray-500">${p.sedi.length} sedi</span>
          </div>
          
          <p class="text-sm text-gray-600 mb-4">Centri Per Impiego della provincia di ${p.nome}</p>
          
          <div class="grid grid-cols-2 gap-2">
            <button onclick="CPI.openSedi(&quot;${p.sigla}&quot;)" class="py-3 bg-blue-600 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Sedi (${p.sedi.length})
            </button>
            
            <a href="https://www.venetolavoro.it/cpi" target="_blank" class="py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Servizi
            </a>
          </div>
          
          <a href="https://www.venetolavoro.it/" target="_blank" class="block mt-2 w-full py-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
            Veneto Lavoro
          </a>
        </div>
      </div>
    `;
  },
  
  openSedi(provinciaSigla) {
    const provincia = this.provinceData[Object.keys(this.provinceData).find(k => 
      this.provinceData[k].sigla === provinciaSigla
    )];
    
    if (!provincia) return;
    
    document.getElementById('cpiProvinciaName').textContent = 'Provincia di ' + provincia.nome;
    document.getElementById('cpiSediCount').textContent = provincia.sedi.length + ' sedi CPI';
    
    const htmlParts = [];
    provincia.sedi.forEach((s, idx) => {
      const sedeId = provinciaSigla + '-' + idx;
      const isFav = this.isSedeInFavorites(sedeId);
      htmlParts.push(this.renderSedeCard(s, sedeId, isFav, provincia.nome));
    });
    
    document.getElementById('cpiSediContent').innerHTML = htmlParts.join('');
    
    const sheet = document.getElementById('cpiSediSheet');
    sheet.classList.remove('hidden');
    setTimeout(() => sheet.querySelector('.bottom-sheet').classList.add('active'), 10);
  },
  
  renderSedeCard(s, sedeId, isFav, provinciaNome) {
    
    const telefono = s.telefono ? `<a href="tel:${s.telefono}" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>${s.telefono}</a>` : '';
    
    const email = s.email ? `<a href="mailto:${s.email}" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline break-all"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>${s.email}</a>` : '';
    
    const orari = s.orari ? `<div class="flex items-center gap-2 text-gray-600"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>${s.orari}</div>` : '';
    
    const mapsQuery = encodeURIComponent(s.indirizzo + ', ' + s.citta);
    
    return `
      <div class="bg-gray-50 rounded-2xl p-4 mb-4">
        <div class="flex items-start justify-between mb-2">
          <div class="font-bold">${s.nome}</div>
          <button onclick="CPI.toggleSedeFavorite(&quot;${sedeId}&quot;, &quot;${provinciaNome}&quot;, &quot;${s.citta}&quot;)" class="w-10 h-10 flex items-center justify-center -mr-2">
            <svg class="w-5 h-5 ${isFav ? 'text-blue-600' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
          </button>
        </div>
        <div class="text-sm text-gray-600 space-y-2">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
            <span>${s.indirizzo}, ${s.cap} ${s.citta} (${s.provincia_sigla})</span>
          </div>
          ${telefono}
          ${email}
          ${orari}
          <a href="https://www.google.com/maps/search/?api=1&query=${mapsQuery}" target="_blank" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold underline"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>Apri in Google Maps</a>
        </div>
      </div>
    `;
  },
  
  closeSedi() {
    const sheet = document.getElementById('cpiSediSheet');
    sheet.querySelector('.bottom-sheet').classList.remove('active');
    setTimeout(() => sheet.classList.add('hidden'), 300);
  },
  
  toggleFavorite(provinciaSigla) {
    const index = this.favorites.indexOf(provinciaSigla);
    if (index > -1) {
      // RIMOZIONE: elimina anche tutte le sedi
      this.favorites.splice(index, 1);
      
      // Rimuovi tutte le sedi che appartengono a questa provincia
      this.favoriteSedi = this.favoriteSedi.filter(sede => {
        const sedeProvinciaId = sede.id.split('-')[0];
        return sedeProvinciaId !== provinciaSigla;
      });
      this.saveFavoriteSedi();
    } else {
      // AGGIUNTA: aggiungi solo la provincia
      this.favorites.push(provinciaSigla);
    }
    this.saveFavorites();
    this.render();
  },
  
  isFavorite(provinciaSigla) {
    return this.favorites.includes(provinciaSigla);
  },
  
  toggleSedeFavorite(sedeId, provincia, city) {
    const fav = { id: sedeId, provincia: provincia, city: city };
    const index = this.favoriteSedi.findIndex(f => f.id === sedeId);
    
    if (index > -1) {
      this.favoriteSedi.splice(index, 1);
    } else {
      this.favoriteSedi.push(fav);
      
      // Auto-aggiungi provincia ai preferiti se non c'è già
      const provinciaSigla = sedeId.split('-')[0]; // "PD-0" -> "PD"
      if (!this.favorites.includes(provinciaSigla)) {
        this.favorites.push(provinciaSigla);
        this.saveFavorites();
      }
    }
    
    this.saveFavoriteSedi();
    this.openSedi(sedeId.split('-')[0]);
  },
  
  isSedeInFavorites(sedeId) {
    return this.favoriteSedi.some(f => f.id === sedeId);
  },
  
  loadFavorites() {
    const s = localStorage.getItem('cpi_favorites');
    this.favorites = s ? JSON.parse(s) : [];
  },
  
  saveFavorites() {
    localStorage.setItem('cpi_favorites', JSON.stringify(this.favorites));
  },
  
  loadFavoriteSedi() {
    const s = localStorage.getItem('cpi_sedi_favorites');
    this.favoriteSedi = s ? JSON.parse(s) : [];
  },
  
  saveFavoriteSedi() {
    localStorage.setItem('cpi_sedi_favorites', JSON.stringify(this.favoriteSedi));
  },
  
  showError(msg) {
    const grid = document.getElementById('cpiGrid');
    if (grid) grid.innerHTML = '<div class="text-center py-12"><p class="text-red-600">' + msg + '</p></div>';
  }
};
