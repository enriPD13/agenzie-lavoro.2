// ============================================
// JobApp - Agenzie Module COMPLETO
// Estratto dal file originale funzionante
// ============================================

let agencies = [];
let favorites = [];
let searchTerm = '';
let currentAgency = null;

// Carica i dati
async function loadAgenzieData() {
  try {
    const response = await fetch('data/agenzie.json');
    if (!response.ok) throw new Error('Errore caricamento');
    
    agencies = await response.json();
    console.log(`📊 Caricate ${agencies.length} agenzie`);
    
    loadFavorites();
    renderStats();
    renderAgencies();
  } catch (error) {
    console.error('❌ Errore caricamento agenzie:', error);
    showError();
  }
}

// Renderizza statistiche
function renderStats() {
  const statsCards = document.getElementById('statsCards');
  if (!statsCards) return;
  
  const totalAgenzie = agencies.length;
  const totalSedi = agencies.reduce((sum, a) => sum + (a.sedi ? a.sedi.length : 0), 0);
  const totalSettori = new Set(agencies.flatMap(a => a.settori || [])).size;
  
  statsCards.innerHTML = `
    <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
      <div class="text-3xl font-bold">${totalAgenzie}</div>
      <div class="text-xs opacity-90">Agenzie</div>
    </div>
    <div class="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-4 text-white">
      <div class="text-3xl font-bold">${totalSedi}</div>
      <div class="text-xs opacity-90">Sedi</div>
    </div>
    <div class="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white">
      <div class="text-3xl font-bold">${totalSettori}</div>
      <div class="text-xs opacity-90">Settori</div>
    </div>
  `;
}

// Renderizza agenzie
function renderAgencies() {
  const grid = document.getElementById('agenciesGrid');
  const empty = document.getElementById('emptyState');
  
  if (!grid) return;
  
  if (agencies.length === 0) {
    if (grid) grid.classList.add('hidden');
    if (empty) empty.classList.remove('hidden');
    return;
  }
  
  if (empty) empty.classList.add('hidden');
  grid.classList.remove('hidden');
  
  const sortedAgencies = [...agencies].sort((a, b) => a.nome.localeCompare(b.nome));
  
  grid.innerHTML = sortedAgencies.map((a, i) => `
    <div class="card-appear bg-white rounded-3xl overflow-hidden shadow-sm" style="animation-delay: ${i * 0.05}s">
      ${a.logo ? `
        <div class="h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
          <img src="${a.logo}" alt="${a.nome}" class="max-h-28 max-w-full object-contain" onerror="this.parentElement.innerHTML='<div class=&quot;w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl font-bold&quot;>${a.nome.substring(0, 2)}</div>'"/>
        </div>
      ` : ''}
      
      <div class="p-5">
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-xl font-bold text-gray-900 flex-1">${a.nome}</h3>
          <button onclick="toggleFavorite(${a.id})" class="ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isFavorite(a.id) ? 'bg-yellow-100' : 'bg-gray-100'}">
            <svg class="w-6 h-6 ${isFavorite(a.id) ? 'text-yellow-500' : 'text-gray-400'}" fill="${isFavorite(a.id) ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
          </button>
        </div>
        
        ${a.settori && a.settori.length > 0 ? `
          <div class="flex flex-wrap gap-2 mb-3">
            ${a.settori.slice(0, 2).map(s => `
              <span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                ${s}
              </span>
            `).join('')}
            ${a.settori.length > 2 ? `<span class="text-xs text-gray-500 self-center">+${a.settori.length - 2}</span>` : ''}
          </div>
        ` : ''}
        
        <p class="text-sm text-gray-600 mb-4 line-clamp-2">${a.descrizione}</p>
        
        <div class="flex gap-2">
          ${a.sedi && a.sedi.length > 0 ? `
            <button onclick="openSedi(${a.id})" class="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Vedi ${a.sedi.length} ${a.sedi.length === 1 ? 'Sede' : 'Sedi'}
            </button>
          ` : ''}
          ${a.formIscrizione ? `
            <a href="${a.formIscrizione}" target="_blank" class="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2">
              ✉️ Candidati
            </a>
          ` : ''}
        </div>
        
        ${a.sito ? `
          <a href="${a.sito}" target="_blank" class="mt-3 block w-full py-3 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl font-semibold text-sm text-center flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Cerca Offerte di Lavoro
          </a>
        ` : ''}
      </div>
    </div>
  `).join('');
}

