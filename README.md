# Pyrolysis Plant Economic Calculator

![Version](https://img.shields.io/badge/version-2.0.0-green)
![License](https://img.shields.io/badge/license-UNLICENSED-red)

Umfassender Wirtschaftlichkeitsrechner für Pyrolyseanlagen zur Produktion von Biochar, CO₂-Entnahme-Zertifikaten, Wärme, Strom und Bio-Öl.

**Entwickelt von:** Decarbo-Engineering GmbH  
**Website:** [www.decarbo-engineering.com](https://www.decarbo-engineering.com)

---

## 🌟 Features

- ✅ **Bilingual**: Vollständige Unterstützung für Deutsch und Englisch
- 📊 **Interaktive Visualisierungen**: Cashflow-Analysen, Erlösverteilung, Kostenvergleiche
- 📄 **PDF-Export**: Professionelle PDF-Berichte mit allen Parametern und Ergebnissen
- 📧 **Lead Capture**: Automatische E-Mail-Benachrichtigung bei PDF-Generierung
- 🎨 **Modern Design**: Dunkles Theme mit Decarbo-Branding
- 📱 **Responsive**: Funktioniert auf Desktop, Tablet und Mobile
- ⚡ **Echtzeit-Berechnung**: Sofortige Aktualisierung aller Kennzahlen

---

## 🚀 Schnellstart

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn

### Installation

1. **Repository klonen:**
```bash
git clone https://github.com/your-username/pyrolysis-calculator.git
cd pyrolysis-calculator
```

2. **Dependencies installieren:**
```bash
npm install
```

3. **EmailJS konfigurieren:**
```bash
cp .env.example .env
```

Öffnen Sie `.env` und tragen Sie Ihre EmailJS-Credentials ein:
```env
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxx
```

4. **Entwicklungsserver starten:**
```bash
npm run dev
```

Die App ist nun unter `http://localhost:3000` erreichbar.

---

## 📧 EmailJS Setup

Detaillierte Anleitung zur Einrichtung von EmailJS finden Sie in:
- [EMAILJS_SETUP_ANLEITUNG.md](./EMAILJS_SETUP_ANLEITUNG.md)

**Kurzanleitung:**

1. Erstellen Sie einen Account bei [EmailJS](https://www.emailjs.com/)
2. Verbinden Sie Ihren E-Mail-Service (Gmail, Outlook, etc.)
3. Erstellen Sie ein E-Mail-Template (siehe Anleitung)
4. Kopieren Sie Service ID, Template ID und Public Key in `.env`
5. Die App sendet automatisch E-Mails an `th@decarbo-engineering.com` bei jeder PDF-Generierung

---

## 🏗️ Projektstruktur

```
pyrolysis-calculator/
├── src/
│   ├── main.tsx                              # Entry point
│   ├── index.css                             # Global styles (Tailwind)
│   └── Pyrolysis_Calculator_Bilingual.tsx    # Hauptkomponente
├── index.html                                # HTML template
├── package.json                              # Dependencies
├── vite.config.ts                            # Vite configuration
├── tsconfig.json                             # TypeScript configuration
├── tailwind.config.js                        # Tailwind CSS configuration
├── postcss.config.js                         # PostCSS configuration
├── .env.example                              # Beispiel-Umgebungsvariablen
├── .gitignore                                # Git ignore rules
├── EMAILJS_SETUP_ANLEITUNG.md               # EmailJS Setup-Anleitung
└── README.md                                 # Diese Datei
```

---

## 🛠️ Verwendete Technologien

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **Recharts** - Diagramme und Visualisierungen
- **jsPDF** - PDF-Generierung
- **html2canvas** - Chart-Screenshots für PDF
- **EmailJS** - E-Mail-Versand
- **Lucide React** - Icons

---

## 📊 Berechnungslogik

Der Rechner ermittelt folgende Kennzahlen:

### Finanzielle Kennzahlen
- **NPV (Net Present Value)**: Kapitalwert über die Projektlaufzeit
- **IRR (Internal Rate of Return)**: Interner Zinsfuß
- **Payback Period**: Amortisationszeit in Jahren
- **Annual Cash Flow**: Jährlicher Cashflow

### Produktströme
1. **Biochar (Pflanzenkohle)**: 
   - Direktverkauf
   - CO₂-Entnahme-Zertifikate (basierend auf LCA-Faktor)
   
2. **Wärme** (optional):
   - Basierend auf 45% thermischer Wirkungsgrad
   - Anpassbarer Verkaufsanteil
   
3. **Strom** (optional):
   - Variable Stromausbeute
   - Anpassbarer Verkaufspreis
   
4. **Bio-Öl** (optional):
   - Variable Ausbeute
   - Anpassbarer Verkaufspreis

---

## 🎯 Verwendung

### Grundlegende Bedienung

1. **Produktauswahl**: Wählen Sie die zu produzierenden Produkte
2. **Parameter anpassen**: Nutzen Sie die Schieberegler für alle Parameter
3. **Ergebnisse ansehen**: Kennzahlen und Diagramme aktualisieren sich automatisch
4. **PDF generieren**: 
   - Name und E-Mail eingeben
   - "PDF-Bericht erstellen" klicken
   - PDF wird heruntergeladen
   - E-Mail wird automatisch an Decarbo gesendet

### Parameter-Kategorien

**Grundparameter:**
- Anlagendurchsatz (kg/h)
- Heizwert des Brennstoffs (kWh/kg)
- Volllaststunden/Jahr
- Projektlaufzeit (Jahre)
- Elektrische Nennleistung (kW)
- Strompreis für Verbrauch

**Investition & Kosten:**
- Gesamtinvestitionskosten
- Kalkulationszins
- Rohstoffkosten
- Personalkosten
- Wartungskosten

**Biochar-Parameter:**
- Ausbeute (% vom Rohstoff)
- Verkaufspreis
- LCA-Faktor für CO₂-Zertifikate
- CO₂-Removal Credit Preis

**Weitere Produktparameter:**
- Wärme: Verkaufsanteil, Preis
- Strom: Ausbeute, Preis, Investition
- Bio-Öl: Ausbeute, Preis, Investition

---

## 🔧 Entwicklung

### Verfügbare Scripts

```bash
# Entwicklungsserver starten
npm run dev

# Production Build erstellen
npm run build

# Build-Vorschau
npm run preview
```

### Code-Anpassungen

**EmailJS-Konfiguration ändern:**
Öffnen Sie `src/Pyrolysis_Calculator_Bilingual.tsx` und suchen Sie nach:
```typescript
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
```

**Übersetzungen anpassen:**
Die Übersetzungen befinden sich im `translations`-Objekt am Anfang der Komponente.

**Farben anpassen:**
Tailwind-Konfiguration in `tailwind.config.js` bearbeiten.

---

## 📦 Deployment

### Vercel (Empfohlen)

1. Repository auf GitHub pushen
2. Bei [Vercel](https://vercel.com) anmelden
3. "New Project" → Repository auswählen
4. Environment Variables hinzufügen:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
5. Deploy!

### Netlify

1. Repository auf GitHub pushen
2. Bei [Netlify](https://netlify.com) anmelden
3. "New site from Git" → Repository auswählen
4. Build Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. Environment Variables hinzufügen
6. Deploy!

### Andere Plattformen

Die App ist eine Standard-Vite-React-App und kann auf jeder Plattform deployed werden, die Node.js unterstützt.

---

## 🐛 Troubleshooting

### Problem: "Module not found" Fehler
**Lösung:** 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: EmailJS sendet keine E-Mails
**Lösung:**
1. Überprüfen Sie die Environment Variables
2. Checken Sie die Browser-Console auf Fehler
3. Überprüfen Sie das EmailJS Dashboard → History
4. Stellen Sie sicher, dass das Template korrekt konfiguriert ist

### Problem: PDF enthält keine Charts
**Lösung:**
- Charts benötigen einen Moment zum Rendern
- Warten Sie ~500ms bevor Sie das PDF generieren
- Dies ist bereits im Code implementiert

### Problem: Styling sieht falsch aus
**Lösung:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 📄 Lizenz

Dieses Projekt ist proprietär und gehört Decarbo-Engineering GmbH.  
**Alle Rechte vorbehalten.**

Nicht lizenziert für öffentliche oder kommerzielle Nutzung ohne ausdrückliche Genehmigung.

---

## 📞 Kontakt

**Decarbo-Engineering GmbH**  
Eupener Str. 9  
53117 Bonn  
Deutschland

📧 E-Mail: th@decarbo-engineering.com  
🌐 Website: [www.decarbo-engineering.com](https://www.decarbo-engineering.com)

---

## 🙏 Danksagungen

- Recharts für die exzellente Chart-Library
- EmailJS für den unkomplizierten E-Mail-Service
- Lucide für die schönen Icons
- Tailwind CSS für das flexible Styling-System

---

**Version:** 2.0.0  
**Letztes Update:** November 2024  
**Status:** Production Ready ✅
