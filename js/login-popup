// Login Popup Component
const LoginPopup = {
  
  show() {
    // Rimuovi popup esistente se presente
    this.hide();
    
    const popup = document.createElement('div');
    popup.id = 'login-popup-overlay';
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.innerHTML = `
      <div class="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl animate-scale-in">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Accedi per salvare</h3>
          <p class="text-gray-600 text-sm">Crea un account per salvare i tuoi preferiti e accedere a tutte le funzionalità</p>
        </div>
        
        <div class="space-y-3">
          <button onclick="LoginPopup.goToLogin()" class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition">
            Accedi ora
          </button>
          <button onclick="LoginPopup.hide()" class="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition">
            Annulla
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    // Click fuori per chiudere
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        this.hide();
      }
    });
  },
  
  hide() {
    const popup = document.getElementById('login-popup-overlay');
    if (popup) {
      popup.remove();
    }
  },
  
  goToLogin() {
    this.hide();
    if (typeof Navigation !== 'undefined') {
      Navigation.openProfilo();
    }
  }
  
};

// CSS per animazione (aggiungi a styles.css oppure inline)
const style = document.createElement('style');
style.textContent = `
  @keyframes scale-in {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  .animate-scale-in {
    animation: scale-in 0.2s ease-out;
  }
`;
document.head.appendChild(style);

// Esporta globalmente
window.LoginPopup = LoginPopup;
