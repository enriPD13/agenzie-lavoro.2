// JobApp - Navigation System
const Navigation = {
  
  async loadPage(pageName) {
    console.log(`📄 Caricamento pagina: ${pageName}`);
    
    const container = document.getElementById('app-container');
    
    try {
      const response = await fetch(`pages/${pageName}.html`);
      const html = await response.text();
      container.innerHTML = html;
      
      // Inizializza la pagina
      this.initPage(pageName);
      
    } catch (error) {
      console.error('Errore caricamento pagina:', error);
      container.innerHTML = '<div class="p-4 text-white">Errore di caricamento</div>';
    }
  },
  
  initPage(pageName) {
    AppMain.currentPage = pageName;
    
    switch(pageName) {
      case 'menu':
        console.log('✅ Menu categorie caricato');
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
      case 'preferiti':
        if (typeof Preferiti !== 'undefined') {
          Preferiti.init();
        }
        break;
    }
  },
  
  goHome() {
    this.loadPage('menu');
  },
  
  openAgenzie() {
    this.loadPage('agenzie');
  },
  
  openCPI() {
    this.loadPage('cpi');
  },
  
  openPreferiti() {
    this.loadPage('preferiti');
  },
  
  openComingSoon() {
    alert('Coming Soon! 🚀');
  }
  
};

// Funzioni globali per onclick
function navigateToHome() {
  Navigation.goHome();
}

function goBack() {
  Navigation.goHome();
}

function openAgenzieApp() {
  Navigation.openAgenzie();
}

function openCPIApp() {
  Navigation.openCPI();
}

function openPreferitiPage() {
  Navigation.openPreferiti();
}

function openProfilePage() {
  alert('Profilo - Coming Soon! 👤');
}

function openComingSoon() {
  Navigation.openComingSoon();
}
