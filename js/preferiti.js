// JobApp - Preferiti Module
const Preferiti = {
  
  favoriteAgencies: [],
  allAgencies: [],
  
  async init() {
    console.log('✅ Preferiti inizializzati');
    this.loadFavorites();
    await this.loadAgencies();
    this.render();
  },
  
  loadFavorites() {
    const stored = localStorage.getItem('agenzie_favorites');
    this.favoriteAgencies = stored ? JSON.parse(stored) : [];
  },
  
  async loadAgencies() {
    try {
      const response = await fetch('data/agenzie.json');
      this.allAgencies = await response.json();
    } catch (error) {
      console.error('Errore caricamento agenzie:', error);
      this.allAgencies = [];
    }
  },
  
  render() {
    const agenciesList = document.getElementById('favoriteAgenciesList');
    const emptyState = document.getElementById('emptyState');
    const agenciesSection = document.getElementById('favoriteAgenciesSection');
    
    if (!agenciesList) return;
    
    const favAgencies = this.allAgencies.filter(a => 
      this.favoriteAgencies.includes(a.id)
    );
    
    if (favAgencies.length === 0) {
      agenciesSection.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }
    
    agenciesSection.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    agenciesList.innerHTML = favAgencies.map(a => `
      <div class="bg-white rounded-2xl p-4 shadow-sm">
        <div class="flex items-center gap-3">
          ${a.logo ? `
            <div class="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-xl flex items-center justify-center p-2">
              <img src="${a.logo}" alt="${a.nome}" class="max-w-full max-h-full object-contain"/>
            </div>
          ` : `
            <div class="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
              ${a.nome.substring(0, 2)}
            </div>
          `}
          
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-gray-900">${a.nome}</h3>
            <p class="text-sm text-gray-600">${a.sedi?.length || 0} sedi</p>
          </div>
          
          <button onclick="Preferiti.removeFavorite(${a.id})" class="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
          </button>
        </div>
        
        <div class="mt-3 flex gap-2">
          <button onclick="openAgenzieApp(); setTimeout(() => Agenzie.openSedi(${a.id}), 300)" class="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
            📍 Vedi Sedi
          </button>
          ${a.sito ? `
            <a href="${a.sito}" target="_blank" class="flex-1 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold text-center">
              🌐 Candidati
            </a>
          ` : ''}
        </div>
      </div>
    `).join('');
  },
  
  removeFavorite(agencyId) {
    const index = this.favoriteAgencies.indexOf(agencyId);
    if (index > -1) {
      this.favoriteAgencies.splice(index, 1);
      localStorage.setItem('agenzie_favorites', JSON.stringify(this.favoriteAgencies));
      this.render();
    }
  }
  
};
