# 📧 Wo EmailJS Codes eintragen? (Kurzanleitung)

## 🎯 Schnelle Übersicht

Sie haben 2 Möglichkeiten, Ihre EmailJS-Codes einzutragen:

---

## ✅ Methode 1: .env Datei (EMPFOHLEN)

### Schritt 1: Datei erstellen
Im Projekt-Root (gleiche Ebene wie `package.json`):

**Datei: `.env`**
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abcdef123456
```

### Schritt 2: Echte Werte eintragen
Ersetzen Sie die Platzhalter mit Ihren echten Werten von EmailJS:
- `service_abc123` → Ihre Service ID
- `template_xyz789` → Ihre Template ID  
- `abcdef123456` → Ihr Public Key

### ⚠️ WICHTIG:
- Diese Datei wird NICHT zu Git hinzugefügt (ist in .gitignore)
- Nur für lokale Entwicklung
- Für GitHub verwenden Sie Secrets (siehe unten)

---

## ✅ Methode 2: Direkt im Code (Fallback)

### Datei öffnen:
`src/Pyrolysis_Calculator_Bilingual.tsx` 

**✅ Diese Datei existiert bereits im src/ Ordner!**

### Position finden:
Suchen Sie nach **Zeile 248** (kurz nach `const PyrolysisCalculator = () => {`)

Sie finden diese 3 Zeilen:
```typescript
// VORHER (mit Platzhaltern):
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

// NACHHER (mit Ihren echten Werten):
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_abc123';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_xyz789';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'abcdef123456';
```

⚠️ **Achtung:** Wenn Sie die Werte direkt im Code eintragen, werden sie auf GitHub sichtbar!

---

## 🔐 Für GitHub/Production: Secrets einrichten

### Schritt 1: Zu GitHub gehen
1. Ihr Repository öffnen
2. **Settings** (oben rechts)
3. **Secrets and variables** → **Actions** (linkes Menü)

### Schritt 2: Secrets hinzufügen
Klicken Sie auf **"New repository secret"** und fügen Sie hinzu:

**Secret 1:**
```
Name:  VITE_EMAILJS_SERVICE_ID
Value: service_abc123
```

**Secret 2:**
```
Name:  VITE_EMAILJS_TEMPLATE_ID
Value: template_xyz789
```

**Secret 3:**
```
Name:  VITE_EMAILJS_PUBLIC_KEY
Value: abcdef123456
```

---

## 📊 Übersicht: Wo was eintragen?

| Zweck | Ort | Datei | Wird zu Git hinzugefügt? |
|-------|-----|-------|--------------------------|
| Lokale Entwicklung | Projekt-Root | `.env` | ❌ NEIN |
| Fallback im Code | src/ | `Pyrolysis_Calculator_Bilingual.tsx` | ⚠️ JA (nicht empfohlen) |
| GitHub Production | GitHub Website | Settings → Secrets | ❌ NEIN (sicher) |

---

## 🧪 Testen

Nach dem Eintragen:

```bash
# Entwicklungsserver starten
npm run dev

# Im Browser öffnet sich: http://localhost:3000
# Formular ausfüllen und "PDF erstellen" klicken
# E-Mail sollte an th@decarbo-engineering.com gehen
```

---

## ❓ Häufige Fragen

**Q: Welche Methode ist am besten?**
A: `.env` Datei für lokale Entwicklung + GitHub Secrets für Production

**Q: Kann ich die .env zu Git hinzufügen?**
A: NEIN! Ist bereits in .gitignore und sollte privat bleiben

**Q: Wo finde ich meine EmailJS Codes?**
A: https://dashboard.emailjs.com/admin

**Q: Funktioniert nicht, was tun?**
A: 
1. Browser Console öffnen (F12)
2. Auf Fehlermeldungen achten
3. Werte nochmal überprüfen
4. EmailJS Dashboard → History checken

---

## 🎯 Empfohlener Workflow

### Für Sie (Entwickler):
```
1. .env Datei erstellen mit echten Werten
2. Lokal testen (npm run dev)
3. Code zu GitHub pushen (ohne .env!)
4. GitHub Secrets einrichten
5. GitHub Actions läuft automatisch
```

### Für andere Entwickler:
```
1. Repository klonen
2. .env.example zu .env kopieren
3. Eigene EmailJS-Werte eintragen
4. npm install && npm run dev
```

---

**Fertig! 🎉**

Ihre EmailJS-Integration ist nun vollständig konfiguriert.
