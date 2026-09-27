# 🚀 Deploying to Hostinger Using GitHub

This guide covers everything you need to deploy **Professor's Global School** to **Hostinger** from your GitHub repository.

All Hostinger-specific configurations (such as `.htaccess` for React Router URL rewrites, dynamic `process.env.PORT` handling, and automated GitHub Actions workflows) have already been configured in this codebase.

---

## 📋 Choose Your Deployment Method

Hostinger supports two primary ways to deploy a React/Node application from GitHub:

| Method | Best For | Complexity | Setup Time |
| :--- | :--- | :--- | :--- |
| **Method 1: GitHub Actions (Automated CI/CD via FTP)** | Hostinger Web Hosting (Single, Premium, Business, Cloud) | ⭐ Easy (Recommended) | ~5 minutes |
| **Method 2: Hostinger Git + Node.js Manager** | Hostinger VPS or Cloud hosting with Node.js support | ⭐⭐ Intermediate | ~5 minutes |
| **Method 3: Manual Upload** | Quick one-time testing without automated CI/CD | ⭐ Simplest | ~2 minutes |

---

## 🌟 Method 1: Automated GitHub Actions CI/CD (Recommended)

Whenever you push to GitHub (`main` branch), GitHub will automatically build your app and deploy it to Hostinger's `public_html` directory.

### Step 1: Push your code to GitHub
If you haven't pushed this project to GitHub yet:
```bash
git init
git add .
git commit -m "Initial commit for Hostinger deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### Step 2: Get your FTP credentials from Hostinger
1. Log into your **Hostinger hPanel**.
2. Click **Websites** and click **Manage** next to your domain.
3. In the left sidebar, navigate to **Files** > **FTP Accounts**.
4. Note down:
   - **FTP IP / Hostname** (e.g., `ftp.yourdomain.com` or `185.xxx.xxx.xxx`)
   - **FTP Username**
   - **FTP Password** (click *Change Password* if you do not remember it)
   - Ensure the directory points to `/public_html` (or your domain root).

### Step 3: Add Secrets in GitHub
1. Open your repository on GitHub.
2. Go to **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret** and add the following:

| Secret Name | Value | Notes |
| :--- | :--- | :--- |
| `FTP_SERVER` | Your FTP Hostname or IP | e.g. `ftp.yourdomain.com` or `185.123.45.67` |
| `FTP_USERNAME` | Your FTP username | From Hostinger FTP Accounts |
| `FTP_PASSWORD` | Your FTP password | From Hostinger FTP Accounts |

*(Optional Secrets if you wish to inject custom environment keys at build time)*:
- `VITE_FIREBASE_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_ADMIN_PASSWORD` (default is `pgsbaprola`)

### Step 4: Trigger Deployment
- The workflow file `.github/workflows/deploy-hostinger.yml` is already committed.
- Any time you run `git push origin main`, GitHub Actions will run the build and upload all files from `dist/` directly to Hostinger's `public_html`.
- You can watch the live deployment under the **Actions** tab on your GitHub repository!

---

## ⚡ Method 2: Hostinger Git & Node.js Application Manager

If your Hostinger plan includes the **Node.js** feature in hPanel:

### Step 1: Connect Git in Hostinger
1. In Hostinger hPanel, go to **Advanced** > **Git**.
2. Under **Create Repository**:
   - **Repository:** `https://github.com/YOUR_USERNAME/YOUR_REPO.git`
   - **Branch:** `main`
   - **Install directory:** `/public_html` (or leave default)
3. Click **Create**.
4. Hostinger will generate a **Webhook URL**. Copy this URL.

### Step 2: Setup GitHub Auto-Deploy Webhook
1. Go to your GitHub repository > **Settings** > **Webhooks** > **Add webhook**.
2. Paste the Hostinger Webhook URL into the **Payload URL** field.
3. Set **Content type** to `application/json`.
4. Click **Add webhook**. Now Hostinger pulls latest code on every push!

### Step 3: Configure Node.js in Hostinger hPanel
1. In hPanel, go to **Advanced** > **Node.js**.
2. Configure the following:
   - **Node.js Version:** `20.x` or `18.x`
   - **Application Root:** `/` (or the folder where Git cloned)
   - **Application Startup File:** `server.js` or `dist/server.cjs`
3. Click **Save / Run**.
4. Open the Hostinger SSH/Terminal or File Manager console and run:
   ```bash
   npm install
   npm run build
   ```
5. Click **Restart** on the Node.js application in hPanel.

---

## 📦 Method 3: Quick Manual Build & Upload

If you want to quickly test your live website right away:

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Compress all files **inside** the `dist/` folder into a `.zip` file (make sure `index.html` and `.htaccess` are at the root of the zip).
3. In **Hostinger hPanel**, open **Files** > **File Manager**.
4. Navigate to `public_html/`.
5. Upload your `.zip` file and click **Extract**.
6. That's it! Your site will immediately be live.

---

## 🛠️ Important Features Configured For Hostinger

1. **SPA Routing (.htaccess)**:
   - Located in `public/.htaccess`, Vite automatically copies this to `dist/.htaccess`.
   - Ensures refreshing URLs like `/gallery`, `/admissions`, `/contact`, or `/admin` work seamlessly on Hostinger LiteSpeed/Apache without 404 errors.

2. **Dynamic PORT Binding**:
   - Configured in `server.ts`: `const PORT = Number(process.env.PORT) || 3000;`.
   - Ensures compatibility with Hostinger Passenger reverse-proxy and custom ports.

3. **Production Entry Point**:
   - Created `server.js` at root which cleanly loads `dist/server.cjs` if you run under Hostinger Node.js.

4. **Dual Admin Authentication**:
   - Works both on full-stack Node.js server and static hosting (fallback password: `pgsbaprola`).

---

## ❓ Troubleshooting & FAQs

### Q: Why do I get a 404 error when refreshing pages on Hostinger?
- **Answer:** This occurs if `.htaccess` is missing from `public_html`. Ensure hidden files are visible in Hostinger File Manager, and verify `.htaccess` exists in `public_html/`. The included `public/.htaccess` file fixes this.

### Q: How do I change the admin dashboard password?
- **Answer:** In your environment or Hostinger configuration, set `ADMIN_PASSWORD="YourNewPassword"` or `VITE_ADMIN_PASSWORD="YourNewPassword"`. The default fallback is `pgsbaprola`.

### Q: Where do newsletters and PDF documents load from?
- **Answer:** All PDFs load from your Supabase Storage bucket (`school-pdfs`) directly in new browser tabs with zero CORS issues.
