// Firebase Favorites Manager
import { auth, db, doc, getDoc, setDoc, updateDoc, onAuthStateChanged } from './firebase-config.js';

const FirebaseFavorites = {
  
  currentUser: null,
  isReady: false,
  
  init() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        this.isReady = true;
        console.log('FirebaseFavorites ready, user:', user?.email || 'not logged in');
        resolve(user);
      });
    });
  },
  
  isLoggedIn() {
    return this.currentUser !== null;
  },
  
  requireLogin() {
    if (!this.isLoggedIn()) {
      if (typeof LoginPopup !== 'undefined') {
        LoginPopup.show();
      }
      return false;
    }
    return true;
  },
  
  async getFavorites() {
    if (!this.isLoggedIn()) {
      return {
        agenzie: [],
        agenzie_sedi: [],
        cpi: [],
        cpi_sedi: [],
        enti: [],
        enti_sedi: [],
        piattaforme: []
      };
    }
    
    try {
      const docRef = doc(db, 'favorites', this.currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Crea documento vuoto
        const emptyFavorites = {
          agenzie: [],
          agenzie_sedi: [],
          cpi: [],
          cpi_sedi: [],
          enti: [],
          enti_sedi: [],
          piattaforme: []
        };
        await setDoc(docRef, emptyFavorites);
        return emptyFavorites;
      }
    } catch (error) {
      console.error('Errore caricamento preferiti:', error);
      return null;
    }
  },
  
  async saveFavorites(favorites) {
    if (!this.isLoggedIn()) {
      console.warn('Non loggato - impossibile salvare');
      return false;
    }
    
    try {
      const docRef = doc(db, 'favorites', this.currentUser.uid);
      await setDoc(docRef, favorites, { merge: true });
      console.log('Preferiti salvati su Firebase');
      return true;
    } catch (error) {
      console.error('Errore salvataggio preferiti:', error);
      return false;
    }
  },
  
  async addAgency(agencyId) {
    if (!this.requireLogin()) return false;
    
    const favorites = await this.getFavorites();
    if (!favorites.agenzie.includes(agencyId)) {
      favorites.agenzie.push(agencyId);
      return await this.saveFavorites(favorites);
    }
    return true;
  },
  
  async removeAgency(agencyId) {
    if (!this.isLoggedIn()) return false;
    
    const favorites = await this.getFavorites();
    favorites.agenzie = favorites.agenzie.filter(id => id !== agencyId);
    // Rimuovi anche le sedi
    favorites.agenzie_sedi = favorites.agenzie_sedi.filter(sede => {
      const sedeAgencyId = sede.id.split('-').slice(0, 2).join('-');
      return sedeAgencyId !== agencyId;
    });
    return await this.saveFavorites(favorites);
  },
  
  async addAgencySede(sedeData) {
    if (!this.requireLogin()) return false;
    
    const favorites = await this.getFavorites();
    // Aggiungi sede se non esiste
    const exists = favorites.agenzie_sedi.some(s => s.id === sedeData.id);
    if (!exists) {
      favorites.agenzie_sedi.push(sedeData);
    }
    // Auto-aggiungi agenzia se non presente
    const agencyId = sedeData.id.split('-').slice(0, 2).join('-');
    if (!favorites.agenzie.includes(agencyId)) {
      favorites.agenzie.push(agencyId);
    }
    return await this.saveFavorites(favorites);
  },
  
  async removeAgencySede(sedeId) {
    if (!this.isLoggedIn()) return false;
    
    const favorites = await this.getFavorites();
    favorites.agenzie_sedi = favorites.agenzie_sedi.filter(s => s.id !== sedeId);
    return await this.saveFavorites(favorites);
  },
  
  async addCPI(provinciaSigla) {
    if (!this.requireLogin()) return false;
    
    const favorites = await this.getFavorites();
    if (!favorites.cpi.includes(provinciaSigla)) {
      favorites.cpi.push(provinciaSigla);
      return await this.saveFavorites(favorites);
    }
    return true;
  },
  
  async removeCPI(provinciaSigla) {
    if (!this.isLoggedIn()) return false;
    
    const favorites = await this.getFavorites();
    favorites.cpi = favorites.cpi.filter(id => id !== provinciaSigla);
    // Rimuovi anche le sedi
    favorites.cpi_sedi = favorites.cpi_sedi.filter(sede => {
      const sedeProvinciaId = sede.id.split('-')[0];
      return sedeProvinciaId !== provinciaSigla;
    });
    return await this.saveFavorites(favorites);
  },
  
  async addCPISede(sedeData) {
    if (!this.requireLogin()) return false;
    
    const favorites = await this.getFavorites();
    const exists = favorites.cpi_sedi.some(s => s.id === sedeData.id);
    if (!exists) {
      favorites.cpi_sedi.push(sedeData);
    }
    // Auto-aggiungi provincia
    const provinciaId = sedeData.id.split('-')[0];
    if (!favorites.cpi.includes(provinciaId)) {
      favorites.cpi.push(provinciaId);
    }
    return await this.saveFavorites(favorites);
  },
  
  async removeCPISede(sedeId) {
    if (!this.isLoggedIn()) return false;
    
    const favorites = await this.getFavorites();
    favorites.cpi_sedi = favorites.cpi_sedi.filter(s => s.id !== sedeId);
    return await this.saveFavorites(favorites);
  },
  
  async addEnte(enteId) {
    if (!this.requireLogin()) return false;
    
    const favorites = await this.getFavorites();
    if (!favorites.enti.includes(enteId)) {
      favorites.enti.push(enteId);
      return await this.saveFavorites(favorites);
    }
    return true;
  },
  
  async removeEnte(enteId) {
    if (!this.isLoggedIn()) return false;
    
    const favorites = await this.getFavorites();
    favorites.enti = favorites.enti.filter(id => id !== enteId);
    favorites.enti_sedi = favorites.enti_sedi.filter(sede => {
      const sedeEnteId = sede.id.split('-').slice(0, 2).join('-');
      return sedeEnteId !== enteId;
    });
    return await this.saveFavorites(favorites);
  },
  
  async addPiattaforma(piattaformaId) {
    if (!this.requireLogin()) return false;
    
    const favorites = await this.getFavorites();
    if (!favorites.piattaforme.includes(piattaformaId)) {
      favorites.piattaforme.push(piattaformaId);
      return await this.saveFavorites(favorites);
    }
    return true;
  },
  
  async removePiattaforma(piattaformaId) {
    if (!this.isLoggedIn()) return false;
    
    const favorites = await this.getFavorites();
    favorites.piattaforme = favorites.piattaforme.filter(id => id !== piattaformaId);
    return await this.saveFavorites(favorites);
  }
  
};

// Esporta globalmente
window.FirebaseFavorites = FirebaseFavorites;

export default FirebaseFavorites;
