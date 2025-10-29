# Crude Client (React + Vite)

Minimal React + Vite project with a simple product CRUD UI.

Requirements
- Node.js (v16+ recommended)
- npm

Quick start
1. Install dependencies (only once):

```powershell
npm install
```

2. Start the dev server:

```powershell
npm run dev
```

Open the Vite URL shown in the terminal (default: http://localhost:5173).

Notes
- Backend API should run at: http://localhost:5000 (base: /api). Enable CORS if needed.
- Create/Edit/Delete use the endpoints described in the project code (see `src/services/api.js`).
- Build for production:

```powershell
npm run build
```

That's it — the UI is intentionally minimal. Tell me if you want TypeScript, linting, or nicer notifications.
