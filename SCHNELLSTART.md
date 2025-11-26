# 🚀 Schnellstart-Anleitung

## Alles auf einen Blick

Diese Anleitung führt Sie in **10 Minuten** durch die komplette Einrichtung.

---

## ✅ Checkliste

- [ ] Node.js installiert (Version 18+)
- [ ] EmailJS Account erstellt
- [ ] Git installiert
- [ ] GitHub Account vorhanden

---

## 📦 1. Projekt Setup (2 Minuten)

```bash
# In Ihren Projekt-Ordner navigieren
cd /pfad/zu/ihrem/projekt

# Dependencies installieren
npm install

# .env Datei erstellen
cp .env.example .env
```

---

## 📧 2. EmailJS einrichten (3 Minuten)

1. **Service verbinden:** https://dashboard.emailjs.com/admin
   - Email Services → Add New Service
   - Gmail/Outlook auswählen
   - Service ID notieren: `service_xxx`

2. **Template erstellen:** Email Templates → Create New Template
   ```
   To: th@decarbo-engineering.com
   Subject: Neue PDF-Anfrage: {{user_name}}
   
   (Template-Inhalt siehe EMAILJS_SETUP_ANLEITUNG.md)
   ```
   - Template ID notieren: `template_xxx`

3. **Public Key holen:** Account → General
   - Public Key notieren: `abcxyz123`

4. **.env ausfüllen:**
   ```env
   VITE_EMAILJS_SERVICE_ID=service_xxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxx
   VITE_EMAILJS_PUBLIC_KEY=abcxyz123
   ```

---

## 🧪 3. Lokal testen (2 Minuten)

```bash
# Entwicklungsserver starten
npm run dev
```

Browser öffnet sich automatisch auf `http://localhost:3000`

**Testen Sie:**
1. Parameter verstellen
2. Name und E-Mail eingeben
3. "PDF-Bericht erstellen" klicken
4. PDF sollte herunterladen
5. E-Mail sollte an th@decarbo-engineering.com gehen

---

## 🌐 4. GitHub Setup (3 Minuten)

```bash
# Git Repository initialisieren
git init
git add .
git commit -m "Initial commit"

# GitHub Repository erstellen (auf github.com)
# Dann:
git remote add origin https://github.com/IHR-USERNAME/pyrolysis-calculator.git
git branch -M main
git push -u origin main
```

**GitHub Secrets einrichten:**
1. Repository → Settings → Secrets → Actions
2. Drei Secrets hinzufügen:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`

---

## 🚀 5. Deployment (Optional)

### Vercel (Empfohlen - 2 Minuten)

1. https://vercel.com → Sign up with GitHub
2. "Add New Project" → Repository auswählen
3. Environment Variables hinzufügen (die 3 EmailJS-Werte)
4. "Deploy" klicken
5. Fertig! URL: `https://ihr-projekt.vercel.app`

### Netlify (Alternative)

1. https://netlify.com → Sign up with GitHub
2. "New site from Git" → Repository auswählen
3. Build Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Environment Variables hinzufügen
5. "Deploy site" klicken

---

## 🎉 Fertig!

Ihre App läuft jetzt:
- ✅ Lokal: `http://localhost:3000`
- ✅ GitHub: Code ist gesichert
- ✅ Online: Auf Vercel/Netlify (falls deployed)
- ✅ EmailJS: Sendet automatisch E-Mails

---

## 📚 Weitere Dokumentation

- **Detaillierte EmailJS-Anleitung:** [EMAILJS_SETUP_ANLEITUNG.md](./EMAILJS_SETUP_ANLEITUNG.md)
- **Git & GitHub Details:** [GIT_SETUP_ANLEITUNG.md](./GIT_SETUP_ANLEITUNG.md)
- **Vollständige README:** [README.md](./README.md)

---

## 🆘 Hilfe benötigt?

**Problem:** Dependencies installieren schlägt fehl
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Port 3000 ist belegt
```bash
# In vite.config.ts den Port ändern
# oder Terminal mit Port 3000 schließen
```

**Problem:** EmailJS funktioniert nicht
- Console öffnen (F12) → Errors checken
- EmailJS Dashboard → History → Sent emails checken
- Secrets/Env-Variablen nochmal überprüfen

---

## 📞 Support

Bei Fragen: th@decarbo-engineering.com

**Viel Erfolg! 🚀**
