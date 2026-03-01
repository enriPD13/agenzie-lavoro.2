// ============================================
// JobApp - Agenzie Module
// Gestione Agenzie per il Lavoro
// ============================================

const Agenzie = {
  
  data: [],
  filteredData: [],
  currentCity: null,
  
  // Inizializza il modulo
  init() {
    console.log('✅ Agenzie module inizializzato');
    this.loadData();
  },
  
  // Carica dati agenzie da JSON
  async loadData() {
    try {
      const response = await fetch('data/agenzie.json');
      if (!response.ok) {
        throw new Error('Errore caricamento dati agenzie');
      }
      this.data = await response.json();
      this.filteredData = this.data;
      console.log(`📊 Caricate ${this.data.length} agenzie`);
    } catch (error) {
      console.error('❌ Errore caricamento dati agenzie:', error);
      this.data = [];
      this.filteredData = [];
    }
  },
  
  // Filtra per città
  filterByCity(city) {
    if (!city || city === '') {
      this.filteredData = this.data;
      this.currentCity = null;
    } else {
      this.filteredData = this.data.filter(agenzia => 
        agenzia.sedi && agenzia.sedi.some(sede => 
          sede.citta.toLowerCase().includes(city.toLowerCase())
        )
      );
      this.currentCity = city;
    }
    console.log(`🔍 Filtrate ${this.filteredData.length} agenzie per: ${city || 'tutte'}`);
    return this.filteredData;
  },
  
  // Cerca per nome o sede
  search(query) {
    const q = query.toLowerCase();
    return this.data.filter(agenzia => 
      agenzia.nome.toLowerCase().includes(q) ||
      (agenzia.sedi && agenzia.sedi.some(sede => 
        sede.citta.toLowerCase().includes(q) ||
        sede.indirizzo.toLowerCase().includes(q)
      ))
    );
  },
  
  // Ottieni agenzie per provincia
  getByProvincia(provincia) {
    return this.data.filter(agenzia => 
      agenzia.sedi && agenzia.sedi.some(sede => 
        sede.provincia === provincia
      )
    );
  },
  
  // Aggiungi ai preferiti
  addToFavorites(agenziaId) {
    const favorites = this.getFavorites();
    if (!favorites.includes(agenziaId)) {
      favorites.push(agenziaId);
      localStorage.setItem('agenzie_favorites', JSON.stringify(favorites));
      console.log(`⭐ Agenzia ${agenziaId} aggiunta ai preferiti`);
      return true;
    }
    return false;
  },
  
  // Rimuovi dai preferiti
  removeFromFavorites(agenziaId) {
    let favorites = this.getFavorites();
    favorites = favorites.filter(id => id !== agenziaId);
    localStorage.setItem('agenzie_favorites', JSON.stringify(favorites));
    console.log(`❌ Agenzia ${agenziaId} rimossa dai preferiti`);
  },
  
  // Ottieni preferiti
  getFavorites() {
    const stored = localStorage.getItem('agenzie_favorites');
    return stored ? JSON.parse(stored) : [];
  },
  
  // Verifica se è preferita
  isFavorite(agenziaId) {
    return this.getFavorites().includes(agenziaId);
  }
  
};
