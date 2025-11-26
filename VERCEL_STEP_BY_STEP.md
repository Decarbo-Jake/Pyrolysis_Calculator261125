# Vercel Deployment - Komplette Anleitung

## 🎯 Übersicht der Schritte

```
1. GitHub Setup              (5 min)
   ↓
2. Code zu GitHub pushen    (2 min)
   ↓
3. Vercel Projekt erstellen (3 min)
   ↓
4. Environment Variables    (2 min)
   ↓
5. Deployment               (automatisch)
   ↓
🎉 App ist live!
```

---

## 📍 Schritt 1: GitHub Repository vorbereiten

### 1.1 Repository erstellen

Öffne: https://github.com/new

**Konfiguration:**
- Repository name: **`pyrolysis-calculator`**
- Description: `Wirtschaftlichkeitsrechner für Pyrolyseanlagen - DECARBO`
- Public/Private: **PUBLIC** ⭐ (wichtig!)
- Initialize repository: NICHT anwählen
- Create repository

### 1.2 Lokale Git-Konfiguration

```powershell
# Prüfe Git Installation
git --version

# Konfiguriere deinen Namen
git config --global user.name "Dein Name"
git config --global user.email "deine.email@decarbo-engineering.com"

# Verifizierung
git config --global user.name
git config --global user.email
```

---

## 📍 Schritt 2: Code zu GitHub pushen

### 2.1 Terminal öffnen

```powershell
cd "c:\Users\th\OneDrive\Documents\Entwicklung\BCR Calculator\pyrolysis-calculator-deploy"
```

### 2.2 Git Repository initialisieren

```powershell
git init
git add .
git commit -m "Initial commit: Pyrolysis Calculator v2.0.0 - Production Ready"
git branch -M main
```

### 2.3 Mit GitHub verbinden und pushen

```powershell
# Ersetze USERNAME mit deinem GitHub-Benutzernamen!
git remote add origin https://github.com/USERNAME/pyrolysis-calculator.git
git push -u origin main
```

**Wenn du nach Passwort gefragt wirst:**

Option 1: GitHub Personal Access Token (empfohlen)
- Gehe zu: https://github.com/settings/tokens/new
- Name: "Vercel Deployment"
- Scope: Wähle `repo`
- Generate token → Kopieren
- Nutze diesen Token als "Passwort"

Option 2: SSH Key (fortgeschrittene Nutzer)
- Siehe: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### 2.4 Ergebnis überprüfen

Öffne: https://github.com/USERNAME/pyrolysis-calculator

Du solltest all deine Dateien sehen ✓

---

## 📍 Schritt 3: Vercel Projekt erstellen

### 3.1 Bei Vercel anmelden

Öffne: https://vercel.com

Klick: **"Sign up"** → **"Continue with GitHub"**

Autorisiere Vercel für GitHub

### 3.2 Projekt importieren

Nach erfolgreicher Anmeldung siehst du das Dashboard.

Klick: **"New Project"**

Vercel zeigt deine GitHub Repositories. Wähle: **`pyrolysis-calculator`**

### 3.3 Projekt konfigurieren

Vercel erkennt automatisch:
- ✅ Framework: **Vite**
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

**Diese Einstellungen sind korrekt. Keine Änderungen nötig!**

---

## 📍 Schritt 4: Environment Variables setzen

### 4.1 Vercel Dashboard öffnen

Du bist noch im Projekt-Setup. Scroll nach unten zu:

**"Environment Variables"**

### 4.2 Variablen hinzufügen

Für jede Variable:
1. Click "Add"
2. Name eingeben
3. Value eingeben (aus deiner lokalen `.env`)

**Variablen, die du eintragen musst:**

```
VITE_EMAILJS_SERVICE_ID = service_xxxxxxxxx
```
```
VITE_EMAILJS_TEMPLATE_ID = template_xxxxxxxxx
```
```
VITE_EMAILJS_PUBLIC_KEY = public_key_xxxxxxxxx
```

**Wo findest du diese Werte?**

1. Öffne lokal: `.env` Datei
2. Kopiere die Werte rechts vom `=`
3. Einfügen in Vercel

Beispiel aus `.env`:
```
VITE_EMAILJS_SERVICE_ID=service_xyz123
```
→ Vercel: `service_xyz123` (ohne Anführungszeichen!)

