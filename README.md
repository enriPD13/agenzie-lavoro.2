# 💼 JobApp - Trova Lavoro in Veneto

Progressive Web App per la ricerca di opportunità lavorative nella Regione Veneto.

## 🎯 Caratteristiche

- ✅ **37 Agenzie per il Lavoro** - Database completo con filtri per città
- ✅ **53 Centri Per l'Impiego** - Tutte le 7 province del Veneto
- ✅ **PWA Installabile** - Funziona offline e si installa come app nativa
- ✅ **Responsive** - Ottimizzata per mobile, tablet e desktop
- ✅ **Sistema Preferiti** - Salva le tue agenzie e CPI preferiti
- ✅ **Autenticazione** - Profilo utente personalizzato

## 📂 Struttura Progetto

```
jobapp/
├── index.html              # Entry point
├── manifest.json           # Config PWA
├── css/
│   └── styles.css          # Stili personalizzati
├── js/
│   ├── main.js             # Inizializzazione
│   ├── navigation.js       # Routing
│   ├── cpi.js              # Modulo CPI
│   ├── agenzie.js          # Modulo Agenzie
│   ├── auth.js             # Autenticazione
│   └── favorites.js        # Preferiti
├── pages/
│   ├── menu.html           # Menu principale
│   ├── cpi.html            # Centri Per l'Impiego
│   ├── agenzie.html        # Agenzie
│   ├── profile.html        # Profilo
│   └── preferiti.html      # Preferiti
├── data/
│   ├── cpi.json            # Database CPI
│   └── agenzie.json        # Database Agenzie
└── images/
    ├── icon-192.png        # Icona PWA
    └── icon-512.png        # Icona PWA
```

## 🚀 Come Usare

### Opzione 1: Apri direttamente
Scarica il repository e apri `index.html` nel browser.

⚠️ **Nota:** Alcune funzionalità richiedono un server web locale.

### Opzione 2: Server Locale (Consigliato)

**Con Python:**
```bash
cd jobapp
python -m http.server 8000
```
Apri: `http://localhost:8000`

**Con Node.js:**
```bash
cd jobapp
npx serve
```

**Con VS Code:**
Installa l'estensione "Live Server" e clicca "Go Live"

## 📱 Installazione PWA

1. Apri l'app nel browser mobile
2. Chrome: Menu → "Aggiungi a Home"
3. Safari: Share → "Aggiungi a Home"

## 🛠️ Sviluppo

### Struttura Modulare
Ogni funzionalità è in un file separato per facilitare lo sviluppo:

- **Modificare CPI?** → `js/cpi.js` + `pages/cpi.html` + `data/cpi.json`
- **Modificare Agenzie?** → `js/agenzie.js` + `pages/agenzie.html` + `data/agenzie.json`
- **Cambiare colori?** → `css/styles.css`

### Aggiungere nuovi CPI
Modifica `data/cpi.json`:
```json
{
  "id": 99,
  "nome": "CPI di ...",
  "provincia": "...",
  "indirizzo": "...",
  "telefono": "...",
  "email": "..."
}
```

## 📊 Dati

- **CPI**: 53 centri in 7 province (Belluno, Padova, Rovigo, Treviso, Venezia, Verona, Vicenza)
- **Agenzie**: 37 agenzie autorizzate con sedi in tutto il Veneto

## 🎨 Design

- Gradient viola/rosa/indaco
- Menu circolare con 6 categorie
- Card espandibili con accordion
- Bottom navigation
- Safe area iOS/Android

## 📝 License

Progetto personale - Enrico © 2026

## 🤝 Contributi

Questo è un progetto personale per il territorio veneto.
Per segnalazioni: [crea una issue]

## 📞 Contatti

- **Regione Veneto**: [ClicLavoroVeneto.it](https://www.cliclavoroveneto.it)
- **Numero Unico CPI**: 049 744 8041

---

**Versione**: 1.0.0  
**Ultimo aggiornamento**: Marzo 2026
