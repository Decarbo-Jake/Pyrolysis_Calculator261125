# GitHub Deployment - Schritt für Schritt

## 📋 Für die Vercel-Veröffentlichung benötigst du:

### ✅ 1. GitHub Repository erstellen

Öffne: https://github.com/new

**Fülle folgendes aus:**
- **Repository name:** `pyrolysis-calculator`
- **Description:** Wirtschaftlichkeitsrechner für Pyrolyseanlagen
- **Visibility:** PUBLIC (wichtig für kostenloses Vercel Deployment!)
- Andere Optionen kannst du ignorieren

Klick: **Create repository**

---

### ✅ 2. Lokale Git-Konfiguration

Öffne PowerShell im Projekt-Ordner:

```powershell
cd "c:\Users\th\OneDrive\Documents\Entwicklung\BCR Calculator\pyrolysis-calculator-deploy"
```

Überprüfe deine Git-Konfiguration:

```powershell
git config --global user.name "Dein Name"
git config --global user.email "deine.email@example.com"
```

---

### ✅ 3. Repository initialisieren & Pushen

```powershell
# Git Repository initialisieren
git init

# Alle Dateien hinzufügen
git add .

# Initial Commit
git commit -m "Initial commit: Pyrolysis Calculator v2.0.0 - Ready for production"

# Branch in 'main' umbenennen
git branch -M main

# Remote Repository hinzufügen
# WICHTIG: Ersetze USERNAME mit deinem GitHub-Benutzernamen!
git remote add origin https://github.com/USERNAME/pyrolysis-calculator.git

# Zum GitHub pushen
git push -u origin main
```

---

### ✅ 4. GitHub Token (falls nötig)

Falls du nach Passwort gefragt wirst:

1. Gehe zu: https://github.com/settings/tokens/new
2. Token Name: "Vercel Deployment"
3. Wähle: `repo` Scope
4. Generiere Token
5. Kopiere ihn und nutze ihn statt Passwort

---

### ✅ 5. Ergebnis überprüfen

Nach erfolgreichem Push sollte dein Repository hier sichtbar sein:
```
https://github.com/USERNAME/pyrolysis-calculator
```

---

## 🎯 Nächste Schritte nach GitHub Push

1. Gehe zu https://vercel.com
2. Logge dich mit GitHub ein
3. Klick "New Project"
4. Wähle `pyrolysis-calculator`
5. Konfiguriere Environment Variables
6. Deploy!

---

## 🔑 Environment Variables für Vercel

In Vercel Dashboard → Settings → Environment Variables:

```
VITE_EMAILJS_SERVICE_ID = service_xxxxx
VITE_EMAILJS_TEMPLATE_ID = template_xxxxx
VITE_EMAILJS_PUBLIC_KEY = public_key_xxxxx
```

Diese Werte findest du in deiner `.env` Datei lokal.

---

## ⚠️ Wichtig: .env nicht commiten!

Deine `.env` Datei mit echten Credentials darf **NICHT** auf GitHub landen!

Das ist bereits im `.gitignore` eingestellt. Überprüfe:

```powershell
cat .gitignore | grep .env
```

Output sollte sein:
```
# Environment variables
.env
.env.local
```

---

## ✅ Checkliste

- [ ] GitHub Account erstellt
- [ ] Repository auf GitHub erstellt
- [ ] Git lokal konfiguriert
- [ ] Code gepusht zu GitHub
- [ ] `.env` ist **NICHT** auf GitHub
- [ ] Repository ist PUBLIC
- [ ] Environment Variables vorbereitet

---

**Nach diesen Schritten kannst du direkt mit Vercel deployen!** 🚀

