// ============================================
// JobApp - Favorites Module
// Gestione sistema preferiti
// ============================================

const Favorites = {
  
  // Ottieni tutti i preferiti (agenzie + CPI)
  getAll() {
    return {
      agenzie: this.getAgenzie(),
      cpi: this.getCPI()
    };
  },
  
  // Ottieni agenzie preferite
  getAgenzie() {
    const stored = localStorage.getItem('agenzie_favorites');
    return stored ? JSON.parse(stored) : [];
  },
  
  // Ottieni CPI preferiti
  getCPI() {
    const stored = localStorage.getItem('cpi_favorites');
    return stored ? JSON.parse(stored) : [];
  },
  
  // Conta totale preferiti
  count() {
    return this.getAgenzie().length + this.getCPI().length;
  },
  
  // Svuota tutti i preferiti
  clearAll() {
    if (confirm('Vuoi rimuovere tutti i preferiti?')) {
      localStorage.removeItem('agenzie_favorites');
      localStorage.removeItem('cpi_favorites');
      console.log('🗑️ Preferiti svuotati');
      return true;
    }
    return false;
  },
  
  // Esporta preferiti come JSON
  export() {
    const data = this.getAll();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobapp-preferiti.json';
    a.click();
    
    console.log('💾 Preferiti esportati');
  },
  
  // Importa preferiti da JSON
  import(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.agenzie) {
        localStorage.setItem('agenzie_favorites', JSON.stringify(data.agenzie));
      }
      
      if (data.cpi) {
        localStorage.setItem('cpi_favorites', JSON.stringify(data.cpi));
      }
      
      console.log('📥 Preferiti importati');
      return true;
    } catch (error) {
      console.error('❌ Errore importazione:', error);
      return false;
    }
  }
  
};
