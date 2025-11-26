# ✅ GitHub Update Checklist

## Vor dem Update

- [ ] EmailJS Service ID bereit: `service_________`
- [ ] EmailJS Template ID bereit: `template_________`
- [ ] EmailJS Public Key bereit: `______________`
- [ ] Git installiert und konfiguriert
- [ ] GitHub Repository existiert

---

## Dateien aktualisieren

### Pflicht-Dateien (MÜSSEN auf GitHub):
- [ ] `src/Pyrolysis_Calculator_Bilingual.tsx`
- [ ] `src/main.tsx`
- [ ] `src/index.css`
- [ ] `package.json`
- [ ] `index.html`
- [ ] `vite.config.ts`
- [ ] `tsconfig.json`
- [ ] `tsconfig.node.json`
- [ ] `tailwind.config.js`
- [ ] `postcss.config.js`
- [ ] `.gitignore`
- [ ] `.env.example`

### Optional (aber empfohlen):
- [ ] `README.md`
- [ ] `EMAILJS_SETUP_ANLEITUNG.md`
- [ ] `GIT_SETUP_ANLEITUNG.md`
- [ ] `SCHNELLSTART.md`
- [ ] `.github/workflows/deploy.yml`

---

## EmailJS Konfiguration

### Lokale Entwicklung:
- [ ] `.env` Datei erstellt (im Projekt-Root)
- [ ] Service ID in `.env` eingetragen
- [ ] Template ID in `.env` eingetragen
- [ ] Public Key in `.env` eingetragen
- [ ] `.env` ist in `.gitignore` (wird NICHT zu Git hinzugefügt)

### GitHub Secrets:
- [ ] Zu GitHub Repository → Settings → Secrets → Actions
- [ ] Secret `VITE_EMAILJS_SERVICE_ID` erstellt
- [ ] Secret `VITE_EMAILJS_TEMPLATE_ID` erstellt
- [ ] Secret `VITE_EMAILJS_PUBLIC_KEY` erstellt

---

## Git Commands

### Erstmalig:
```bash
git init
git add .
git commit -m "Initial commit: Pyrolysis Calculator v2.0"
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

### Update:
```bash
git add .
git commit -m "Update: EmailJS Integration"
git push origin main
```

---

## Nach dem Push

- [ ] GitHub Repository aktualisiert
- [ ] Alle Dateien sind auf GitHub sichtbar
- [ ] GitHub Actions Build erfolgreich (grüner Haken)
- [ ] Secrets korrekt eingetragen
- [ ] App lokal getestet (`npm run dev`)
- [ ] EmailJS sendet Test-E-Mail erfolgreich

---

## Test-Durchlauf

### Lokal testen:
```bash
cd /pfad/zum/projekt
npm install
cp .env.example .env
# .env mit echten Werten füllen
npm run dev
```

### In der App testen:
- [ ] Parameter verstellt
- [ ] Name und E-Mail eingegeben
- [ ] "PDF-Bericht erstellen" geklickt
- [ ] PDF wurde heruntergeladen
- [ ] E-Mail kam bei th@decarbo-engineering.com an

---

## Bei Problemen

**Fehler beim Push:**
```bash
git status
git pull origin main --rebase
git push origin main
```

**EmailJS funktioniert nicht:**
- Browser Console öffnen (F12)
- Secrets/Env-Variablen überprüfen
- EmailJS Dashboard → History checken

**Dependencies fehlen:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Status

**Aktueller Stand:**
- Datum: _______________
- Branch: main
- Letzter Commit: _______________
- Status: ⬜ Lokal ⬜ GitHub ⬜ Deployed

---

## Notizen

_______________________________________________
_______________________________________________
_______________________________________________
