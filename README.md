# Prep Handbook

A dynamic landing page system for organizing your technical preparation materials.

## 🚀 Quick Start

### Local Development
1. Open `index.html` in your browser to view the landing page
2. Add new HTML files to the `components/` folder
3. Run the update script to automatically refresh the index page:
   ```bash
   node update-index.js
   ```

### With GitHub Actions (Automatic)
Simply push your changes to GitHub - the index will update automatically!
```bash
git add .
git commit -m "Add new component"
git push
```
The GitHub Action will run automatically and update `index.html` for you! 🤖

## 📁 Structure

```
Prep_HandBook/
├── .github/
│   └── workflows/
│       ├── update-index.yml    # Auto-runs on push
│       └── manual-update.yml   # Manual trigger option
├── index.html                  # Landing page with card-based layout
├── update-index.js             # Auto-update script
├── components/                 # Your HTML pages go here
│   ├── Partitioning_Bucketing_Pruning.html
│   └── spark_Performance_optimiszer.html
└── README.md
```

## ✨ Features

- **Beautiful Card Layout**: Modern, responsive design with hover effects
- **Automatic Updates**: Script scans components folder and updates index
- **GitHub Actions Integration**: Auto-updates index.html on every push! 🤖
- **Smart Icons**: Auto-assigns icons based on filename keywords
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Easy to Use**: Just add HTML files and push to GitHub

## 🤖 GitHub Actions Automation

Two workflows are included:

### 1. Auto Update (update-index.yml)
**Triggers automatically when:**
- You push changes to `main` or `master` branch
- Any HTML file in `components/` folder is modified
- The `update-index.js` script is updated

**What it does:**
- Runs `node update-index.js`
- Commits and pushes updated `index.html` back to your repo
- Uses `[skip ci]` to avoid infinite loops

### 2. Manual Update (manual-update.yml)
**Trigger manually from GitHub:**
1. Go to your repo on GitHub
2. Click "Actions" tab
3. Select "Manual Update Index"
4. Click "Run workflow"

Perfect for force-updating or testing!

## 🔄 Adding New Components

### With GitHub (Recommended)
1. Create your new HTML file in the `components/` folder:
   ```bash
   touch components/My_New_Topic.html
   # Add your content to the file
   ```

2. Commit and push to GitHub:
   ```bash
   git add components/My_New_Topic.html
   git commit -m "Add My New Topic"
   git push
   ```

3. GitHub Actions automatically runs and updates `index.html` - done! ✨

### Local Only
1. Create your file in `components/`
2. Run: `node update-index.js`
3. View changes in your browser

## 🎨 Icon Mapping

The script automatically assigns icons based on filename keywords:
- ⚡ - spark, performance
- 🔧 - partition, bucket
- 💾 - data, database
- 🔒 - security, auth
- 🌐 - api, rest
- 🧪 - test, qa
- 🚀 - deploy, devops
- 🎨 - design, pattern
- 🧮 - algorithm, structure
- 🤖 - machine, learning, ai
- ☁️ - cloud, aws, azure
- 🐳 - docker, container
- 📄 - default

## 💡 Tips

- Use underscores or hyphens in filenames (they convert to spaces in titles)
- Example: `Data_Structures.html` → "Data Structures"
- The script converts filenames to readable titles automatically
- All HTML files must be in the `components/` folder

## 🛠️ Customization

You can customize the index page by editing:
- **Colors**: Modify the gradient in the `<style>` section
- **Icons**: Edit the `getIconForComponent()` function in `update-index.js`
- **Descriptions**: Modify the `generateDescription()` function
- **Layout**: Adjust CSS grid properties in `index.html`

Enjoy your dynamic handbook! 📚
