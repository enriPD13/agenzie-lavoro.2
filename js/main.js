// ============================================
// JobApp - Main Application
// Inizializzazione e gestione app
// ============================================

const AppMain = {
  
  version: '1.0.0',
  currentPage: null,
  
  // Inizializza l'applicazione
  init() {
    console.log(`🚀 JobApp v${this.version} - Inizializzazione...`);
    
    // Verifica supporto browser
    if (!this.checkBrowserSupport()) {
      this.showUnsupportedBrowser();
      return;
    }
    
    // Carica splash screen
    this.loadSplashScreen();
  },
  
  // Verifica compatibilità browser
  checkBrowserSupport() {
    if (!window.fetch) {
      console.error('❌ Browser non supporta Fetch API');
      return false;
    }
    return true;
  },
  
  // Mostra browser non supportato
  showUnsupportedBrowser() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
      <div class="fixed inset-0 bg-red-500 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl p-6 max-w-md text-center">
          <div class="text-6xl mb-4">⚠️</div>
          <h1 class="text-2xl font-bold mb-2">Browser Non Supportato</h1>
          <p class="text-gray-600">Aggiorna il browser o usa Chrome, Firefox, Safari.</p>
        </div>
      </div>
    `;
  },
  
  // Carica splash screen
  loadSplashScreen() {
    const container = document.getElementById('app-container');
    
    container.innerHTML = `
      <div id="splashScreen" class="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center z-[100]" style="top: -100px; padding-top: 100px;">
        <div class="text-center">
          <h1 class="jobapp-title text-7xl sm:text-8xl md:text-9xl font-black mb-4">JobApp</h1>
          <div class="flex items-center justify-center gap-2">
            <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div class="w-3 h-3 bg-white rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
            <div class="w-3 h-3 bg-white rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
          </div>
        </div>
      </div>
    `;
    
    // Dopo 2 secondi carica menu
    setTimeout(() => {
      this.hideSplash();
    }, 2000);
  },
  
  // Nascondi splash
  hideSplash() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;
    
    splash.classList.add('fade-out');
    
    setTimeout(() => {
      splash.remove();
      if (typeof Navigation !== 'undefined') {
        Navigation.loadPage('menu');
      }
    }, 600);
  },
  
  // Mostra errore
  showError(message) {
    const container = document.getElementById('app-container');
    container.innerHTML = `
      <div class="fixed inset-0 bg-gray-100 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl p-6 max-w-md text-center shadow-xl">
          <div class="text-6xl mb-4">😕</div>
          <h2 class="text-xl font-bold mb-2">Oops!</h2>
          <p class="text-gray-600">${message}</p>
          <button onclick="location.reload()" class="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold">
            Ricarica App
          </button>
        </div>
      </div>
    `;
  }
  
};
