// JobApp - Agenzie Module
const Agenzie = {
  agencies: [],
  favorites: [],
  
  init() {
    console.log('🚀 Agenzie.init() START');
    setTimeout(() => {
      const loading = document.getElementById('loadingAgenzie');
      if (loading) loading.classList.add('hidden');
    }, 500);
    this.loadData();
  },
  
  async loadData() {
    console.log('📡 Fetch data/agenzie.json');
    try {
      const response = await fetch('data/agenzie.json');
      console.log('✅ Response:', response.status);
      this.agencies = await response.json();
      console.log(`✅ ${this.agencies.length} agenzie caricate`);
      this.render();
    } catch (error) {
      console.error('❌ Errore:', error);
      const grid = document.getElementById('agenciesGrid');
      if (grid) grid.innerHTML = '<div class="text-center py-12"><p class="text-red-600">Errore: ' + error.message + '</p></div>';
    }
  },
  
  render() {
    const grid = document.getElementById('agenciesGrid');
    if (!grid) { console.error('❌ agenciesGrid non trovato'); return; }
    
    const statsCards = document.getElementById('statsCards');
    if (statsCards) {
      const total = this.agencies.length;
      const sedi = this.agencies.reduce((sum, a) => sum + (a.sedi?.length || 0), 0);
      statsCards.innerHTML = `
        <div class="bg-indigo-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">${total}</div><div class="text-xs">Agenzie</div></div>
        <div class="bg-pink-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">${sedi}</div><div class="text-xs">Sedi</div></div>
        <div class="bg-blue-500 rounded-2xl p-4 text-white"><div class="text-3xl font-bold">✓</div><div class="text-xs">Attive</div></div>
      `;
    }
    
    grid.innerHTML = this.agencies.map(a => `
      <div class="bg-white rounded-3xl overflow-hidden shadow-sm">
        ${a.logo ? `<div class="h-36 bg-gray-50 flex items-center justify-center p-6"><img src="${a.logo}" alt="${a.nome}" class="max-h-28 object-contain"/></div>` : ''}
        <div class="p-5">
          <h3 class="text-xl font-bold mb-2">${a.nome}</h3>
          <p class="text-sm text-gray-600 mb-4">${a.descrizione}</p>
          ${a.sedi?.length ? `<button onclick="Agenzie.openSedi(${a.id})" class="w-full py-3 bg-indigo-600 text-white rounded-2xl font-semibold">📍 Vedi ${a.sedi.length} Sedi</button>` : ''}
          ${a.sito ? `<a href="${a.sito}" target="_blank" class="block mt-2 w-full py-3 bg-blue-500 text-white rounded-2xl font-semibold text-center">🌐 Sito Web</a>` : ''}
        </div>
      </div>
    `).join('');
  },
  
  openSedi(id) {
    const agency = this.agencies.find(a => a.id === id);
    if (!agency) return;
    
    document.getElementById('sediAgencyName').textContent = agency.nome;
    document.getElementById('sediCount').textContent = `${agency.sedi.length} sedi`;
    document.getElementById('sediContent').innerHTML = agency.sedi.map(s => `
      <div class="bg-gray-50 rounded-2xl p-4 mb-3">
        <div class="font-bold mb-2">${s.citta}</div>
        <div class="text-sm text-gray-600">
          <div>📍 ${s.indirizzo}</div>
          ${s.telefono ? `<a href="tel:${s.telefono}" class="text-indigo-600 block mt-1">📞 ${s.telefono}</a>` : ''}
        </div>
      </div>
    `).join('');
    
    const sheet = document.getElementById('sediSheet');
    sheet.classList.remove('hidden');
    setTimeout(() => sheet.querySelector('.bottom-sheet').classList.add('active'), 10);
  }
};

function closeSedi() {
  const sheet = document.getElementById('sediSheet');
  sheet.querySelector('.bottom-sheet').classList.remove('active');
  setTimeout(() => sheet.classList.add('hidden'), 300);
}
