# 🚀 GitHub Update Anleitung

## Übersicht der zu aktualisierenden Dateien

Diese Anleitung zeigt Ihnen **genau**, welche Dateien Sie auf GitHub aktualisieren müssen und wo Sie Ihre EmailJS-Codes eintragen.

---

## 📋 Schritt 1: EmailJS Codes vorbereiten

Halten Sie folgende Werte bereit (von https://dashboard.emailjs.com):

1. **Service ID**: `service_xxxxxxx`
2. **Template ID**: `template_xxxxxxx`
3. **Public Key**: `xxxxxxxxxxxxxx`

---

## 📝 Schritt 2: Dateien die aktualisiert werden müssen

### Option A: Mit .env Datei (EMPFOHLEN)

**Datei: `.env` (NEU erstellen)**
```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx
```

📍 **Speicherort:** Im Projekt-Root (gleiche Ebene wie package.json)
⚠️ **WICHTIG:** Diese Datei NICHT zu Git hinzufügen! (Ist bereits in .gitignore)

---

### Option B: Direkt im Code (Fallback)

**Datei: `src/Pyrolysis_Calculator_Bilingual.tsx`**

Suchen Sie nach Zeile ~270 und ersetzen Sie:

```typescript
// VORHER:
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

// NACHHER (mit Ihren echten Werten):
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_abc123';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_xyz789';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'abcdef123456';
```

---

## 📦 Schritt 3: Alle Dateien für GitHub Update

Hier ist die **komplette Liste** aller Dateien, die Sie committen müssen:

### Hauptdateien (MÜSSEN aktualisiert werden):
```
├── src/
│   ├── Pyrolysis_Calculator_Bilingual.tsx  ✅ Hauptkomponente mit EmailJS
│   ├── main.tsx                             ✅ Entry Point
│   └── index.css                            ✅ Styles
├── package.json                             ✅ Dependencies (inkl. EmailJS)
├── index.html                               ✅ HTML Template
├── vite.config.ts                           ✅ Vite Config
├── tsconfig.json                            ✅ TypeScript Config
├── tsconfig.node.json                       ✅ TypeScript Node Config
├── tailwind.config.js                       ✅ Tailwind Config
├── postcss.config.js                        ✅ PostCSS Config
├── .gitignore                               ✅ Git Ignore
└── .env.example                             ✅ Env Beispiel
```

### GitHub Actions (OPTIONAL):
```
└── .github/
    └── workflows/
        └── deploy.yml                       ✅ Auto-Deploy Workflow
```

### Dokumentation (EMPFOHLEN):
```
├── README.md                                ✅ Projektbeschreibung
├── EMAILJS_SETUP_ANLEITUNG.md              ✅ EmailJS Setup
├── GIT_SETUP_ANLEITUNG.md                  ✅ Git Setup
└── SCHNELLSTART.md                         ✅ Quick Start
```

---

## 🔧 Schritt 4: Git Commands zum Aktualisieren

### Erstmaliges Setup (Falls noch nicht gemacht):

```bash
# Im Projekt-Ordner
cd /pfad/zu/ihrem/projekt

# Git initialisieren (falls noch nicht gemacht)
git init

# Remote hinzufügen (falls noch nicht gemacht)
git remote add origin https://github.com/IHR-USERNAME/pyrolysis-calculator.git
```

### Update auf GitHub pushen:

```bash
# 1. Status überprüfen
git status

# 2. Alle geänderten Dateien hinzufügen
git add .

# 3. Commit mit Beschreibung
git commit -m "Update: EmailJS Integration und Lead Capture Form hinzugefügt"

# 4. Zu GitHub pushen
git push origin main
```

**Oder in einem Befehl:**
```bash
git add . && git commit -m "Update: EmailJS Integration" && git push origin main
```

---

## 🔐 Schritt 5: GitHub Secrets einrichten

Für GitHub Actions (automatisches Deployment):

1. Gehen Sie zu Ihrem Repository auf GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Klicken Sie auf **"New repository secret"**

Fügen Sie diese 3 Secrets hinzu:

### Secret 1:
- **Name:** `VITE_EMAILJS_SERVICE_ID`
- **Value:** `service_xxxxxxx` (Ihre echte Service ID)

### Secret 2:
- **Name:** `VITE_EMAILJS_TEMPLATE_ID`
- **Value:** `template_xxxxxxx` (Ihre echte Template ID)

### Secret 3:
- **Name:** `VITE_EMAILJS_PUBLIC_KEY`
- **Value:** `xxxxxxxxxxxxxx` (Ihr echter Public Key)

---

## ✅ Schritt 6: Überprüfung

Nach dem Push:

1. **Gehen Sie zu GitHub** → Ihr Repository
2. Überprüfen Sie, ob alle Dateien da sind
3. **Actions Tab** → Schauen Sie, ob der Build erfolgreich war (grüner Haken)
4. Falls deployed: Testen Sie die Live-URL

---

## 📂 Verzeichnisstruktur (Übersicht)

```
pyrolysis-calculator/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── Pyrolysis_Calculator_Bilingual.tsx  ← EmailJS Code hier!
│   ├── main.tsx
│   └── index.css
├── .env                                     ← EmailJS Codes hier! (NICHT committen)
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── EMAILJS_SETUP_ANLEITUNG.md
├── GIT_SETUP_ANLEITUNG.md
└── SCHNELLSTART.md
```

---

## 🎯 Zusammenfassung: Wo EmailJS-Codes eintragen?

### Für lokale Entwicklung:
📍 **Datei:** `.env` (im Projekt-Root erstellen)
```env
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxx
```

### Für GitHub/Production:
📍 **Ort:** GitHub Repository → Settings → Secrets → Actions
- Drei Secrets mit obigen Namen erstellen

### Als Fallback im Code:
📍 **Datei:** `src/Pyrolysis_Calculator_Bilingual.tsx` (Zeile ~270)
```typescript
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'HIER_EINTRAGEN';
```

---

## 🆘 Troubleshooting

**Problem:** "Permission denied" beim Push
```bash
# SSH-Key einrichten oder HTTPS verwenden
git remote set-url origin https://github.com/USERNAME/REPO.git
```

**Problem:** ".env wird zu Git hinzugefügt"
```bash
# Aus Git entfernen
git rm --cached .env
# Ist bereits in .gitignore, sollte nicht passieren
```

**Problem:** "Build schlägt auf GitHub fehl"
- Überprüfen Sie, ob alle 3 Secrets korrekt eingetragen sind
- Schauen Sie in den Actions-Tab für Details

---

## 📞 Support

Bei Fragen zur Integration:
- Überprüfen Sie EMAILJS_SETUP_ANLEITUNG.md
- Schauen Sie in die Browser-Console (F12) für Fehler
- Checken Sie EmailJS Dashboard → History

**Viel Erfolg! 🚀**
