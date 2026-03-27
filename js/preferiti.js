// JobApp - Preferiti Module
const Preferiti = {
  agenzie: [],
  cpi: [],
  enti: [],
  piattaforme: [],
  
  favoriteAgenzie: [],
  favoriteAgenzieIds: [],
  favoriteSediAgenzie: [],
  
  favoriteCPI: [],
  favoriteCPIIds: [],
  favoriteSediCPI: [],
  
  favoriteEnti: [],
  favoriteEntiIds: [],
  favoriteSediEnti: [],
  
  favoritePiattaforme: [],
  favoritePiattaformeIds: [],

  async init() {
    console.log('Preferiti init START');
    await this.loadData();
    console.log('Dati caricati:', {
      agenzie: this.agenzie.length,
      cpi: this.cpi.length,
      enti: this.enti.length,
      piattaforme: this.piattaforme.length
    });
    await this.loadFavorites();
    console.log('Preferiti caricati:', {
      agenzie: this.favoriteAgenzieIds,
      sediAgenzie: this.favoriteSediAgenzie,
      cpi: this.favoriteCPIIds,
      sediCPI: this.favoriteSediCPI,
      enti: this.favoriteEntiIds,
      piattaforme: this.favoritePiattaformeIds
    });
    this.render();
    console.log('Preferiti render COMPLETE');
  },

  async loadData() {
    try {
      const [agenzieRes, cpiRes, entiRes, piattaformeRes] = await Promise.all([
        fetch('data/agenzie.json'),
        fetch('data/cpi.json'),
        fetch('data/enti.json'),
        fetch('data/piattaforme.json')
      ]);
      
      this.agenzie = await agenzieRes.json();
      this.cpi = await cpiRes.json();
      this.enti = await entiRes.json();
      this.piattaforme = await piattaformeRes.json();
    } catch (error) {
      console.error('Errore caricamento dati:', error);
    }
  },

  async loadFavorites() {
    if (!window.FirebaseFavorites || !FirebaseFavorites.isReady) {
      if (window.FirebaseFavorites) await FirebaseFavorites.init();
    }
    if (window.FirebaseFavorites && FirebaseFavorites.isLoggedIn()) {
      const favorites = await FirebaseFavorites.getFavorites();
      if (favorites) {
        // Agenzie
        this.favoriteAgenzieIds = favorites.agenzie || [];
        this.favoriteAgenzie = this.agenzie.filter(a => this.favoriteAgenzieIds.includes(a.id));
        this.favoriteSediAgenzie = favorites.agenzie_sedi || [];
        
        // CPI
        this.favoriteCPIIds = favorites.cpi || [];
        const provinceUniche = [...new Set(this.cpi.map(c => c.provincia_sigla))];
        this.favoriteCPI = provinceUniche
          .filter(sigla => this.favoriteCPIIds.includes(sigla))
          .map(sigla => {
            const primo = this.cpi.find(c => c.provincia_sigla === sigla);
            return {
              sigla: sigla,
              nome: primo.provincia
            };
          });
        this.favoriteSediCPI = favorites.cpi_sedi || [];
        
        // Enti
        this.favoriteEntiIds = favorites.enti || [];
        this.favoriteEnti = this.enti.filter(e => this.favoriteEntiIds.includes(e.id));
        this.favoriteSediEnti = favorites.enti_sedi || [];
        
        // Piattaforme
        this.favoritePiattaformeIds = favorites.piattaforme || [];
        this.favoritePiattaforme = this.piattaforme.filter(p => this.favoritePiattaformeIds.includes(p.id));
      }
    } else {
      // Non loggato
      this.favoriteAgenzieIds = [];
      this.favoriteAgenzie = [];
      this.favoriteSediAgenzie = [];
      this.favoriteCPIIds = [];
      this.favoriteCPI = [];
      this.favoriteSediCPI = [];
      this.favoriteEntiIds = [];
      this.favoriteEnti = [];
      this.favoriteSediEnti = [];
      this.favoritePiattaformeIds = [];
      this.favoritePiattaforme = [];
    }
  },

  render() {
    const container = document.getElementById('preferiti-container');
    
    const totale = this.favoriteAgenzie.length + this.favoriteSediAgenzie.length +
                   this.favoriteCPI.length + this.favoriteSediCPI.length +
                   this.favoriteEnti.length + this.favoriteSediEnti.length +
                   this.favoritePiattaforme.length;
    
    if (totale === 0) {
      container.innerHTML = this.renderEmpty();
      return;
    }
    
    let html = '<div class="space-y-6">';
    
    if (this.favoriteAgenzie.length > 0 || this.favoriteSediAgenzie.length > 0) {
      html += this.renderCategoriaAgenzie();
    }
    
    if (this.favoriteCPI.length > 0 || this.favoriteSediCPI.length > 0) {
      html += this.renderCategoriaCPI();
    }
    
    if (this.favoriteEnti.length > 0 || this.favoriteSediEnti.length > 0) {
      html += this.renderCategoriaEnti();
    }
    
    if (this.favoritePiattaforme.length > 0) {
      html += this.renderCategoriaPiattaforme();
    }
    
    html += '</div>';
    container.innerHTML = html;
  },

  renderEmpty() {
    return `
      <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
        <svg class="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
        <h3 class="text-xl font-bold text-gray-700 mb-2">Nessun Preferito</h3>
        <p class="text-gray-500 max-w-sm">
          Aggiungi i tuoi preferiti toccando la stella sulle schede di agenzie, CPI, enti e piattaforme
        </p>
      </div>
    `;
  },

  renderCategoriaAgenzie() {
    const totale = this.favoriteAgenzie.length + this.favoriteSediAgenzie.length;
    
    const sediPerAgenzia = {};
    this.favoriteSediAgenzie.forEach(sede => {
      const agencyId = sede.id.split('-').slice(0, 2).join('-');
      if (!sediPerAgenzia[agencyId]) sediPerAgenzia[agencyId] = [];
      sediPerAgenzia[agencyId].push(sede);
    });
    
    const agenzieOrfane = new Set();
    Object.keys(sediPerAgenzia).forEach(agencyId => {
      if (!this.favoriteAgenzieIds.includes(agencyId)) {
        agenzieOrfane.add(agencyId);
      }
    });
    
    let html = `
      <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-3xl">💼</div>
              <div>
                <h2 class="text-xl font-bold text-white">Agenzie per il Lavoro</h2>
                <p class="text-indigo-100 text-sm">${totale} preferit${totale === 1 ? 'o' : 'i'}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 space-y-3">
    `;
    
    this.favoriteAgenzie.forEach(a => {
      const sediDiQuestaAgenzia = sediPerAgenzia[a.id] || [];
      
      html += `
        <div class="bg-gray-50 rounded-2xl p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-bold flex-1">${a.nome}</h3>
            <button onclick="Preferiti.rimuoviAgenzia('${a.id}')" class="w-10 h-10 flex items-center justify-center -mr-2">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600 mb-3">${a.descrizione}</p>
      `;
      
      if (sediDiQuestaAgenzia.length > 0) {
        html += `
          <div class="mt-3 pl-3 border-l-2 border-indigo-200 space-y-2">
            <p class="text-xs font-semibold text-gray-600 mb-3">📍 Sedi Preferite (${sediDiQuestaAgenzia.length})</p>
        `;
        
        sediDiQuestaAgenzia.forEach(sede => {
          const sedeCompleta = this.trovaSedeAgenzia(a, sede.id);
          if (sedeCompleta) {
            html += this.renderSedeAgenziaCard(sedeCompleta, sede.id, a.nome);
          }
        });
        
        html += '</div>';
      }
      
      html += '</div>';
    });
    
    agenzieOrfane.forEach(agencyId => {
      const agenzia = this.agenzie.find(a => a.id === agencyId);
      if (!agenzia) return;
      
      const sediDiQuestaAgenzia = sediPerAgenzia[agencyId];
      
      html += `
        <div class="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-indigo-300">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-700">${agenzia.nome}</h3>
              <p class="text-xs text-gray-500">Solo sedi salvate</p>
            </div>
          </div>
          
          <div class="mt-3 pl-3 border-l-2 border-indigo-200 space-y-2">
            <p class="text-xs font-semibold text-gray-600 mb-3">📍 Sedi (${sediDiQuestaAgenzia.length})</p>
      `;
      
      sediDiQuestaAgenzia.forEach(sede => {
        const sedeCompleta = this.trovaSedeAgenzia(agenzia, sede.id);
        if (sedeCompleta) {
          html += this.renderSedeAgenziaCard(sedeCompleta, sede.id, agenzia.nome);
        }
      });
      
      html += '</div></div>';
    });
    
    html += '</div></div>';
    return html;
  },

  trovaSedeAgenzia(agenzia, sedeId) {
    const idx = parseInt(sedeId.split('-')[2]);
    return agenzia.sedi[idx];
  },

  renderSedeAgenziaCard(s, sedeId, agencyName) {
    return `
      <div class="bg-white rounded-xl p-3 mb-2 border border-gray-200">
        <div class="flex items-start justify-between mb-2">
          <div class="font-bold text-sm">${s.citta}</div>
          <button onclick="Preferiti.rimuoviSedeAgenzia('${sedeId}')" class="w-8 h-8 flex items-center justify-center">
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
        <div class="text-xs text-gray-600 space-y-1">
          <div class="flex items-start gap-2">
            <svg class="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
            <span>${s.indirizzo}</span>
          </div>
          ${s.telefono ? `<div class="flex items-center gap-2"><svg class="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg><a href="tel:${s.telefono}" class="text-indigo-600">${s.telefono}</a></div>` : ''}
          ${s.email ? `<div class="flex items-center gap-2"><svg class="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg><a href="mailto:${s.email}" class="text-indigo-600 break-all">${s.email}</a></div>` : ''}
          ${s.googleMaps ? `<div class="mt-2"><a href="${s.googleMaps}" target="_blank" class="inline-flex items-center gap-1 text-indigo-600 font-semibold text-xs"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>Mappa</a></div>` : ''}
        </div>
      </div>
    `;
  },

  renderCategoriaCPI() {
    const totale = this.favoriteCPI.length + this.favoriteSediCPI.length;
    
    const sediPerProvincia = {};
    this.favoriteSediCPI.forEach(sede => {
      const provinciaId = sede.id.split('-')[0];
      if (!sediPerProvincia[provinciaId]) sediPerProvincia[provinciaId] = [];
      sediPerProvincia[provinciaId].push(sede);
    });
    
    const provinceOrfane = new Set();
    Object.keys(sediPerProvincia).forEach(provinciaId => {
      if (!this.favoriteCPIIds.includes(provinciaId)) {
        provinceOrfane.add(provinciaId);
      }
    });
    
    let html = `
      <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-3xl">🏢</div>
              <div>
                <h2 class="text-xl font-bold text-white">Centri Per l'Impiego</h2>
                <p class="text-blue-100 text-sm">${totale} preferit${totale === 1 ? 'o' : 'i'}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 space-y-3">
    `;
    
    this.favoriteCPI.forEach(prov => {
      const sediDiQuestaProvincia = sediPerProvincia[prov.sigla] || [];
      
      html += `
        <div class="bg-gray-50 rounded-2xl p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-bold flex-1">Provincia di ${prov.nome}</h3>
            <button onclick="Preferiti.rimuoviCPI('${prov.sigla}')" class="w-10 h-10 flex items-center justify-center -mr-2">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
      `;
      
      if (sediDiQuestaProvincia.length > 0) {
        html += `
          <div class="mt-3 pl-3 border-l-2 border-blue-200 space-y-2">
            <p class="text-xs font-semibold text-gray-600 mb-3">📍 Sedi Preferite (${sediDiQuestaProvincia.length})</p>
        `;
        
        sediDiQuestaProvincia.forEach(sede => {
          const sedeCompleta = this.trovaSedeCPI(prov.sigla, sede.id);
          if (sedeCompleta) {
            html += this.renderSedeCPICard(sedeCompleta, sede.id);
          }
        });
        
        html += '</div>';
      }
      
      html += '</div>';
    });
    
    provinceOrfane.forEach(provinciaId => {
      const primo = this.cpi.find(c => c.provincia_sigla === provinciaId);
      if (!primo) return;
      
      const sediDiQuestaProvincia = sediPerProvincia[provinciaId];
      
      html += `
        <div class="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-blue-300">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-700">Provincia di ${primo.provincia}</h3>
              <p class="text-xs text-gray-500">Solo sedi salvate</p>
            </div>
          </div>
          
          <div class="mt-3 pl-3 border-l-2 border-blue-200 space-y-2">
            <p class="text-xs font-semibold text-gray-600 mb-3">📍 Sedi (${sediDiQuestaProvincia.length})</p>
      `;
      
      sediDiQuestaProvincia.forEach(sede => {
        const sedeCompleta = this.trovaSedeCPI(provinciaId, sede.id);
        if (sedeCompleta) {
          html += this.renderSedeCPICard(sedeCompleta, sede.id);
        }
      });
      
      html += '</div></div>';
    });
    
    html += '</div></div>';
    return html;
  },

  trovaSedeCPI(provinciaSigla, sedeId) {
    const idx = parseInt(sedeId.split('-')[1]);
    const sediProvincia = this.cpi.filter(c => c.provincia_sigla === provinciaSigla);
    return sediProvincia[idx];
  },

  renderSedeCPICard(s, sedeId) {
    const mapsQuery = encodeURIComponent(`${s.indirizzo}, ${s.cap} ${s.citta}`);
    
    return `
      <div class="bg-white rounded-xl p-3 mb-2 border border-gray-200">
        <div class="flex items-start justify-between mb-2">
          <div class="font-bold text-sm">${s.nome}</div>
          <button onclick="Preferiti.rimuoviSedeCPI('${sedeId}')" class="w-8 h-8 flex items-center justify-center">
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
        <div class="text-xs text-gray-600 space-y-1">
          <div class="flex items-start gap-2">
            <svg class="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
            <span>${s.indirizzo}, ${s.cap} ${s.citta}</span>
          </div>
          ${s.telefono ? `<div class="flex items-center gap-2"><svg class="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg><a href="tel:${s.telefono}" class="text-blue-600">${s.telefono}</a></div>` : ''}
          ${s.email ? `<div class="flex items-center gap-2"><svg class="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg><a href="mailto:${s.email}" class="text-blue-600 break-all">${s.email}</a></div>` : ''}
          ${s.orari ? `<div class="flex items-center gap-2 text-gray-600"><svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>${s.orari}</div>` : ''}
          <div class="mt-2">
            <a href="https://www.google.com/maps/search/?api=1&query=${mapsQuery}" target="_blank" class="inline-flex items-center gap-1 text-blue-600 font-semibold text-xs">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              Mappa
            </a>
          </div>
        </div>
      </div>
    `;
  },

  renderCategoriaEnti() {
    const totale = this.favoriteEnti.length + this.favoriteSediEnti.length;
    
    const sediPerEnte = {};
    this.favoriteSediEnti.forEach(sede => {
      const enteId = sede.id.split('-').slice(0, 2).join('-');
      if (!sediPerEnte[enteId]) sediPerEnte[enteId] = [];
      sediPerEnte[enteId].push(sede);
    });
    
    const entiOrfani = new Set();
    Object.keys(sediPerEnte).forEach(enteId => {
      if (!this.favoriteEntiIds.includes(enteId)) {
        entiOrfani.add(enteId);
      }
    });
    
    let html = `
      <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-3xl">🎓</div>
              <div>
                <h2 class="text-xl font-bold text-white">Enti di Formazione</h2>
                <p class="text-purple-100 text-sm">${totale} preferit${totale === 1 ? 'o' : 'i'}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 space-y-3">
    `;
    
    this.favoriteEnti.forEach(e => {
      const sediDiQuestoEnte = sediPerEnte[e.id] || [];
      
      html += `
        <div class="bg-gray-50 rounded-2xl p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-bold flex-1">${e.nome}</h3>
            <button onclick="Preferiti.rimuoviEnte(${e.id})" class="w-10 h-10 flex items-center justify-center -mr-2">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600 mb-3">${e.descrizione}</p>
      `;
      
      if (sediDiQuestoEnte.length > 0) {
        html += `
          <div class="mt-3 pl-3 border-l-2 border-purple-200 space-y-2">
            <p class="text-xs font-semibold text-gray-600 mb-3">📍 Sedi Preferite (${sediDiQuestoEnte.length})</p>
        `;
        
        sediDiQuestoEnte.forEach(sede => {
          const sedeCompleta = this.trovaSedeEnte(e, sede.id);
          if (sedeCompleta) {
            html += this.renderSedeEnteCard(sedeCompleta, sede.id, e.nome);
          }
        });
        
        html += '</div>';
      }
      
      html += '</div>';
    });
    
    entiOrfani.forEach(enteId => {
      const ente = this.enti.find(e => e.id === enteId);
      if (!ente) return;
      
      const sediDiQuestoEnte = sediPerEnte[enteId];
      
      html += `
        <div class="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-purple-300">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-700">${ente.nome}</h3>
              <p class="text-xs text-gray-500">Solo sedi salvate</p>
            </div>
          </div>
          
          <div class="mt-3 pl-3 border-l-2 border-purple-200 space-y-2">
            <p class="text-xs font-semibold text-gray-600 mb-3">📍 Sedi (${sediDiQuestoEnte.length})</p>
      `;
      
      sediDiQuestoEnte.forEach(sede => {
        const sedeCompleta = this.trovaSedeEnte(ente, sede.id);
        if (sedeCompleta) {
          html += this.renderSedeEnteCard(sedeCompleta, sede.id, ente.nome);
        }
      });
      
      html += '</div></div>';
    });
    
    html += '</div></div>';
    return html;
  },

  trovaSedeEnte(ente, sedeId) {
    if (!ente.sedi || !Array.isArray(ente.sedi)) return null;
    const idx = parseInt(sedeId.split('-')[2]);
    return ente.sedi[idx];
  },

  renderSedeEnteCard(s, sedeId, enteNome) {
    return `
      <div class="bg-white rounded-xl p-3 mb-2 border border-gray-200">
        <div class="flex items-start justify-between mb-2">
          <div class="font-bold text-sm">${s.citta || s.nome}</div>
          <button onclick="Preferiti.rimuoviSedeEnte('${sedeId}')" class="w-8 h-8 flex items-center justify-center">
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
        <div class="text-xs text-gray-600 space-y-1">
          ${s.indirizzo ? `<div class="flex items-start gap-2"><svg class="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg><span>${s.indirizzo}</span></div>` : ''}
          ${s.telefono ? `<div class="flex items-center gap-2"><svg class="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg><a href="tel:${s.telefono}" class="text-purple-600">${s.telefono}</a></div>` : ''}
          ${s.email ? `<div class="flex items-center gap-2"><svg class="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg><a href="mailto:${s.email}" class="text-purple-600 break-all">${s.email}</a></div>` : ''}
          ${s.googleMaps ? `<div class="mt-2"><a href="${s.googleMaps}" target="_blank" class="inline-flex items-center gap-1 text-purple-600 font-semibold text-xs"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>Mappa</a></div>` : ''}
        </div>
      </div>
    `;
  },

  renderCategoriaPiattaforme() {
    let html = `
      <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-3xl">📢</div>
              <div>
                <h2 class="text-xl font-bold text-white">Piattaforme Annunci</h2>
                <p class="text-orange-100 text-sm">${this.favoritePiattaforme.length} preferit${this.favoritePiattaforme.length === 1 ? 'a' : 'e'}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 space-y-3">
    `;
    
    this.favoritePiattaforme.forEach(p => {
      html += `
        <div class="bg-gray-50 rounded-2xl p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-bold flex-1">${p.nome}</h3>
            <button onclick="Preferiti.rimuoviPiattaforma('${p.id}')" class="w-10 h-10 flex items-center justify-center -mr-2">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600">${p.descrizione}</p>
        </div>
      `;
    });
    
    html += '</div></div>';
    return html;
  },

  async rimuoviAgenzia(id) {
    if (!window.FirebaseFavorites) return;
    
    // AGGIORNAMENTO LOCALE IMMEDIATO
    const index = this.favoriteAgenzieIds.indexOf(id);
    if (index > -1) {
      this.favoriteAgenzieIds.splice(index, 1);
    }
    this.favoriteAgenzie = this.agenzie.filter(a => this.favoriteAgenzieIds.includes(a.id));
    
    // Firebase in background
    FirebaseFavorites.removeAgency(id);
    
    // Render immediato
    this.render();
  },

  async rimuoviSedeAgenzia(sedeId) {
    if (!window.FirebaseFavorites) return;
    
    // AGGIORNAMENTO LOCALE IMMEDIATO
    const index = this.favoriteSediAgenzie.findIndex(s => s.id === sedeId);
    if (index > -1) {
      this.favoriteSediAgenzie.splice(index, 1);
    }
    
    // Firebase in background
    FirebaseFavorites.removeAgencySede(sedeId);
    
    // Render immediato
    this.render();
  },

  async rimuoviCPI(sigla) {
    if (!window.FirebaseFavorites) return;
    
    // AGGIORNAMENTO LOCALE IMMEDIATO
    const index = this.favoriteCPIIds.indexOf(sigla);
    if (index > -1) {
      this.favoriteCPIIds.splice(index, 1);
    }
    const provinceUniche = [...new Set(this.cpi.map(c => c.provincia_sigla))];
    this.favoriteCPI = provinceUniche
      .filter(s => this.favoriteCPIIds.includes(s))
      .map(s => {
        const primo = this.cpi.find(c => c.provincia_sigla === s);
        return {
          sigla: s,
          nome: primo.provincia
        };
      });
    
    // Firebase in background
    FirebaseFavorites.removeCPI(sigla);
    
    // Render immediato
    this.render();
  },

  async rimuoviSedeCPI(sedeId) {
    if (!window.FirebaseFavorites) return;
    
    // AGGIORNAMENTO LOCALE IMMEDIATO
    const index = this.favoriteSediCPI.findIndex(s => s.id === sedeId);
    if (index > -1) {
      this.favoriteSediCPI.splice(index, 1);
    }
    
    // Firebase in background
    FirebaseFavorites.removeCPISede(sedeId);
    
    // Render immediato
    this.render();
  },

  async rimuoviEnte(id) {
    if (!window.FirebaseFavorites) return;
    
    // Converti a stringa per sicurezza
    id = String(id);
    
    // AGGIORNAMENTO LOCALE IMMEDIATO
    const index = this.favoriteEntiIds.indexOf(id);
    if (index > -1) {
      this.favoriteEntiIds.splice(index, 1);
    }
    this.favoriteEnti = this.enti.filter(e => this.favoriteEntiIds.includes(e.id));
    
    // Firebase in background
    FirebaseFavorites.removeEnte(id);
    
    // Render immediato
    this.render();
  },
  
  async rimuoviSedeEnte(sedeId) {
    if (!window.FirebaseFavorites) return;
    
    // AGGIORNAMENTO LOCALE IMMEDIATO
    const index = this.favoriteSediEnti.findIndex(s => s.id === sedeId);
    if (index > -1) {
      this.favoriteSediEnti.splice(index, 1);
    }
    
    // Firebase in background
    FirebaseFavorites.removeEnteSede(sedeId);
    
    // Render immediato
    this.render();
  },

  async rimuoviPiattaforma(id) {
    if (!window.FirebaseFavorites) return;
    
    // AGGIORNAMENTO LOCALE IMMEDIATO
    const index = this.favoritePiattaformeIds.indexOf(id);
    if (index > -1) {
      this.favoritePiattaformeIds.splice(index, 1);
    }
    this.favoritePiattaforme = this.piattaforme.filter(p => this.favoritePiattaformeIds.includes(p.id));
    
    // Firebase in background
    FirebaseFavorites.removePiattaforma(id);
    
    // Render immediato
    this.render();
  }
};
