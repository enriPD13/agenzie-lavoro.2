// JobApp - Piattaforme Annunci Module
const Piattaforme = {
  allPiattaforme: [],
  favorites: [],
  filteredPiattaforme: [],
  
  init() {
    setTimeout(() => {
      const loading = document.getElementById('loadingPiattaforme');
      if (loading) loading.classList.add('hidden');
    }, 500);
    this.loadData();
    this.setupSearch();
  },
  
  async loadData() {
    try {
      const response = await fetch('data/piattaforme.json');
      this.allPiattaforme = await response.json();
      this.allPiattaforme.sort((a, b) => a.nome.localeCompare(b.nome));
      this.filteredPiattaforme = this.allPiattaforme;
      this.loadFavorites();
      this.render();
    } catch (error) {
      this.showError(error.message);
    }
  },
  
  setupSearch() {
    const input = document.getElementById('searchInputPiattaforme');
    if (!input) return;
    
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      
      if (q === '') {
        this.filteredPiattaforme = this.allPiattaforme;
      } else {
        this.filteredPiattaforme = this.allPiattaforme.filter(p => {
          return p.nome.toLowerCase().includes(q) || 
                 (p.descrizione && p.descrizione.toLowerCase().includes(q)) ||
                 (p.categoria && p.categoria.toLowerCase().includes(q));
        });
      }
      this.render();
    });
  },
  
  render() {
    const grid = document.getElementById('piattaformeGrid');
    if (!grid) return;
    
    const stats = document.getElementById('statsPiattaforme');
    if (stats) {
      stats.innerHTML = `
        <div class="bg-orange-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">${this.filteredPiattaforme.length}</div><div class="text-xs">Piattaforme</div></div>
        <div class="bg-red-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">📢</div><div class="text-xs">Online</div></div>
      `;
    }
    
    if (this.filteredPiattaforme.length === 0) {
      grid.innerHTML = '<div class="text-center py-12"><div class="text-6xl mb-4">🔍</div><h3 class="text-xl font-bold">Nessun Risultato</h3></div>';
      return;
    }
    
    grid.innerHTML = this.filteredPiattaforme.map(p => this.renderPiattaformaCard(p)).join('');
  },
  
  renderPiattaformaCard(p) {
    const isFav = this.isFavorite(p.id);
    const favClass = isFav ? 'bg-yellow-100' : 'bg-gray-100';
    const starColor = isFav ? 'text-yellow-500' : 'text-gray-400';
    const starFill = isFav ? 'currentColor' : 'none';
    
    return `
      <div class="bg-white rounded-3xl overflow-hidden shadow-sm">
        <div class="h-36 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-6">
          ${p.logo ? `<img src="${p.logo}" alt="${p.nome}" class="max-h-20 object-contain"/>` : `<div class="text-6xl">📢</div>`}
        </div>
        
        <div class="p-5">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-xl font-bold flex-1">${p.nome}</h3>
            <button onclick="Piattaforme.toggleFavorite(${p.id})" class="ml-2 w-10 h-10 rounded-full flex items-center justify-center ${favClass}">
              <svg class="w-6 h-6 ${starColor}" fill="${starFill}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </button>
          </div>
          
          ${p.categoria ? `<div class="flex gap-2 mb-3"><span class="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">${p.categoria}</span></div>` : ''}
          
          ${p.descrizione ? `<p class="text-sm text-gray-600 mb-4 line-clamp-3">${p.descrizione}</p>` : `<p class="text-sm text-gray-400 mb-4 italic">Descrizione non ancora disponibile</p>`}
          
          ${p.sito ? `
            <a href="${p.sito}" target="_blank" class="block w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              Vai al Sito
            </a>
          ` : ''}
        </div>
      </div>
    `;
  },
  
  toggleFavorite(piattaformaId) {
    const index = this.favorites.indexOf(piattaformaId);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(piattaformaId);
    }
    this.saveFavorites();
    this.render();
  },
  
  isFavorite(piattaformaId) {
    return this.favorites.includes(piattaformaId);
  },
  
  loadFavorites() {
    const s = localStorage.getItem('piattaforme_favorites');
    this.favorites = s ? JSON.parse(s) : [];
  },
  
  saveFavorites() {
    localStorage.setItem('piattaforme_favorites', JSON.stringify(this.favorites));
  },
  
  showError(msg) {
    const grid = document.getElementById('piattaformeGrid');
    if (grid) grid.innerHTML = '<div class="text-center py-12"><p class="text-red-600">' + msg + '</p></div>';
  }
};
