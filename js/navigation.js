// ============================================
// JobApp - Navigation System
// Gestione routing e navigazione tra pagine
// ============================================

const Navigation = {
  
  currentPage: null,
  history: [],
  
  // Carica una pagina
  async loadPage(pageName) {
    console.log(`📄 Caricamento pagina: ${pageName}`);
    
    const container = document.getElementById('app-container');
    
    // Mostra loading
    this.showLoading();
    
    try {
      // Fetch del file HTML
      const response = await fetch(`pages/${pageName}.html`);
      
      if (!response.ok) {
        throw new Error(`Pagina ${pageName} non trovata`);
      }
      
      const html = await response.text();
      
      // Inserisci contenuto
      container.innerHTML = html;
      
      // Aggiungi a history
      this.history.push(pageName);
      this.currentPage = pageName;
      
      // Inizializza la pagina
      this.initPage(pageName);
      
      // Scroll to top
      window.scrollTo(0, 0);
      
      console.log(`✅ Pagina ${pageName} caricata`);
      
    } catch (error) {
      console.error('❌ Errore caricamento pagina:', error);
      this.showError(pageName);
    }
  },
  
  // Mostra loading
  showLoading() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
      <div class="fixed inset-0 bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <div class="spinner mb-4"></div>
          <p class="text-gray-600">Caricamento...</p>
        </div>
      </div>
    `;
  },
  
  // Mostra errore caricamento
  showError(pageName) {
    const container = document.getElementById('app-container');
    container.innerHTML = `
      <div class="fixed inset-0 bg-gray-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl p-6 max-w-md text-center shadow-xl">
          <div class="text-6xl mb-4">📄</div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Pagina Non Trovata</h2>
          <p class="text-gray-600 mb-4">Impossibile caricare: ${pageName}</p>
          <button onclick="Navigation.goHome()" class="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
            Torna al Menu
          </button>
        </div>
      </div>
    `;
  },
  
  // Inizializza pagina specifica
  initPage(pageName) {
    AppMain.currentPage = pageName;
    
    switch(pageName) {
      case 'menu':
        console.log('✅ Menu categorie inizializzato');
        break;
        
      case 'agenzie':
        if (typeof Agenzie !== 'undefined') {
          Agenzie.init();
        }
        break;
        
      case 'cpi':
        if (typeof CPI !== 'undefined') {
          CPI.init();
        }
        break;
        
      case 'profile':
        if (typeof Auth !== 'undefined') {
          Auth.init();
        }
        break;
        
      case 'preferiti':
        console.log('✅ Preferiti inizializzati');
        break;
        
      default:
        console.log(`⚠️ Nessuna inizializzazione per: ${pageName}`);
    }
  },
  
  // Torna alla home
  goHome() {
    this.loadPage('menu');
  },
  
  // Apri Agenzie
  openAgenzie() {
    this.loadPage('agenzie');
  },
  
  // Apri CPI
  openCPI() {
    this.loadPage('cpi');
  },
  
  // Apri Profilo
  openProfile() {
    this.loadPage('profile');
  },
  
  // Apri Preferiti
  openPreferiti() {
    this.loadPage('preferiti');
  },
  
  // Coming Soon
  openComingSoon() {
    alert('🚀 Coming Soon!\n\nQuesta funzionalità sarà disponibile a breve.');
  },
  
  // Indietro
  goBack() {
    if (this.history.length > 1) {
      this.history.pop(); // Rimuovi pagina corrente
      const previousPage = this.history[this.history.length - 1];
      this.loadPage(previousPage);
    } else {
      this.goHome();
    }
  }
  
};

// ============================================
// Funzioni globali per onclick
// ============================================

function navigateToHome() {
  Navigation.goHome();
}

function openAgenzieApp() {
  Navigation.openAgenzie();
}

function openCPIApp() {
  Navigation.openCPI();
}

function openProfilePage() {
  Navigation.openProfile();
}

function openPreferitiPage() {
  Navigation.openPreferiti();
}

function openComingSoon() {
  Navigation.openComingSoon();
}

function goBack() {
  Navigation.goBack();
}
