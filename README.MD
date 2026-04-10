# 🚀 Project Collaboration Guide

## 🌳 Branch Structure

- `main` → Production (DO NOT touch directly ❌)
- `develop` → Main working branch
- `feature/*` → Individual developer work

---

## 👨‍💻 Developer Setup (First Time)

```bash
git clone <repo-url>
cd project

# create local develop branch
git checkout -b develop origin/develop
```

---

## 🔄 Start Work (Every Time)

```bash
git checkout develop
git pull origin develop

# create your feature branch
git checkout -b feature/your-task-name
```

---

## 💻 After Coding

```bash
git add .
git commit -m "feat: your work"
git push origin feature/your-task-name
```

---

## 🔁 Create Pull Request (IMPORTANT)

Go to GitHub:

- Create PR from:

  ```
  feature/your-task-name → develop
  ```

---

## 👑 Team Lead (You)

1. Open Pull Request
2. Review code
3. If correct → Merge into `develop`

---

## 🔄 After Merge (All Developers)

```bash
git checkout develop
git pull origin develop
```

---

## 🚀 Production Release

- Create PR:

  ```
  develop → main
  ```

- Review → Merge

---

## 🧹 Clean Up Branches

After merge:

```bash
git branch -d feature/your-task-name
git push origin --delete feature/your-task-name
```

---

## ⚠️ Important Rules

- ❌ Never push directly to `main`

- ❌ Never push directly to `develop`

- ❌ Never create branch like `origin/...`

- ❌ Never use `git checkout -d`

- ✅ Always start from `develop`

- ✅ Always use `feature/*`

- ✅ Always create Pull Request

---

## 🧠 Simple Workflow

```
develop → feature → code → push → PR → review → merge → sync
```

---

## 💡 Emergency Fix

If you get stuck switching branches:

```bash
git stash
git checkout develop
```

---

## 💬 Final Note

Keep it simple.
Don’t overthink Git — just follow the flow.
