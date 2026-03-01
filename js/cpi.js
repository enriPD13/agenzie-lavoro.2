// ============================================
// JobApp - CPI Module
// Gestione Centri Per l'Impiego
// ============================================

const CPI = {
  
  data: [],
  currentProvince: null,
  
  // Inizializza il modulo
  init() {
    console.log('✅ CPI module inizializzato');
    this.loadData();
  },
  
  // Carica dati CPI da JSON
  async loadData() {
    try {
      const response = await fetch('data/cpi.json');
      if (!response.ok) {
        throw new Error('Errore caricamento dati CPI');
      }
      this.data = await response.json();
      console.log(`📊 Caricati ${this.data.length} CPI`);
    } catch (error) {
      console.error('❌ Errore caricamento dati CPI:', error);
      this.data = [];
    }
  },
  
  // Toggle accordion provincia
  toggle(provincia) {
    const div = document.getElementById(`cpi-${provincia}`);
    const arrow = document.getElementById(`arrow-${provincia}`);
    
    if (!div || !arrow) {
      console.error(`❌ Provincia ${provincia} non trovata`);
      return;
    }
    
    const isHidden = div.classList.contains('hidden');
    
    if (isHidden) {
      // Apri
      div.classList.remove('hidden');
      arrow.style.transform = 'rotate(180deg)';
      this.currentProvince = provincia;
      console.log(`📂 Aperta provincia: ${provincia}`);
    } else {
      // Chiudi
      div.classList.add('hidden');
      arrow.style.transform = 'rotate(0deg)';
      this.currentProvince = null;
      console.log(`📁 Chiusa provincia: ${provincia}`);
    }
  },
  
  // Ottieni CPI per provincia
  getByProvincia(provincia) {
    return this.data.filter(cpi => 
      cpi.provincia.toLowerCase() === provincia.toLowerCase()
    );
  },
  
  // Cerca CPI per nome o città
  search(query) {
    const q = query.toLowerCase();
    return this.data.filter(cpi => 
      cpi.nome.toLowerCase().includes(q) ||
      cpi.citta.toLowerCase().includes(q) ||
      cpi.provincia.toLowerCase().includes(q)
    );
  },
  
  // Aggiungi ai preferiti
  addToFavorites(cpiId) {
    const favorites = this.getFavorites();
    if (!favorites.includes(cpiId)) {
      favorites.push(cpiId);
      localStorage.setItem('cpi_favorites', JSON.stringify(favorites));
      console.log(`⭐ CPI ${cpiId} aggiunto ai preferiti`);
      return true;
    }
    return false;
  },
  
  // Rimuovi dai preferiti
  removeFromFavorites(cpiId) {
    let favorites = this.getFavorites();
    favorites = favorites.filter(id => id !== cpiId);
    localStorage.setItem('cpi_favorites', JSON.stringify(favorites));
    console.log(`❌ CPI ${cpiId} rimosso dai preferiti`);
  },
  
  // Ottieni preferiti
  getFavorites() {
    const stored = localStorage.getItem('cpi_favorites');
    return stored ? JSON.parse(stored) : [];
  },
  
  // Verifica se è preferito
  isFavorite(cpiId) {
    return this.getFavorites().includes(cpiId);
  }
  
};