### 4.3 Speichern

Nach jeder Variable: **Automatisch gespeichert**

---

## 📍 Schritt 5: Deployment starten

### 5.1 Deploy Button

Oben rechts: Klick **"Deploy"**

Vercel startet automatisch:
1. Repository wird geklont
2. Dependencies werden installiert (`npm install`)
3. Build wird erstellt (`npm run build`)
4. Auf Server deployed

### 5.2 Deployment verfolgen

Du siehst eine Fortschrittsanzeige:
```
✓ Building...
✓ Installing dependencies...
✓ Creating optimized production build...
✓ Uploading build to edge nodes...
✓ Ready!
```

**Dauer:** ca. 2-3 Minuten

---

## 🎉 Erfolg!

Nach erfolgreichem Deployment:

**Deine App ist live unter:**
```
https://pyrolysis-calculator.vercel.app
```

Klick: **"Visit"** um die App zu öffnen

---

## 📊 Nach dem ersten Deployment

### Zukünftige Updates

Jedes Mal wenn du Code änderst:

```powershell
git add .
git commit -m "Meine Änderungen"
git push origin main
```

→ Vercel deployed **automatisch** neu! 🚀

### Mit eigener Domain

1. Im Vercel Dashboard: **Settings** → **Domains**
2. Deine Domain eingeben (z.B. `calculator.decarbo-engineering.com`)
3. DNS-Einstellungen konfigurieren (siehe Anleitung in Vercel)
4. Fertig!

### Monitoring

Im Vercel Dashboard kannst du sehen:
- ✓ Deployment-Logs
- ✓ Fehler und Warnungen
- ✓ Performance-Metriken
- ✓ Besucherzahlen

---

## 🆘 Häufige Probleme

### Problem: "Build failed"

**Lösung:**
1. Öffne die Vercel Logs (klick auf den Build)
2. Suche nach rot markierten Fehlern
3. Behebe den Fehler lokal (`npm run build`)
4. Push zu GitHub
5. Vercel deployed automatisch neu

### Problem: "Invalid environment variables"

**Lösung:**
- Überprüfe die Werte in `.env` (lokal)
- Stelle sicher, dass es keine Anführungszeichen gibt
- Prüfe auf Leerzeichen am Anfang/Ende
- Wert kopiert? → In Vercel einfügen → Speichern

### Problem: "EmailJS funktioniert nicht"

**Lösung:**
- Öffne https://www.emailjs.com/dashboard
- Überprüfe Service/Template ID
- Kopiere neuen Public Key (wenn nötig)
- Aktualisiere in Vercel Environment Variables
- Vercel wird automatisch neu deployed

### Problem: "App zeigt leere Seite"

**Lösung:**
1. Öffne Browser DevTools (F12)
2. Gehe zu "Console"
3. Suche nach Fehlern (rot)
4. Lies die Fehlermeldung
5. Kontakt aufnehmen mit Error-Details

---

## ✅ Komplette Checkliste

- [ ] GitHub Account erstellt
- [ ] GitHub Repository "pyrolysis-calculator" erstellt (PUBLIC)
- [ ] Git konfiguriert (name, email)
- [ ] Code zu GitHub gepusht (`git push`)
- [ ] Repository auf GitHub sichtbar
- [ ] Vercel Account erstellt (mit GitHub)
- [ ] Projekt in Vercel importiert
- [ ] Environment Variables gesetzt:
  - [ ] VITE_EMAILJS_SERVICE_ID
  - [ ] VITE_EMAILJS_TEMPLATE_ID
  - [ ] VITE_EMAILJS_PUBLIC_KEY
- [ ] Deployment gestartet
- [ ] App unter https://pyrolysis-calculator.vercel.app erreichbar

---

## 📞 Kontakt & Support

Wenn etwas nicht funktioniert:

1. **Vercel Logs prüfen** (Errors sehen)
2. **Browser Console prüfen** (F12 → Console)
3. **EmailJS Dashboard prüfen** (bei Email-Problemen)
4. **GitHub prüfen** (Code wirklich gepusht?)

Bei weiteren Fragen: th@decarbo-engineering.com

---

**🎉 Herzlichen Glückwunsch zu deinem Deployment!**

Deine Pyrolysis Calculator App ist jetzt worldwide verfügbar! 🚀

