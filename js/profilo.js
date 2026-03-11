// JobApp - Profilo Module
import { 
  auth, 
  db, 
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from './firebase-config.js';

const Profilo = {
  currentUser: null,
  userData: null,

  async init() {
    console.log('Profilo init START');
    
    // Ascolta cambiamenti stato autenticazione
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        console.log('Utente loggato:', user.email);
        await this.loadUserData(user.uid);
        this.renderProfilePage();
      } else {
        console.log('Utente non loggato');
        this.renderLoginPage();
      }
    });
  },

  async loadUserData(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        this.userData = docSnap.data();
        console.log('Dati utente caricati:', this.userData);
      } else {
        // Primo accesso - crea documento vuoto
        this.userData = {
          nome: '',
          cognome: '',
          telefono: '',
          indirizzo: '',
          email: this.currentUser.email,
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, this.userData);
      }
    } catch (error) {
      console.error('Errore caricamento dati utente:', error);
      this.userData = null;
    }
  },

  renderLoginPage() {
    const container = document.getElementById('profilo-container');
    container.innerHTML = `
      <!-- Login Card -->
      <div class="max-w-md mx-auto mt-8">
        
        <!-- Welcome -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Benvenuto!</h2>
          <p class="text-gray-600">Accedi per salvare i tuoi preferiti</p>
        </div>

        <!-- Login con Google -->
        <button onclick="Profilo.loginWithGoogle()" class="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:border-indigo-500 hover:shadow-lg transition mb-4">
          <svg class="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="font-semibold text-gray-700">Continua con Google</span>
        </button>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-gray-50 text-gray-500">oppure</span>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6">
          <button onclick="Profilo.switchTab('login')" id="tab-login" class="flex-1 py-2 px-4 rounded-lg font-semibold bg-indigo-600 text-white">
            Accedi
          </button>
          <button onclick="Profilo.switchTab('register')" id="tab-register" class="flex-1 py-2 px-4 rounded-lg font-semibold bg-gray-100 text-gray-600">
            Registrati
          </button>
        </div>

        <!-- Login Form -->
        <div id="login-form" class="bg-white rounded-2xl p-6 shadow-lg">
          <form onsubmit="Profilo.loginWithEmail(event)">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" id="login-email" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="tua@email.com">
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" id="login-password" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••">
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition">
              Accedi
            </button>
          </form>
        </div>

        <!-- Register Form (hidden) -->
        <div id="register-form" class="bg-white rounded-2xl p-6 shadow-lg hidden">
          <form onsubmit="Profilo.registerWithEmail(event)">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" id="register-email" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="tua@email.com">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" id="register-password" required minlength="6" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••">
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Conferma Password</label>
              <input type="password" id="register-password-confirm" required minlength="6" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••">
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition">
              Registrati
            </button>
          </form>
        </div>

        <!-- Error Message -->
        <div id="auth-error" class="hidden mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p class="text-sm text-red-600" id="auth-error-text"></p>
        </div>

      </div>
    `;
  },

  renderProfilePage() {
    const container = document.getElementById('profilo-container');
    const user = this.currentUser;
    const data = this.userData || {};

    container.innerHTML = `
      <!-- Profile Header -->
      <div class="bg-white rounded-2xl p-6 shadow-lg mb-4">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            ${this.getInitials(data.nome, data.cognome, user.email)}
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900">${data.nome || data.cognome ? `${data.nome} ${data.cognome}` : 'Completa il profilo'}</h3>
            <p class="text-sm text-gray-500">${user.email}</p>
          </div>
        </div>
        <button onclick="Profilo.logout()" class="w-full bg-red-50 text-red-600 font-semibold py-2 rounded-xl hover:bg-red-100 transition">
          Esci
        </button>
      </div>

      <!-- Edit Mode Toggle -->
      <div class="flex justify-end mb-4">
        <button onclick="Profilo.toggleEditMode()" id="edit-mode-btn" class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition">
          ✏️ Modifica Profilo
        </button>
      </div>

      <!-- Profile Form -->
      <div class="bg-white rounded-2xl p-6 shadow-lg">
        <form onsubmit="Profilo.saveProfile(event)">
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input type="text" id="profile-nome" value="${data.nome || ''}" disabled class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500" placeholder="Mario">
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Cognome</label>
            <input type="text" id="profile-cognome" value="${data.cognome || ''}" disabled class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500" placeholder="Rossi">
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
            <input type="tel" id="profile-telefono" value="${data.telefono || ''}" disabled class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500" placeholder="+39 123 456 7890">
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Indirizzo</label>
            <input type="text" id="profile-indirizzo" value="${data.indirizzo || ''}" disabled class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500" placeholder="Via Roma 1, Padova">
          </div>

          <button type="submit" id="save-profile-btn" class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition hidden">
            💾 Salva Modifiche
          </button>

        </form>
      </div>

      <!-- Success Message -->
      <div id="profile-success" class="hidden mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
        <p class="text-sm text-green-600 text-center">✅ Profilo salvato con successo!</p>
      </div>
    `;
  },

  getInitials(nome, cognome, email) {
    if (nome && cognome) {
      return `${nome[0]}${cognome[0]}`.toUpperCase();
    }
    if (nome) return nome[0].toUpperCase();
    if (email) return email[0].toUpperCase();
    return '?';
  },

  switchTab(tab) {
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (tab === 'login') {
      loginTab.className = 'flex-1 py-2 px-4 rounded-lg font-semibold bg-indigo-600 text-white';
      registerTab.className = 'flex-1 py-2 px-4 rounded-lg font-semibold bg-gray-100 text-gray-600';
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    } else {
      registerTab.className = 'flex-1 py-2 px-4 rounded-lg font-semibold bg-indigo-600 text-white';
      loginTab.className = 'flex-1 py-2 px-4 rounded-lg font-semibold bg-gray-100 text-gray-600';
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    }
    
    this.hideError();
  },

  async loginWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged si occuperà del resto
    } catch (error) {
      console.error('Errore login Google:', error);
      this.showError(this.getErrorMessage(error.code));
    }
  },

  async loginWithEmail(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged si occuperà del resto
    } catch (error) {
      console.error('Errore login:', error);
      this.showError(this.getErrorMessage(error.code));
    }
  },

  async registerWithEmail(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;

    if (password !== passwordConfirm) {
      this.showError('Le password non coincidono');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged si occuperà del resto
    } catch (error) {
      console.error('Errore registrazione:', error);
      this.showError(this.getErrorMessage(error.code));
    }
  },

  async logout() {
    try {
      await signOut(auth);
      // onAuthStateChanged si occuperà del resto
    } catch (error) {
      console.error('Errore logout:', error);
    }
  },

  toggleEditMode() {
    const fields = ['profile-nome', 'profile-cognome', 'profile-telefono', 'profile-indirizzo'];
    const saveBtn = document.getElementById('save-profile-btn');
    const editBtn = document.getElementById('edit-mode-btn');

    const isDisabled = document.getElementById('profile-nome').disabled;

    fields.forEach(id => {
      const field = document.getElementById(id);
      field.disabled = !isDisabled;
    });

    if (isDisabled) {
      saveBtn.classList.remove('hidden');
      editBtn.textContent = '❌ Annulla';
      editBtn.className = 'px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition';
    } else {
      saveBtn.classList.add('hidden');
      editBtn.textContent = '✏️ Modifica Profilo';
      editBtn.className = 'px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition';
      // Ripristina valori originali
      this.renderProfilePage();
    }
  },

  async saveProfile(event) {
    event.preventDefault();

    const nome = document.getElementById('profile-nome').value.trim();
    const cognome = document.getElementById('profile-cognome').value.trim();
    const telefono = document.getElementById('profile-telefono').value.trim();
    const indirizzo = document.getElementById('profile-indirizzo').value.trim();

    try {
      const docRef = doc(db, 'users', this.currentUser.uid);
      await updateDoc(docRef, {
        nome,
        cognome,
        telefono,
        indirizzo,
        updatedAt: new Date().toISOString()
      });

      this.userData = { ...this.userData, nome, cognome, telefono, indirizzo };
      
      // Mostra messaggio successo
      document.getElementById('profile-success').classList.remove('hidden');
      setTimeout(() => {
        document.getElementById('profile-success').classList.add('hidden');
      }, 3000);

      // Disabilita edit mode
      this.toggleEditMode();

    } catch (error) {
      console.error('Errore salvataggio profilo:', error);
      alert('Errore nel salvataggio. Riprova.');
    }
  },

  showError(message) {
    const errorDiv = document.getElementById('auth-error');
    const errorText = document.getElementById('auth-error-text');
    errorText.textContent = message;
    errorDiv.classList.remove('hidden');
  },

  hideError() {
    const errorDiv = document.getElementById('auth-error');
    if (errorDiv) {
      errorDiv.classList.add('hidden');
    }
  },

  getErrorMessage(errorCode) {
    const errors = {
      'auth/email-already-in-use': 'Email già registrata',
      'auth/invalid-email': 'Email non valida',
      'auth/weak-password': 'Password troppo debole (minimo 6 caratteri)',
      'auth/user-not-found': 'Utente non trovato',
      'auth/wrong-password': 'Password errata',
      'auth/popup-closed-by-user': 'Login annullato',
      'auth/cancelled-popup-request': 'Login annullato'
    };
    return errors[errorCode] || 'Errore durante l\'autenticazione';
  }

};

// Esporta globalmente
window.Profilo = Profilo;
