// JobApp - Enti di Formazione Module
const Enti = {
  allEnti: [],
  favorites: [],
  favoriteSedi: [], // Supporto future sedi multiple
  filteredEnti: [],
  
  init() {
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
      this.loadFavorites();
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
        this.filteredEnti = this.allEnti.filter(ente => {
          // Cerca nel nome ente
          if (ente.nome.toLowerCase().includes(q)) return true;
          
          // Cerca nelle sedi
          if (ente.sedi) {
            return ente.sedi.some(s => {
              const citta = s.citta?.toLowerCase() || '';
              const nome = s.nome?.toLowerCase() || '';
              return citta.includes(q) || nome.includes(q);
            });
          }
          
          return false;
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
      const totalEnti = this.filteredEnti.length;
      const totalSedi = this.filteredEnti.reduce((sum, ente) => sum + (ente.sedi?.length || 0), 0);
      
      stats.innerHTML = `
        <div class="bg-purple-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">${totalEnti}</div><div class="text-xs">Enti</div></div>
        <div class="bg-pink-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">${totalSedi}</div><div class="text-xs">Sedi</div></div>
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
    // Prende email dalla prima sede se disponibile
    const primaSedeEmail = e.sedi?.[0]?.email || null;
    
    return `
      <div class="bg-white rounded-3xl overflow-hidden shadow-sm">
        <div class="h-36 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
          <div class="text-6xl">🎓</div>
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
          
          <div class="text-sm text-gray-600 mb-3">
            <span class="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">${e.provincia}</span>
            ${e.sedi?.length > 1 ? `<span class="ml-2 text-xs">${e.sedi.length} sedi</span>` : ''}
          </div>
          
          <div class="grid grid-cols-2 gap-2">
            ${e.sedi?.length ? `
              <button onclick="Enti.openSedi('${e.id}')" class="py-3 bg-purple-600 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Sedi (${e.sedi.length})
              </button>
            ` : '<div></div>'}
            
            ${primaSedeEmail ? `
              <a href="mailto:${primaSedeEmail}" class="py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Email
              </a>
            ` : '<div></div>'}
          </div>
          
          ${e.sito ? `
            <a href="${e.sito}" target="_blank" class="block mt-2 w-full py-3 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
              Sito Web
            </a>
          ` : ''}
        </div>
      </div>
    `;
  },
  
  toggleFavorite(enteId) {
    const index = this.favorites.indexOf(enteId);
    if (index > -1) {
      // RIMOZIONE: elimina anche tutte le sedi
      this.favorites.splice(index, 1);
      
      // Rimuovi tutte le sedi che appartengono a questo ente
      this.favoriteSedi = this.favoriteSedi.filter(sede => {
        const sedeEnteId = sede.id.split('-').slice(0, 2).join('-');
        return sedeEnteId !== enteId;
      });
      this.saveFavoriteSedi();
    } else {
      // AGGIUNTA: aggiungi solo l'ente
      this.favorites.push(enteId);
    }
    this.saveFavorites();
    this.render();
  },
  
  isFavorite(enteId) {
    return this.favorites.includes(enteId);
  },
  
  loadFavorites() {
    const s = localStorage.getItem('enti_favorites');
    this.favorites = s ? JSON.parse(s) : [];
    
    const sedi = localStorage.getItem('enti_sedi_favorites');
    this.favoriteSedi = sedi ? JSON.parse(sedi) : [];
  },
  
  saveFavorites() {
    localStorage.setItem('enti_favorites', JSON.stringify(this.favorites));
  },
  
  saveFavoriteSedi() {
    localStorage.setItem('enti_sedi_favorites', JSON.stringify(this.favoriteSedi));
  },
  
  // Funzioni per future sedi multiple
  toggleSedeFavorite(sedeId, enteNome, city) {
    const fav = { id: sedeId, ente: enteNome, city: city };
    const index = this.favoriteSedi.findIndex(f => f.id === sedeId);
    
    if (index > -1) {
      this.favoriteSedi.splice(index, 1);
    } else {
      this.favoriteSedi.push(fav);
      
      // Auto-aggiungi ente ai preferiti se non c'è già
      const enteId = sedeId.split('-')[0];
      if (!this.favorites.includes(enteId)) {
        this.favorites.push(enteId);
        this.saveFavorites();
      }
    }
    
    this.saveFavoriteSedi();
    
    // Aggiorna sheet se aperta
    const enteId = sedeId.split('-')[0];
    const sheet = document.getElementById('sediEnteSheet');
    if (sheet && !sheet.classList.contains('hidden')) {
      this.openSedi(enteId);
    }
  },
  
  isSedeInFavorites(sedeId) {
    return this.favoriteSedi.some(f => f.id === sedeId);
  },

  getProvincia(sede) {
    // Prende la provincia dalle informazioni della sede
    // Assumendo che esista un campo provincia o che sia nella citta/indirizzo
    if (sede.provincia) return sede.provincia;
    if (sede.citta) {
      // Estrae la sigla provincia dall'indirizzo se presente
      const addr = sede.indirizzo || '';
      const match = addr.match(/\b(BL|PD|RO|TV|VE|VR|VI)\b/i);
      return match ? match[0].toUpperCase() : 'ALTRE';
    }
    return 'ALTRE';
  },

  getProvinciaName(sigla) {
    const nomi = {
      'BL': 'Belluno', 'PD': 'Padova', 'RO': 'Rovigo', 'TV': 'Treviso',
      'VE': 'Venezia', 'VR': 'Verona', 'VI': 'Vicenza'
    };
    return nomi[sigla] || 'Altre Province';
  },

  openSedi(id) {
    const ente = this.allEnti.find(e => e.id === id);
    if (!ente || !ente.sedi) return;
    
    document.getElementById('sediEnteName').textContent = ente.nome;
    document.getElementById('sediEnteCount').textContent = `${ente.sedi.length} sed${ente.sedi.length === 1 ? 'e' : 'i'} in Veneto`;
    
    const perProv = {};
    ente.sedi.forEach((s, globalIdx) => {
      const prov = this.getProvincia(s);
      if (!perProv[prov]) perProv[prov] = [];
      perProv[prov].push({ ...s, globalIdx });
    });
    
    const provOrdinate = Object.keys(perProv).sort();
    
    let html = '';
    provOrdinate.forEach(prov => {
      const sedi = perProv[prov];
      html += `<div class="text-sm font-bold text-purple-600 uppercase tracking-wide mb-4 mt-6 first:mt-0">Provincia di ${this.getProvinciaName(prov)} (${sedi.length})</div>`;
      
      sedi.forEach(s => {
        const sedeId = `${id}-${s.globalIdx}`;
        const isFav = this.isSedeInFavorites(sedeId);
        
        // Mostra accreditamenti
        const accr = s.accreditamenti || {};
        const accreditamentiHTML = (accr.OF || accr.FS || accr.FC || accr.OR) ? `
          <div class="mt-3 pt-3 border-t border-gray-200">
            <div class="text-xs font-bold text-gray-700 mb-2">Accreditato per:</div>
            <div class="flex flex-wrap gap-1">
              ${accr.OF ? '<span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">✓ OF</span>' : ''}
              ${accr.FS ? '<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">✓ FS</span>' : ''}
              ${accr.FC ? '<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">✓ FC</span>' : ''}
              ${accr.OR ? '<span class="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">✓ OR</span>' : ''}
            </div>
          </div>
        ` : '';
        
        html += `
          <div class="bg-gray-50 rounded-2xl p-4 mb-4">
            <div class="flex items-start justify-between mb-2">
              <div class="font-bold">${s.nome || s.citta}</div>
              <button onclick="Enti.toggleSedeFavorite('${sedeId}', '${ente.nome}', '${s.citta}')" class="w-10 h-10 flex items-center justify-center -mr-2">
                <svg class="w-5 h-5 ${isFav ? 'text-purple-600' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </button>
            </div>
            <div class="text-sm text-gray-600 space-y-2">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                <span>${s.indirizzo}, ${s.cap} ${s.citta}</span>
              </div>
              ${s.telefono ? `<a href="tel:${s.telefono}" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>${s.telefono}</a>` : ''}
              ${s.email ? `<a href="mailto:${s.email}" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline break-all"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>${s.email}</a>` : ''}
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.indirizzo + ', ' + s.citta)}" target="_blank" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold underline"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>Apri in Google Maps</a>
            </div>
            ${accreditamentiHTML}
          </div>
        `;
      });
    });
    
    document.getElementById('sediEnteContent').innerHTML = html;
    
    const sheet = document.getElementById('sediEnteSheet');
    sheet.classList.remove('hidden');
    setTimeout(() => sheet.querySelector('.bottom-sheet').classList.add('active'), 10);
  },

  closeSediSheet() {
    const sheet = document.getElementById('sediEnteSheet');
    const bottomSheet = sheet.querySelector('.bottom-sheet');
    bottomSheet.classList.remove('active');
    setTimeout(() => sheet.classList.add('hidden'), 300);
  },
  
  showError(msg) {
    const grid = document.getElementById('entiGrid');
    if (grid) grid.innerHTML = '<div class="text-center py-12"><p class="text-red-600">' + msg + '</p></div>';
  }
};
