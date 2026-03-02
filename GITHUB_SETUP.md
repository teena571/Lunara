# 🚀 GitHub Setup Guide for Lunara

Complete step-by-step guide to push your Lunara project to GitHub.

## 📋 Prerequisites

1. **Git Installed**
   ```bash
   git --version
   ```
   If not installed, download from: https://git-scm.com/

2. **GitHub Account**
   - Create account at: https://github.com/
   - Verify your email

3. **Git Configuration** (First time only)
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

---

## 🎯 Step-by-Step Instructions

### Step 1: Initialize Git Repository

Open terminal in your project root folder (where backend and frontend folders are):

```bash
# Check current directory
pwd

# Should show something like: /path/to/lunara

# Initialize git repository
git init
```

**Expected Output:**
```
Initialized empty Git repository in /path/to/lunara/.git/
```

---

### Step 2: Add Files to Git

```bash
# Check status (see what files will be added)
git status

# Add all files
git add .

# Check status again (files should be green now)
git status
```

**Expected Output:**
```
On branch main
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   .gitignore
        new file:   README.md
        new file:   backend/...
        new file:   frontend/...
```

---

### Step 3: Create First Commit

```bash
# Commit with message
git commit -m "Initial commit: Lunara MERN application"
```

**Expected Output:**
```
[main (root-commit) abc1234] Initial commit: Lunara MERN application
 150 files changed, 15000 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 README.md
 ...
```

---

### Step 4: Create GitHub Repository

1. **Go to GitHub**: https://github.com/
2. **Click** the "+" icon (top right)
3. **Select** "New repository"
4. **Fill in details:**
   - Repository name: `lunara`
   - Description: `Menstrual Wellness Intelligence Platform - MERN Stack`
   - Visibility: Choose "Public" or "Private"
   - **DO NOT** check "Initialize with README" (we already have one)
5. **Click** "Create repository"

---

### Step 5: Connect Local to GitHub

GitHub will show you commands. Use these:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/lunara.git

# Verify remote was added
git remote -v
```

**Expected Output:**
```
origin  https://github.com/YOUR_USERNAME/lunara.git (fetch)
origin  https://github.com/YOUR_USERNAME/lunara.git (push)
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

### Step 6: Push to GitHub

```bash
# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use **Personal Access Token** (not your password)

**Expected Output:**
```
Enumerating objects: 200, done.
Counting objects: 100% (200/200), done.
Delta compression using up to 8 threads
Compressing objects: 100% (150/150), done.
Writing objects: 100% (200/200), 50.00 KiB | 5.00 MiB/s, done.
Total 200 (delta 50), reused 0 (delta 0)
To https://github.com/YOUR_USERNAME/lunara.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🔑 GitHub Personal Access Token (If Needed)

If GitHub asks for password, you need a Personal Access Token:

### Create Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Lunara Project"
4. Select scopes:
   - ✅ `repo` (all)
   - ✅ `workflow`
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as password when pushing

### Save Token (Optional):
```bash
# Cache credentials for 1 hour
git config --global credential.helper cache

# Or cache for longer (1 day)
git config --global credential.helper 'cache --timeout=86400'
```

---

## ✅ Verify Upload

1. Go to: `https://github.com/YOUR_USERNAME/lunara`
2. You should see:
   - ✅ All your files
   - ✅ README.md displayed
   - ✅ Folder structure (backend, frontend)
   - ✅ Commit message

---

## 🔄 Future Updates

When you make changes to your code:

```bash
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with message
git commit -m "Add new feature: cycle predictions"

# 4. Push to GitHub
git push
```

---

## 📝 Common Git Commands

### Check Status
```bash
git status
```

### View Commit History
```bash
git log
git log --oneline
```

### Create New Branch
```bash
git checkout -b feature/new-feature
```

### Switch Branch
```bash
git checkout main
```

### Pull Latest Changes
```bash
git pull
```

### View Remote URL
```bash
git remote -v
```

### Change Remote URL
```bash
git remote set-url origin https://github.com/NEW_USERNAME/lunara.git
```

---

## 🚨 Troubleshooting

### Issue 1: "fatal: not a git repository"
**Solution:**
```bash
git init
```

### Issue 2: "remote origin already exists"
**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/lunara.git
```

### Issue 3: "failed to push some refs"
**Solution:**
```bash
git pull origin main --rebase
git push -u origin main
```

### Issue 4: "Permission denied"
**Solution:**
- Use Personal Access Token instead of password
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Issue 5: ".env file uploaded by mistake"
**Solution:**
```bash
# Remove from git (but keep locally)
git rm --cached backend/.env
git rm --cached frontend/.env

# Commit the removal
git commit -m "Remove .env files"

# Push
git push
```

---

## 🔒 Security Checklist

Before pushing to GitHub:

- [x] `.gitignore` file created
- [x] `.env` files NOT tracked
- [x] `node_modules/` NOT tracked
- [x] No sensitive data in code
- [x] No API keys in code
- [x] No passwords in code
- [x] `.env.example` files included (without real values)

---

## 📊 Repository Settings (Optional)

After pushing, configure your repository:

1. **Add Topics** (for discoverability)
   - Settings → Topics
   - Add: `mern`, `react`, `nodejs`, `mongodb`, `health`, `wellness`

2. **Add Description**
   - "Menstrual Wellness Intelligence Platform - MERN Stack"

3. **Enable Issues**
   - Settings → Features → Issues ✅

4. **Add License**
   - Add file → Create new file → Name: `LICENSE`
   - Choose MIT License

5. **Add .github/workflows** (for CI/CD later)

---

## 🎉 Success!

Your Lunara project is now on GitHub! 🚀

**Share your repository:**
```
https://github.com/YOUR_USERNAME/lunara
```

**Clone on another machine:**
```bash
git clone https://github.com/YOUR_USERNAME/lunara.git
cd lunara
cd backend && npm install
cd ../frontend && npm install
```

---

## 📚 Additional Resources

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **GitHub Desktop** (GUI): https://desktop.github.com/

---

## 🤝 Collaboration

To collaborate with others:

1. **Add Collaborators**
   - Settings → Collaborators → Add people

2. **Create Issues**
   - Issues → New issue

3. **Create Pull Requests**
   - Fork → Make changes → Pull request

4. **Use Branches**
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git push origin feature/new-feature
   # Create PR on GitHub
   ```

---

**Happy Coding! 💜**
