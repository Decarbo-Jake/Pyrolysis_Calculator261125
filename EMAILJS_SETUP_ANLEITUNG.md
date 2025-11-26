# EmailJS Setup Anleitung für Pyrolysis Calculator

## Schritt 1: EmailJS im Dashboard einrichten

### 1.1 E-Mail-Service verbinden
1. Gehen Sie zu https://dashboard.emailjs.com/admin
2. Klicken Sie auf **"Email Services"** im Menü links
3. Klicken Sie auf **"Add New Service"**
4. Wählen Sie Ihren E-Mail-Provider (z.B. Gmail, Outlook)
5. Folgen Sie den Anweisungen zur Verbindung
6. **Notieren Sie die Service ID** (z.B. `service_abc123`)

### 1.2 E-Mail-Template erstellen
1. Gehen Sie zu **"Email Templates"**
2. Klicken Sie auf **"Create New Template"**
3. Geben Sie einen Namen ein: `Pyrolysis_Calculator_Lead`
4. Kopieren Sie folgenden Inhalt in das Template:

#### Template Settings:
- **To Email:** `th@decarbo-engineering.com`
- **From Name:** `{{user_name}}`
- **Reply To:** `{{user_email}}`

#### Template Content:
```
Subject: Neue PDF-Anfrage: {{user_name}}

Von: {{user_name}}
E-Mail: {{user_email}}
Sprache: {{language}}

ANLAGENPARAMETER:
====================
- Durchsatz: {{plant_capacity}} kg/h
- Heizwert: {{fuel_heat_value}} kWh/kg
- Volllaststunden: {{operating_hours}} h/Jahr
- Investition: {{investment}} €

PRODUKTE:
====================
- Biochar: Ja (immer aktiv)
- Wärme: {{heat}}
- Strom: {{electricity}}
- Bio-Öl: {{bio_oil}}

ERGEBNISSE:
====================
- NPV (Kapitalwert): {{npv}} k€
- IRR (Interner Zinsfuß): {{irr}}%
- Amortisationszeit: {{payback}} Jahre

ZEITSTEMPEL:
====================
{{date}}

---
Diese E-Mail wurde automatisch vom Pyrolysis Plant Economic Calculator generiert.
```

5. Klicken Sie auf **"Save"**
6. **Notieren Sie die Template ID** (z.B. `template_xyz789`)

### 1.3 Public Key abrufen
1. Gehen Sie zu **"Account"** → **"General"**
2. Finden Sie Ihren **Public Key** (sieht aus wie: `abcdef123456`)
3. **Notieren Sie den Public Key**

---

## Schritt 2: NPM-Paket installieren

In Ihrem Projekt-Terminal:

```bash
npm install @emailjs/browser
```

oder mit yarn:

```bash
yarn add @emailjs/browser
```

---

## Schritt 3: Konfigurationswerte eintragen

Öffnen Sie die Datei `Pyrolysis_Calculator_Bilingual.tsx` und ersetzen Sie die Platzhalter:

```typescript
// Suchen Sie diese Zeilen (ca. Zeile 270-273):
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// Ersetzen Sie mit Ihren echten Werten:
const EMAILJS_SERVICE_ID = 'service_abc123';      // Ihre Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789';     // Ihre Template ID
const EMAILJS_PUBLIC_KEY = 'abcdef123456';         // Ihr Public Key
```

---

## Schritt 4: Testen

1. Starten Sie Ihre React-App:
   ```bash
   npm start
   ```

2. Öffnen Sie die App im Browser

3. Füllen Sie das Formular aus:
   - Geben Sie Ihren Namen ein
   - Geben Sie Ihre E-Mail-Adresse ein
   - Klicken Sie auf "PDF-Bericht erstellen"

4. Überprüfen Sie:
   - Das PDF sollte heruntergeladen werden
   - Eine E-Mail sollte an `th@decarbo-engineering.com` gesendet werden
   - Der Nutzer sieht nur das PDF - die E-Mail läuft im Hintergrund

---

## EmailJS Free Tier Limits

Beachten Sie die kostenlosen Limits:
- **200 E-Mails pro Monat**
- Wenn Sie mehr benötigen, müssen Sie auf einen bezahlten Plan upgraden

---

## Troubleshooting

### Problem: "Failed to send email"
**Lösung:**
1. Überprüfen Sie, ob alle IDs korrekt eingetragen sind
2. Überprüfen Sie in der Browser-Console auf Fehlermeldungen
3. Stellen Sie sicher, dass EmailJS-Service aktiv ist

### Problem: E-Mails kommen nicht an
**Lösung:**
1. Überprüfen Sie den Spam-Ordner
2. Stellen Sie sicher, dass die To-Email im Template korrekt ist
3. Überprüfen Sie im EmailJS Dashboard unter "History" ob die E-Mail gesendet wurde

### Problem: CORS-Fehler
**Lösung:**
- EmailJS hat CORS aktiviert, das sollte kein Problem sein
- Falls doch: Überprüfen Sie, ob Sie den richtigen Public Key verwenden

---

## Sicherheitshinweis

Der Public Key ist sicher, um ihn im Frontend-Code zu verwenden. EmailJS wurde speziell dafür entwickelt. Ihre Service ID und Template ID können ebenfalls sicher im Frontend bleiben, da EmailJS nur Anfragen mit dem richtigen Public Key akzeptiert.

---

## Alternative: Umgebungsvariablen (Empfohlen für Produktion)

Für eine sauberere Lösung können Sie die Werte in Umgebungsvariablen speichern:

1. Erstellen Sie eine `.env` Datei im Projekt-Root:
```
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_PUBLIC_KEY=abcdef123456
```

2. Im Code verwenden:
```typescript
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';
```

3. Fügen Sie `.env` zu `.gitignore` hinzu (falls Sie Git verwenden)

---

## Support

Bei Fragen zu EmailJS:
- EmailJS Dokumentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/docs/support/

Bei Fragen zur Integration:
- Überprüfen Sie die Browser-Console auf Fehlermeldungen
- Testen Sie zuerst mit dem EmailJS Playground im Dashboard
