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

### Database Change

# "#" = "%23", "@" = "%40"

.env
DATABASE_URL=postgres://user:Pass@localhost:5432/GIW

npx node-pg-migrate create init_users_table

Change in file
export const up = (pgm) => {
pgm.sql(
`
        SQL query`,
);
};

npm run migrate

# 🗄️ Database Migration Guide (PostgreSQL)

This project uses **node-pg-migrate** to manage database changes.

---

## 🚨 Important Rule

> ❌ Never change database manually
> ✅ Always use migration files

---

## 👑 When You Change Database (Main Developer)

### 1. Create a new migration

```bash
npx node-pg-migrate create your_change_name
```

---

### 2. Open the created file

Location:

```
backend/migrations/
```

---

### 3. Write your database change

Example:

```js
export const up = (pgm) => {
  pgm.sql(`
    ALTER TABLE rissue
    ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    ALTER TABLE rissue
    DROP COLUMN status;
  `);
};
```

---

### 4. Run migration locally

```bash
npm run migrate
```

---

### 5. Push changes to Git

```bash
git add .
git commit -m "DB: added status column to rissue"
git push
```

---

## 👨‍💻 For Other Developers

After pulling latest code:

```bash
git pull
npm run migrate
```

✅ Database will be automatically updated

---

## 🧪 First-Time Setup

```bash
createdb your_db
npm install
npm run migrate
```

---

## ⚠️ Rules to Follow

- ❌ Do NOT edit old migration files

- ❌ Do NOT run manual SQL in pgAdmin

- ❌ Do NOT share SQL queries manually

- ✅ Always create a new migration

- ✅ Always commit migration files

- ✅ Always run `npm run migrate` after pull

---

## 🧠 Concept

- `up` → Apply changes
- `down` → Undo changes

---

## 🔁 Workflow Summary

```
Write → Run → Push → Pull → Run
```

---

## 💬 Notes

- Migration history is stored in table: `pgmigrations`
- Each migration runs only once per database

---

## 🚀 Example Changes

| Change        | What to write                 |
| ------------- | ----------------------------- |
| Add column    | `ALTER TABLE ... ADD COLUMN`  |
| Remove column | `ALTER TABLE ... DROP COLUMN` |
| Create table  | `CREATE TABLE ...`            |
| Delete table  | `DROP TABLE ...`              |

---

Keep this flow strict to avoid database mismatch issues.
