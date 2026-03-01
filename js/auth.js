// ============================================
// JobApp - Authentication Module
// Gestione autenticazione utente
// ============================================

const Auth = {
  
  user: null,
  isAuthenticated: false,
  
  // Inizializza il modulo
  init() {
    console.log('🔐 Auth module inizializzato');
    this.checkSession();
  },
  
  // Verifica sessione salvata
  checkSession() {
    const stored = localStorage.getItem('user_session');
    if (stored) {
      try {
        this.user = JSON.parse(stored);
        this.isAuthenticated = true;
        console.log('✅ Sessione utente ripristinata:', this.user.email);
      } catch (error) {
        console.error('❌ Errore ripristino sessione:', error);
        this.logout();
      }
    }
  },
  
  // Login utente
  login(email, password) {
    // TODO: Implementare login reale con backend
    // Per ora simulazione
    
    if (!email || !password) {
      console.error('❌ Email e password richiesti');
      return false;
    }
    
    // Simula login
    this.user = {
      id: Date.now(),
      email: email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    this.isAuthenticated = true;
    this.saveSession();
    
    console.log('✅ Login effettuato:', email);
    return true;
  },
  
  // Logout utente
  logout() {
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem('user_session');
    console.log('👋 Logout effettuato');
  },
  
  // Salva sessione
  saveSession() {
    if (this.user) {
      localStorage.setItem('user_session', JSON.stringify(this.user));
    }
  },
  
  // Ottieni utente corrente
  getCurrentUser() {
    return this.user;
  },
  
  // Verifica se autenticato
  isLoggedIn() {
    return this.isAuthenticated;
  },
  
  // Registrazione utente
  register(email, password, name) {
    // TODO: Implementare registrazione con backend
    console.log('📝 Registrazione:', email);
    return this.login(email, password);
  },
  
  // Reset password
  resetPassword(email) {
    // TODO: Implementare reset password
    console.log('🔄 Reset password per:', email);
    alert('Email di reset inviata a: ' + email);
  }
  
};
