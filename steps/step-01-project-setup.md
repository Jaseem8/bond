# Step 01 — Project Setup

> **Previous:** _(Start)_ | **Next:** [Step 02 — Backend Core Logic](./step-02-backend-core-logic.md)

---

## 🎯 Goal

Bootstrap the monorepo with two workspaces:
- `backend/` — NestJS + TypeScript
- `frontend/` — React + Vite + TypeScript

---

## 📚 What You'll Learn

- How `npm workspaces` (or a plain mono-repo layout) works
- How to scaffold a NestJS project with the Nest CLI
- How to scaffold a React + Vite project
- What `tsconfig.json` does and why we need it

---

## 🛠️ Commands

```bash
# 1 — Enter the project root
cd /Users/mohammed.jaseem/bond

# 2 — Create a root package.json that ties the workspaces together
npm init -y

# 3 — Scaffold the NestJS backend
npx @nestjs/cli new backend --package-manager npm --skip-git

# 4 — Scaffold the React frontend with Vite
npm create vite@latest frontend -- --template react-ts

# 5 — Install frontend dependencies
cd frontend && npm install && cd ..

# 6 — Install backend dependencies (already done by Nest CLI, but verify)
cd backend && npm install && cd ..
```

---

## 📁 Expected Output

```
bond/
├── package.json          ← root (optional workspace glue)
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   └── main.ts
│   ├── tsconfig.json
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   └── main.tsx
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## ✅ Verify

```bash
# Start backend (should print "Application is running on port 3000")
cd backend && npm run start:dev

# In another terminal – start frontend (should open localhost:5173)
cd frontend && npm run dev
```

---

## 🔑 Key Concepts

| Concept | Explanation |
|---------|-------------|
| **NestJS** | An opinionated Node.js framework that uses decorators — similar to Angular |
| **Vite** | A lightning-fast dev server and bundler for React |
| **tsconfig** | Tells the TypeScript compiler how strict to be and where to find files |
| **`strict: true`** | Enables all strict checks — catches bugs early; always use it |

---

## 🚀 Commit

```bash
git init
git add .
git commit -m "feat: initialise monorepo with NestJS backend and Vite+React frontend"
```
