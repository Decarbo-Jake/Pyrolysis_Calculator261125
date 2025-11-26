# 🎯 EMAILJS CODES EINTRAGEN - VISUELLE ANLEITUNG

## ✅ Die Datei existiert bereits!

**Datei:** `src/Pyrolysis_Calculator_Bilingual.tsx`

Diese Datei ist bereits im Projekt vorhanden im `src/` Ordner!

---

## 📍 Wo genau eintragen?

### Schritt 1: Datei öffnen

Öffnen Sie die Datei in Ihrem Code-Editor:
```
src/Pyrolysis_Calculator_Bilingual.tsx
```

### Schritt 2: Zu Zeile 248 springen

In den meisten Editoren:
- **VS Code:** Drücken Sie `Ctrl+G` (Windows) oder `Cmd+G` (Mac) und tippen Sie `248`
- **Notepad++:** Drücken Sie `Ctrl+G` und tippen Sie `248`
- **Sublime Text:** Drücken Sie `Ctrl+G` und tippen Sie `248`

### Schritt 3: Sie sehen diese 3 Zeilen:

```typescript
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
```

### Schritt 4: Ersetzen Sie die Platzhalter

**VORHER:**
```typescript
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
```

**NACHHER (Beispiel mit Ihren echten Werten):**
```typescript
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_abc123xyz';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_xyz789abc';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'aBcDeF123456';
```

### Schritt 5: Speichern

Drücken Sie `Ctrl+S` (Windows) oder `Cmd+S` (Mac)

---

## 🔍 Kontext - So sieht es im Code aus:

```typescript
const PyrolysisCalculator = () => {
  // EmailJS Configuration - Aus Umgebungsvariablen oder Fallback zu direkten Werten
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';     // ← Zeile 248
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'; // ← Zeile 249
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';    // ← Zeile 250
  
  const [language, setLanguage] = useState('de');
  const t = translations[language];
  // ... rest of code
```

---

## ⚠️ WICHTIG: Nur die Werte zwischen den Anführungszeichen ändern!

**❌ FALSCH:**
```typescript
const EMAILJS_SERVICE_ID = 'service_abc123';
```

**✅ RICHTIG:**
```typescript
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_abc123';
```

Ändern Sie **NUR** den Teil nach `||` und zwischen den `' '`

---

## 🎯 Wo finde ich meine EmailJS Codes?

1. Gehen Sie zu: https://dashboard.emailjs.com/admin
2. **Service ID:** Email Services → Ihre Service auswählen → ID kopieren
3. **Template ID:** Email Templates → Ihr Template auswählen → ID kopieren  
4. **Public Key:** Account → General → Public Key kopieren

---

## 💡 Alternative: .env Datei (Empfohlen!)

Anstatt die Werte im Code zu ändern, können Sie auch eine `.env` Datei erstellen:

**Datei:** `.env` (im Projekt-Root, gleiche Ebene wie package.json)

```env
VITE_EMAILJS_SERVICE_ID=service_abc123xyz
VITE_EMAILJS_TEMPLATE_ID=template_xyz789abc
VITE_EMAILJS_PUBLIC_KEY=aBcDeF123456
```

**Vorteil:** Diese Datei wird NICHT zu Git hinzugefügt und ist sicherer!

Wenn Sie die .env Datei verwenden, müssen Sie die Zeilen 248-250 im Code **NICHT** ändern!

---

## 🧪 Testen

Nach dem Eintragen:

```bash
npm run dev
```

Browser öffnet sich auf http://localhost:3000

1. Formular ausfüllen (Name + E-Mail)
2. "PDF-Bericht erstellen" klicken
3. PDF wird heruntergeladen
4. E-Mail sollte an th@decarbo-engineering.com kommen

---

## ❓ Probleme?

**"Module not found: @emailjs/browser"**
```bash
npm install @emailjs/browser
```

**"Email sendet nicht"**
- Browser Console öffnen (F12)
- Fehler ansehen
- EmailJS Dashboard → History checken

**"Datei nicht gefunden"**
- Stellen Sie sicher, dass Sie im richtigen Ordner sind
- Die Datei ist in: `src/Pyrolysis_Calculator_Bilingual.tsx`

---

## 📂 Dateistruktur zur Orientierung

```
Ihr-Projekt/
├── src/
│   ├── Pyrolysis_Calculator_Bilingual.tsx  ← HIER SIND DIE ZEILEN 248-250!
│   ├── main.tsx
│   └── index.css
├── package.json
├── .env  ← ODER HIER (falls Sie .env verwenden)
└── ...
```

---

**Fertig! 🎉**

Die EmailJS-Codes sind jetzt eingetragen und die App kann E-Mails versenden.
