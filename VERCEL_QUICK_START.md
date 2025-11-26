# 🚀 VERCEL DEPLOYMENT - QUICK START

## 3 Einfache Schritte

### 1️⃣ GitHub Repository erstellen

Öffne: https://github.com/new

```
Name: pyrolysis-calculator
Description: Wirtschaftlichkeitsrechner für Pyrolyseanlagen - DECARBO
Visibility: PUBLIC ⭐
```

Klick: **Create repository**

---

### 2️⃣ Code zu GitHub pushen

```powershell
cd "c:\Users\th\OneDrive\Documents\Entwicklung\BCR Calculator\pyrolysis-calculator-deploy"

git init
git add .
git commit -m "Initial commit: Pyrolysis Calculator v2.0.0"
git branch -M main
git remote add origin https://github.com/USERNAME/pyrolysis-calculator.git
git push -u origin main
```

⚠️ Ersetze `USERNAME` mit deinem GitHub-Benutzernamen!

---

### 3️⃣ Auf Vercel deployen

1. Öffne: https://vercel.com
2. Sign up with GitHub
3. New Project
4. Wähle: `pyrolysis-calculator`
5. Environment Variables hinzufügen:
   ```
   VITE_EMAILJS_SERVICE_ID = (aus .env)
   VITE_EMAILJS_TEMPLATE_ID = (aus .env)
   VITE_EMAILJS_PUBLIC_KEY = (aus .env)
   ```
6. Deploy!

---

## 🎉 Fertig!

Deine App ist live unter:
```
https://pyrolysis-calculator.vercel.app
```

---

## 📚 Detaillierte Anleitungen

- **`VERCEL_STEP_BY_STEP.md`** - Komplette Schritt-für-Schritt Anleitung
- **`GITHUB_PUSH_GUIDE.md`** - GitHub Push Anleitung
- **`VERCEL_DEPLOYMENT.md`** - Vercel Deployment Übersicht

---

## 🔄 Zukünftige Updates

Einfach pushen zu GitHub:

```powershell
git add .
git commit -m "Meine Änderungen"
git push origin main
```

→ Vercel deployed **automatisch** neu! 🚀

