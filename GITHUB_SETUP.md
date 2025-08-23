<!-- File: formAI/GITHUB_SETUP.md -->
# GitHub Setup Guide for FormAI

## 🚀 Initial Setup

### 1. Create GitHub Repository
- Create a new repository on GitHub
- Don't initialize with README, .gitignore, or license (we'll add our own)

### 2. Initialize Git and Push
```bash
# Initialize git repository
git init

# Add all files (excluding those in .gitignore)
git add .

# Make initial commit
git commit -m "Initial commit: FormAI - AI-powered form creation platform"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## 📁 What Gets Pushed

### ✅ Included (Will be pushed to GitHub)
- `backend/` - Complete backend code
- `frontend/` - Complete frontend code
- `README.md` - Project documentation
- `package.json` - Root package configuration
- `.gitignore` files - Git ignore rules
- `setup.bat` - Setup script
- `move-env.bat` - Environment file mover

### ❌ Excluded (Protected by .gitignore)
- `.env` files - Environment variables (sensitive data)
- `node_modules/` - Dependencies (can be reinstalled)
- `build/` and `dist/` - Build outputs
- Log files
- Cache directories
- Editor-specific files
- OS-generated files

## 🔒 Security Features

### Environment Variables Protection
- `.env` files are completely ignored
- No sensitive data (API keys, database URLs) will be pushed
- Each developer can have their own local `.env` file

### Dependencies Protection
- `node_modules/` directories are ignored
- Dependencies are defined in `package.json` files
- Other developers can run `npm install` to get dependencies

## 🛠️ After Cloning on Other Machines

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Create Environment File
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your actual values
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# GEMINI_API_KEY=your_gemini_api_key
# PORT=5000
```

### 3. Start Development
```bash
# Start both backend and frontend
npm run dev

# Or start separately:
# Backend: npm run server
# Frontend: npm run client
```

## 📋 Repository Structure on GitHub

```
formAI/
├── backend/           # Node.js backend code
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── server.js     # Main server file
├── frontend/         # React frontend code
│   ├── src/          # Source code
│   ├── public/       # Public assets
│   └── package.json  # Frontend dependencies
├── README.md         # Project documentation
├── package.json      # Root dependencies
├── .gitignore        # Git ignore rules
├── setup.bat         # Setup script
└── move-env.bat      # Environment file mover
```

## ⚠️ Important Notes

1. **Never commit `.env` files** - They contain sensitive information
2. **Dependencies are not pushed** - They're defined in `package.json` files
3. **Build outputs are ignored** - They're generated during development
4. **Each developer needs their own `.env` file** with their local configuration

## 🔄 Updating the Repository

```bash
# After making changes
git add .
git commit -m "Description of changes"
git push origin main
```

## 🆘 Troubleshooting

### If sensitive data was accidentally committed:
```bash
# Remove from git history (use with caution)
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all

# Force push to update remote
git push origin --force
```

### If dependencies are missing:
```bash
# Reinstall all dependencies
npm run install-all
```

This setup ensures your FormAI project can be safely shared on GitHub while protecting sensitive information and keeping the repository clean and professional.
