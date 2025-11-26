# Pyrolysis Calculator - Vercel Deployment Guide

## 🚀 Schnellstart für Vercel Deployment

Dieses Projekt ist für Deployment auf Vercel vorbereitet.

### Voraussetzungen

1. **GitHub Account** - https://github.com
2. **Vercel Account** - https://vercel.com (kostenlos mit GitHub)
3. **EmailJS Credentials** (optional, aber empfohlen):
   - Service ID
   - Template ID
   - Public Key

### Schritt 1: Repository auf GitHub erstellen

1. Gehe zu https://github.com/new
2. Repository Name: `pyrolysis-calculator`
3. Beschreibung: "Wirtschaftlichkeitsrechner für Pyrolyseanlagen"
4. Wähle: **Public** (für kostenloses Deployment)
5. Klick "Create repository"

### Schritt 2: Code auf GitHub pushen

```powershell
cd "c:\Users\th\OneDrive\Documents\Entwicklung\BCR Calculator\pyrolysis-calculator-deploy"

# Git initialisieren
git init
git add .
git commit -m "Initial commit: Pyrolysis Calculator v2.0"
git branch -M main

# Remote Repository hinzufügen (ersetze USERNAME mit deinem GitHub-Namen)
git remote add origin https://github.com/USERNAME/pyrolysis-calculator.git
git push -u origin main
```

### Schritt 3: Vercel Deployment

1. **Gehe zu https://vercel.com** und logge dich mit GitHub ein
2. Klick "New Project"
3. Wähle dein Repository `pyrolysis-calculator`
4. Vercel erkennt automatisch:
   - ✅ Framework: Vite
   - ✅ Build Command: `npm run build`
   - ✅ Output Directory: `dist`

### Schritt 4: Environment Variables setzen

1. Im Vercel Dashboard: Projekt öffnen
2. Gehe zu **Settings** → **Environment Variables**
3. Füge diese Variablen hinzu:

```
VITE_EMAILJS_SERVICE_ID = dein_service_id
VITE_EMAILJS_TEMPLATE_ID = dein_template_id
VITE_EMAILJS_PUBLIC_KEY = dein_public_key
```

4. Klick "Save"

### Schritt 5: Deploy!

Dein Projekt wird automatisch deployed! 🎉

**Deine App wird erreichbar unter:**
```
https://pyrolysis-calculator.vercel.app
```

---

## 🔄 Weitere Deployments

Bei jedem Push zu `main` wird automatisch neu deployed:

```powershell
# Änderungen machen
git add .
git commit -m "Deine Änderungen"
git push origin main

# Vercel deployed automatisch! 🚀
```

---

## 📊 Domain benutzerdefiniert konfigurieren

Um eine eigene Domain zu nutzen (z.B. `calculator.decarbo-engineering.com`):

1. Im Vercel Dashboard: **Settings** → **Domains**
2. Gib deine Domain ein
3. Folge den DNS-Konfigurationsanweisungen
4. Fertig! 🎉

---

## 🆘 Troubleshooting

### Problem: Build fehlgeschlagen
- Überprüfe die Logs in Vercel
- Stelle sicher, dass alle Environment Variables gesetzt sind
- Versuche lokal: `npm run build`

### Problem: EmailJS sendet keine Mails
- Überprüfe die Environment Variables in Vercel
- Prüfe dein EmailJS Dashboard

### Problem: App zeigt leere Seite
- Öffne Browser DevTools (F12)
- Prüfe die Console auf Fehler
- Kontrolliere die Vercel Logs

---

## 📧 EmailJS Setup (falls noch nicht konfiguriert)

1. Gehe zu https://www.emailjs.com
2. Erstelle kostenlos einen Account
3. Verbinde deinen Email-Service
4. Erstelle ein Email Template (siehe EMAILJS_SETUP_ANLEITUNG.md)
5. Kopiere die IDs in die Vercel Environment Variables

---

## ✅ Checkliste vor Deployment

- [ ] `.env` ist im `.gitignore` (nicht commiten!)
- [ ] `.env.example` ist vorbereitet
- [ ] `package.json` hat korrekte Version
- [ ] `npm run build` läuft lokal fehlerfrei
- [ ] GitHub Repository erstellt
- [ ] Code zu GitHub gepusht
- [ ] Vercel Project verbunden
- [ ] Environment Variables in Vercel gesetzt
- [ ] Deploy erfolgreich

---

**Status:** ✅ Bereit für Vercel Deployment!

