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
      case 'enti':
        if (typeof Enti !== 'undefined') {
          Enti.init();
        }
        break;
      case 'piattaforme':
        if (typeof Piattaforme !== 'undefined') {
          Piattaforme.init();
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
  
  openEnti() {
    this.loadPage('enti');
  },
  
  openPiattaforme() {
    this.loadPage('piattaforme');
  },
  
  openClicLavoro() {
    this.loadPage('cliclavoro');
  },
  
  openPoliticheAttive() {
    this.loadPage('politiche-attive');
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

function openEntiApp() {
  Navigation.openEnti();
}

function openPiattaformeApp() {
  Navigation.openPiattaforme();
}

function openClicLavoroApp() {
  Navigation.openClicLavoro();
}

function openPoliticheAttiveApp() {
  Navigation.openPoliticheAttive();
}

function openProfilePage() {
  alert('Profilo - Coming Soon! 👤');
}

function openComingSoon() {
  Navigation.openComingSoon();
}
