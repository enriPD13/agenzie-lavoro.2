// JobApp - Main Application
const AppMain = {
  currentPage: 'menu',
  
  init() {
    console.log('🚀 JobApp inizializzata');
    this.loadPage('menu');
  },
  
  loadPage(pageName) {
    Navigation.loadPage(pageName);
  }
};
