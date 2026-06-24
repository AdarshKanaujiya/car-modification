# 🚗 Vehicle Customizer

A modern, high-performance web application for customizing vehicles, built using React, Vite, React Router, and Tailwind CSS v4.

---

## 🛠️ Development Setup Guide

Follow these sequential steps to clone the repository, set up your branch, install dependencies, and launch your local development workspace.

### 1. Clone the Repository
Open your terminal or command prompt, navigate to your desired workspace folder, and pull down the source code:
```bash
git clone <YOUR_REPOSITORY_URL>
```
*Replace `<YOUR_REPOSITORY_URL>` with your actual Git hosting link (e.g., GitHub, GitLab, Bitbucket).*

Navigate into the root directory of the project:
```bash
cd vehicle-customizer
```

### 2. Create a Feature Branch
Production environments require isolation. Never commit code directly to the `main` or `master` branch. 

Create and switch to a dedicated working branch using descriptive naming structures (e.g., `feature/`, `bugfix/`):
```bash
git checkout -b feature/add-vehicle-ui
```

### 3. Install Project Dependencies
Fetch and install the correct module packages specified in the lockfile:
```bash
npm install
```

### 4. Run the Local Development Server
Compile and launch your local isolated developer workspace using the Vite build engine:
```bash
npm run dev
```

Once the terminal outputs the local host link, open your browser and navigate to:
* **Local Workspace URL**: `http://localhost:5173`

---

## 📦 Project Tech Stack Details

* **Runtime & Compiler**: Node.js & Vite 8
* **Frontend Library**: React 19 (Client-side)
* **Application Routing**: React Router v7
* **Styling Framework**: Tailwind CSS v4 (Native Vite compiler configuration)

---

## 📝 Committing Your Changes
When your feature additions are complete, log and package your code adjustments cleanly before raising a Pull Request (PR):

1. **Stage changes**: `git add .`
2. **Commit changes**: `git commit -m "feat: implement vehicle customizer layout"`
3. **Push branch upstream**: `git push origin feature/add-vehicle-ui`
