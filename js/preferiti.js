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
  
  favoritePiattaforme: [],
  favoritePiattaformeIds: [],

  async init() {
    console.log('Preferiti init');
    await this.loadData();
    this.loadFavorites();
    this.render();
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

  loadFavorites() {
    // Agenzie
    const agenzieIds = localStorage.getItem('agenzie_favorites');
    this.favoriteAgenzieIds = agenzieIds ? JSON.parse(agenzieIds) : [];
    this.favoriteAgenzie = this.agenzie.filter(a => this.favoriteAgenzieIds.includes(a.id));
    
    const sediAgenzie = localStorage.getItem('agenzie_sedi_favorites');
    this.favoriteSediAgenzie = sediAgenzie ? JSON.parse(sediAgenzie) : [];
    
    // CPI - Usa provincia_sigla
    const cpiIds = localStorage.getItem('cpi_favorites');
    this.favoriteCPIIds = cpiIds ? JSON.parse(cpiIds) : [];
    
    // Raggruppa CPI per provincia_sigla
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
    
    const sediCPI = localStorage.getItem('cpi_sedi_favorites');
    this.favoriteSediCPI = sediCPI ? JSON.parse(sediCPI) : [];
    
    // Enti
    const entiIds = localStorage.getItem('enti_favorites');
    this.favoriteEntiIds = entiIds ? JSON.parse(entiIds) : [];
    this.favoriteEnti = this.enti.filter(e => this.favoriteEntiIds.includes(e.id));
    
    // Piattaforme
    const piattIds = localStorage.getItem('piattaforme_favorites');
    this.favoritePiattaformeIds = piattIds ? JSON.parse(piattIds) : [];
    this.favoritePiattaforme = this.piattaforme.filter(p => this.favoritePiattaformeIds.includes(p.id));
  },

  render() {
    const container = document.getElementById('preferiti-container');
    
    const totale = this.favoriteAgenzie.length + this.favoriteSediAgenzie.length +
                   this.favoriteCPI.length + this.favoriteSediCPI.length +
                   this.favoriteEnti.length + this.favoritePiattaforme.length;
    
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
    
    if (this.favoriteEnti.length > 0) {
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
    
    // Raggruppa sedi per agenzia
    const sediPerAgenzia = {};
    this.favoriteSediAgenzie.forEach(sede => {
      const agencyId = sede.id.split('-').slice(0, 2).join('-'); // "ag-1-0" -> "ag-1"
      if (!sediPerAgenzia[agencyId]) sediPerAgenzia[agencyId] = [];
      sediPerAgenzia[agencyId].push(sede);
    });
    
    // Trova agenzie "orfane" (sedi salvate ma agenzia non nei preferiti)
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
    
    // Agenzie principali (con le loro sedi)
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
      
      // Sedi di questa agenzia
      if (sediDiQuestaAgenzia.length > 0) {
        html += `
          <div class="mt-3 pl-3 border-l-2 border-indigo-200 space-y-2">
            <p class="text-xs font-semibold text-gray-600">📍 Sedi (${sediDiQuestaAgenzia.length})</p>
        `;
        sediDiQuestaAgenzia.forEach(sede => {
          html += `
            <div class="bg-white rounded-lg p-2 flex items-center justify-between text-sm">
              <span class="text-gray-700">${sede.city}</span>
              <button onclick="Preferiti.rimuoviSedeAgenzia('${sede.id}')" class="w-7 h-7 flex items-center justify-center">
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          `;
        });
        html += '</div>';
      }
      
      html += `
          <div class="flex gap-2 mt-3">
            <button onclick="Navigation.loadPage('agenzie')" class="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
              Vedi Dettagli
            </button>
          </div>
        </div>
      `;
    });
    
    // Agenzie orfane (solo sedi salvate, senza agenzia)
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
            <p class="text-xs font-semibold text-gray-600">📍 Sedi (${sediDiQuestaAgenzia.length})</p>
      `;
      
      sediDiQuestaAgenzia.forEach(sede => {
        html += `
          <div class="bg-white rounded-lg p-2 flex items-center justify-between text-sm">
            <span class="text-gray-700">${sede.city}</span>
            <button onclick="Preferiti.rimuoviSedeAgenzia('${sede.id}')" class="w-7 h-7 flex items-center justify-center">
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    });
    
    html += '</div></div>';
    return html;
  },

  renderCategoriaCPI() {
    const totale = this.favoriteCPI.length + this.favoriteSediCPI.length;
    
    // Raggruppa sedi per provincia
    const sediPerProvincia = {};
    this.favoriteSediCPI.forEach(sede => {
      const provinciaId = sede.id.split('-')[0]; // "PD-0" -> "PD"
      if (!sediPerProvincia[provinciaId]) sediPerProvincia[provinciaId] = [];
      sediPerProvincia[provinciaId].push(sede);
    });
    
    // Trova province "orfane"
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
    
    // Province CPI (con le loro sedi)
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
      
      // Sedi di questa provincia
      if (sediDiQuestaProvincia.length > 0) {
        html += `
          <div class="mt-3 pl-3 border-l-2 border-blue-200 space-y-2">
            <p class="text-xs font-semibold text-gray-600">📍 Sedi (${sediDiQuestaProvincia.length})</p>
        `;
        sediDiQuestaProvincia.forEach(sede => {
          html += `
            <div class="bg-white rounded-lg p-2 flex items-center justify-between text-sm">
              <span class="text-gray-700">${sede.city}</span>
              <button onclick="Preferiti.rimuoviSedeCPI('${sede.id}')" class="w-7 h-7 flex items-center justify-center">
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          `;
        });
        html += '</div>';
      }
      
      html += `
          <div class="flex gap-2 mt-3">
            <button onclick="Navigation.loadPage('cpi')" class="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
              Vedi Dettagli
            </button>
          </div>
        </div>
      `;
    });
    
    // Province orfane
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
            <p class="text-xs font-semibold text-gray-600">📍 Sedi (${sediDiQuestaProvincia.length})</p>
      `;
      
      sediDiQuestaProvincia.forEach(sede => {
        html += `
          <div class="bg-white rounded-lg p-2 flex items-center justify-between text-sm">
            <span class="text-gray-700">${sede.city}</span>
            <button onclick="Preferiti.rimuoviSedeCPI('${sede.id}')" class="w-7 h-7 flex items-center justify-center">
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    });
    
    html += '</div></div>';
    return html;
  },

  renderCategoriaEnti() {
    let html = `
      <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-3xl">🎓</div>
              <div>
                <h2 class="text-xl font-bold text-white">Enti di Formazione</h2>
                <p class="text-purple-100 text-sm">${this.favoriteEnti.length} preferit${this.favoriteEnti.length === 1 ? 'o' : 'i'}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 space-y-3">
    `;
    
    this.favoriteEnti.forEach(e => {
      html += `
        <div class="bg-gray-50 rounded-2xl p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-bold flex-1">${e.nome}</h3>
            <button onclick="Preferiti.rimuoviEnte('${e.id}')" class="w-10 h-10 flex items-center justify-center -mr-2">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600 mb-3">${e.descrizione}</p>
          <div class="flex gap-2">
            <button onclick="Navigation.loadPage('enti')" class="flex-1 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold">
              Vedi Dettagli
            </button>
          </div>
        </div>
      `;
    });
    
    html += '</div></div>';
    return html;
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
          <p class="text-sm text-gray-600 mb-3">${p.descrizione}</p>
          <div class="flex gap-2">
            <button onclick="Navigation.loadPage('piattaforme')" class="flex-1 py-2 bg-orange-600 text-white rounded-xl text-sm font-semibold">
              Vedi Dettagli
            </button>
          </div>
        </div>
      `;
    });
    
    html += '</div></div>';
    return html;
  },

  // Funzioni rimozione
  rimuoviAgenzia(id) {
    const index = this.favoriteAgenzieIds.indexOf(id);
    if (index > -1) {
      this.favoriteAgenzieIds.splice(index, 1);
      localStorage.setItem('agenzie_favorites', JSON.stringify(this.favoriteAgenzieIds));
      this.init();
    }
  },

  rimuoviSedeAgenzia(sedeId) {
    const index = this.favoriteSediAgenzie.findIndex(s => s.id === sedeId);
    if (index > -1) {
      this.favoriteSediAgenzie.splice(index, 1);
      localStorage.setItem('agenzie_sedi_favorites', JSON.stringify(this.favoriteSediAgenzie));
      this.init();
    }
  },

  rimuoviCPI(sigla) {
    const index = this.favoriteCPIIds.indexOf(sigla);
    if (index > -1) {
      this.favoriteCPIIds.splice(index, 1);
      localStorage.setItem('cpi_favorites', JSON.stringify(this.favoriteCPIIds));
      this.init();
    }
  },

  rimuoviSedeCPI(sedeId) {
    const index = this.favoriteSediCPI.findIndex(s => s.id === sedeId);
    if (index > -1) {
      this.favoriteSediCPI.splice(index, 1);
      localStorage.setItem('cpi_sedi_favorites', JSON.stringify(this.favoriteSediCPI));
      this.init();
    }
  },

  rimuoviEnte(id) {
    const index = this.favoriteEntiIds.indexOf(id);
    if (index > -1) {
      this.favoriteEntiIds.splice(index, 1);
      localStorage.setItem('enti_favorites', JSON.stringify(this.favoriteEntiIds));
      this.init();
    }
  },

  rimuoviPiattaforma(id) {
    const index = this.favoritePiattaformeIds.indexOf(id);
    if (index > -1) {
      this.favoritePiattaformeIds.splice(index, 1);
      localStorage.setItem('piattaforme_favorites', JSON.stringify(this.favoritePiattaformeIds));
      this.init();
    }
  }
};
