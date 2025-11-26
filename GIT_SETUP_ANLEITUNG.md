# Git & GitHub Setup Anleitung

## Schritt 1: Git Repository initialisieren

Öffnen Sie ein Terminal im Projekt-Ordner und führen Sie folgende Befehle aus:

```bash
# Git Repository initialisieren
git init

# Alle Dateien zum Staging hinzufügen
git add .

# Ersten Commit erstellen
git commit -m "Initial commit: Pyrolysis Calculator v2.0 with EmailJS integration"
```

---

## Schritt 2: GitHub Repository erstellen

### Option A: Über GitHub Website

1. Gehen Sie zu [GitHub](https://github.com)
2. Klicken Sie oben rechts auf **"+"** → **"New repository"**
3. Repository-Details:
   - **Repository name:** `pyrolysis-calculator`
   - **Description:** `Economic calculator for pyrolysis plants - Biochar, CO2 removal, renewable energy`
   - **Visibility:** Private (empfohlen) oder Public
   - **NICHT** "Initialize with README" anklicken (haben wir schon)
4. Klicken Sie auf **"Create repository"**

### Option B: Über GitHub CLI

```bash
gh repo create pyrolysis-calculator --private --source=. --remote=origin --push
```

---

## Schritt 3: Repository zu GitHub pushen

Kopieren Sie die Repository-URL von GitHub (z.B. `https://github.com/username/pyrolysis-calculator.git`)

```bash
# Remote Repository hinzufügen
git remote add origin https://github.com/IHR-USERNAME/pyrolysis-calculator.git

# Branch umbenennen zu main (falls nötig)
git branch -M main

# Code zu GitHub pushen
git push -u origin main
```

---

## Schritt 4: GitHub Secrets für EmailJS einrichten

Um die EmailJS-Credentials sicher zu speichern:

1. Gehen Sie zu Ihrem GitHub Repository
2. Klicken Sie auf **"Settings"** (oben rechts)
3. Im linken Menü: **"Secrets and variables"** → **"Actions"**
4. Klicken Sie auf **"New repository secret"** für jeden dieser Werte:

### Secret 1: VITE_EMAILJS_SERVICE_ID
- Name: `VITE_EMAILJS_SERVICE_ID`
- Value: Ihre EmailJS Service ID (z.B. `service_abc123`)
- Klicken Sie auf **"Add secret"**

### Secret 2: VITE_EMAILJS_TEMPLATE_ID
- Name: `VITE_EMAILJS_TEMPLATE_ID`
- Value: Ihre EmailJS Template ID (z.B. `template_xyz789`)
- Klicken Sie auf **"Add secret"**

### Secret 3: VITE_EMAILJS_PUBLIC_KEY
- Name: `VITE_EMAILJS_PUBLIC_KEY`
- Value: Ihr EmailJS Public Key (z.B. `abcdef123456`)
- Klicken Sie auf **"Add secret"**

---

## Schritt 5: GitHub Pages aktivieren (Optional)

Falls Sie die App direkt auf GitHub Pages hosten möchten:

1. Gehen Sie zu **"Settings"** → **"Pages"**
2. Source: **"GitHub Actions"** auswählen
3. Der Workflow in `.github/workflows/deploy.yml` wird automatisch ausgeführt
4. Nach erfolgreichem Build ist die App unter verfügbar:
   ```
   https://IHR-USERNAME.github.io/pyrolysis-calculator/
   ```

---

## Schritt 6: Lokale .env Datei erstellen (für lokale Entwicklung)

```bash
# .env Datei aus Vorlage erstellen
cp .env.example .env

# .env bearbeiten und echte Werte eintragen
nano .env  # oder verwenden Sie Ihren bevorzugten Editor
```

Inhalt der `.env`:
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abcdef123456
```

**WICHTIG:** Die `.env` Datei wird NICHT zu Git hinzugefügt (ist in `.gitignore`)

---

## Schritt 7: Zukünftige Updates

Wenn Sie Änderungen vornehmen:

```bash
# Status überprüfen
git status

# Geänderte Dateien hinzufügen
git add .

# Commit mit Beschreibung
git commit -m "Beschreibung Ihrer Änderungen"

# Zu GitHub pushen
git push
```

---

## Projektstruktur nach Git-Setup

```
pyrolysis-calculator/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions Workflow
├── src/
│   ├── main.tsx
│   ├── index.css
│   └── Pyrolysis_Calculator_Bilingual.tsx
├── .env                         # Lokale Umgebungsvariablen (NICHT in Git)
├── .env.example                 # Beispiel für .env
├── .gitignore                   # Git ignore Regeln
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── EMAILJS_SETUP_ANLEITUNG.md
```

---

## Troubleshooting

### Problem: "Permission denied"
**Lösung:** Verwenden Sie HTTPS oder richten Sie SSH-Keys ein
```bash
# SSH-Key generieren
ssh-keygen -t ed25519 -C "ihre-email@example.com"

# Public Key zu GitHub hinzufügen (Settings → SSH Keys)
cat ~/.ssh/id_ed25519.pub
```

### Problem: "Repository not found"
**Lösung:** Überprüfen Sie die Repository-URL
```bash
git remote -v
git remote set-url origin https://github.com/RICHTIGE-URL.git
```

### Problem: GitHub Actions Build schlägt fehl
**Lösung:** 
1. Überprüfen Sie, ob alle Secrets korrekt eingetragen sind
2. Checken Sie die Logs im Actions-Tab
3. Stellen Sie sicher, dass die EmailJS-Credentials gültig sind

---

## Nützliche Git-Befehle

```bash
# Status anzeigen
git status

# Änderungen anzeigen
git diff

# Commit-History anzeigen
git log --oneline

# Bestimmte Datei rückgängig machen
git checkout -- dateiname

# Branch erstellen und wechseln
git checkout -b feature-name

# Branches anzeigen
git branch -a

# Pull (Updates von GitHub holen)
git pull origin main
```

---

## Best Practices

1. **Regelmäßig committen:** Kleine, häufige Commits sind besser als große, seltene
2. **Aussagekräftige Commit-Messages:** Beschreiben Sie, WAS und WARUM geändert wurde
3. **Branches nutzen:** Für neue Features eigene Branches erstellen
4. **README aktuell halten:** Dokumentation ist wichtig
5. **Secrets sicher aufbewahren:** NIEMALS API-Keys in Git committen

---

## Weitere Hilfe

- GitHub Dokumentation: https://docs.github.com
- Git Dokumentation: https://git-scm.com/doc
- GitHub Learning Lab: https://lab.github.com