// Apri bottom sheet sedi
function openSedi(id) {
  currentAgency = agencies.find(a => a.id === id);
  if (!currentAgency) return;
  
  document.getElementById('sediAgencyName').textContent = currentAgency.nome;
  document.getElementById('sediCount').textContent = `${currentAgency.sedi.length} ${currentAgency.sedi.length === 1 ? 'sede' : 'sedi'} in Veneto`;
  
  const sortedSedi = [...currentAgency.sedi].sort((a, b) => {
    const provA = getProvincia(a);
    const provB = getProvincia(b);
    if (provA !== provB) return provA.localeCompare(provB);
    return (a.citta || '').localeCompare(b.citta || '');
  });
  
  let currentProv = '';
  const sediHtml = sortedSedi.map(s => {
    const prov = getProvincia(s);
    let html = '';
    
    if (prov !== currentProv && prov !== 'ZZ') {
      if (currentProv !== '') html += '<div class="h-px bg-gray-200 my-4"></div>';
      html += `<div class="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-3">Provincia di ${getProvinciaName(prov)}</div>`;
      currentProv = prov;
    }
    
    html += `
      <div class="bg-gray-50 rounded-2xl p-4 mb-3">
        <div class="font-bold text-gray-900 mb-2">${s.citta}</div>
        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
            <span>${s.indirizzo}</span>
          </div>
          ${s.telefono ? `
            <a href="tel:${s.telefono}" class="flex items-center gap-2 text-indigo-600">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              ${s.telefono}
            </a>
          ` : ''}
          ${s.email ? `
            <a href="mailto:${s.email}" class="flex items-center gap-2 text-indigo-600 break-all">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              ${s.email}
            </a>
          ` : ''}
          ${s.googleMaps ? `
            <a href="${s.googleMaps}" target="_blank" class="flex items-center gap-2 text-indigo-600 font-medium">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              Vedi su Maps
            </a>
          ` : ''}
        </div>
      </div>
    `;
    return html;
  }).join('');
  
  document.getElementById('sediContent').innerHTML = sediHtml;
  
  const sheet = document.getElementById('sediSheet');
  const bottomSheet = sheet.querySelector('.bottom-sheet');
  sheet.classList.remove('hidden');
  setTimeout(() => bottomSheet.classList.add('active'), 10);
}

// Chiudi bottom sheet
function closeSedi() {
  const sheet = document.getElementById('sediSheet');
  const bottomSheet = sheet.querySelector('.bottom-sheet');
  bottomSheet.classList.remove('active');
  setTimeout(() => sheet.classList.add('hidden'), 300);
}

// Ricerca per località
function searchByLocation(location) {
  if (!location || location.trim() === '') return;
  
  const term = location.toLowerCase().trim();
  const results = [];
  
  agencies.forEach(agency => {
    if (!agency.sedi) return;
    const matchingSedi = agency.sedi.filter(sede => 
      sede.citta.toLowerCase().includes(term)
    );
    if (matchingSedi.length > 0) {
      results.push({ agency: agency, sedi: matchingSedi });
    }
  });
  
  if (results.length === 0) {
    alert(`Nessuna sede trovata per "${location}"`);
    return;
  }
  
  // Mostra pagina risultati (da implementare se necessario)
  console.log('Risultati:', results);
}

// Gestione preferiti
function toggleFavorite(id) {
  if (isFavorite(id)) {
    favorites = favorites.filter(fid => fid !== id);
  } else {
    favorites.push(id);
  }
  saveFavorites();
  renderAgencies();
}

function isFavorite(id) {
  return favorites.includes(id);
}

function loadFavorites() {
  const stored = localStorage.getItem('agenzie_favorites');
  favorites = stored ? JSON.parse(stored) : [];
}

function saveFavorites() {
  localStorage.setItem('agenzie_favorites', JSON.stringify(favorites));
}

// Utility provincia
function getProvincia(sede) {
  const map = {
    'BL': 'BL', 'PD': 'PD', 'RO': 'RO', 'TV': 'TV',
    'VE': 'VE', 'VR': 'VR', 'VI': 'VI'
  };
  
  for (const [key, val] of Object.entries(map)) {
    if (sede.indirizzo && sede.indirizzo.includes(key)) return val;
  }
  return 'ZZ';
}

function getProvinciaName(sigla) {
  const nomi = {
    'BL': 'Belluno', 'PD': 'Padova', 'RO': 'Rovigo', 'TV': 'Treviso',
    'VE': 'Venezia', 'VR': 'Verona', 'VI': 'Vicenza'
  };
  return nomi[sigla] || sigla;
}

// Mostra errore
function showError() {
  const grid = document.getElementById('agenciesGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="text-center py-12">
        <div class="text-6xl mb-4">😕</div>
        <h3 class="text-xl font-bold mb-2">Errore Caricamento</h3>
        <p class="text-gray-600">Impossibile caricare le agenzie</p>
      </div>
    `;
  }
}

// Setup listeners
function setupListeners() {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      if (searchTerm.length > 0 && clearBtn) {
        clearBtn.classList.remove('hidden');
      } else if (clearBtn) {
        clearBtn.classList.add('hidden');
      }
    });
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchByLocation(searchTerm);
      }
    });
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchTerm = '';
      clearBtn.classList.add('hidden');
    });
  }
}

// Inizializza quando la pagina agenzie viene caricata
const Agenzie = {
  init: function() {
    console.log('✅ Agenzie module inizializzato');
    loadAgenzieData();
    setupListeners();
  }
};
