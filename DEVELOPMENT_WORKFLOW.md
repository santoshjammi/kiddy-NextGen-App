# Kiddy Learning Platform - Development Workflow

## 📁 Project Structure Overview

```
kiddy/
├── kiddy-app/              # 🎯 MAIN SOURCE CODE (work here)
│   ├── src/
│   │   ├── index.html      # Main landing page
│   │   ├── style.css       # Main styles
│   │   ├── app.js          # Main functionality
│   │   └── *_app.js        # Individual learning apps
│   ├── assets/             # Images, sounds, etc.
│   └── docs/               # Documentation
├── Deployment_v2.0/        # 🚀 DEPLOYMENT PACKAGE (auto-generated)
│   ├── index_seo.html      # SEO-optimized landing
│   ├── style_seo.css       # SEO + responsive styles
│   └── ...                 # All deployment files
└── sync_deployment.sh      # 🔄 Sync script
```

## 🎯 **GOLDEN RULE: Always Work in `kiddy-app/`**

### ✅ Correct Workflow:

1. **Make ALL changes in `kiddy-app/src/`**
   ```bash
   # Edit source files
   code kiddy-app/src/style.css
   code kiddy-app/src/index.html
   code kiddy-app/src/app.js
   ```

2. **Test your changes locally**
   ```bash
   cd kiddy-app/src/
   python -m http.server 8080
   # Visit http://localhost:8080
   ```

3. **Sync to deployment**
   ```bash
   ./sync_deployment.sh
   ```

4. **Test deployment version**
   ```bash
   cd Deployment_v2.0/
   python -m http.server 8081
   # Visit http://localhost:8081
   ```

### ❌ Avoid This:
- DON'T edit files directly in `Deployment_v2.0/`
- DON'T make changes in multiple places
- DON'T forget to sync after changes

## 🔄 Sync Script Usage

The `sync_deployment.sh` script automatically:
- ✅ Copies all source files from `kiddy-app/` to `Deployment_v2.0/`
- ✅ Preserves SEO-specific files (`index_seo.html`, `style_seo.css`)
- ✅ Creates automatic backup
- ✅ Updates documentation

```bash
# Run sync after making changes in kiddy-app/
./sync_deployment.sh
```

## 📋 Development Checklist

- [ ] Make changes in `kiddy-app/src/`
- [ ] Test locally at localhost:8080
- [ ] Run `./sync_deployment.sh`
- [ ] Test deployment at localhost:8081
- [ ] Commit changes to git
- [ ] Deploy to production

## 🎨 File Relationships

| Source File | Deployment File | Purpose |
|-------------|----------------|---------|
| `kiddy-app/src/index.html` | `Deployment_v2.0/index.html` | Basic landing page |
| `kiddy-app/src/style.css` | `Deployment_v2.0/style.css` | Basic styles |
| N/A | `Deployment_v2.0/index_seo.html` | SEO-optimized landing |
| N/A | `Deployment_v2.0/style_seo.css` | SEO + responsive styles |

## 🚀 Production Deployment

When ready for production:
1. Ensure all changes are in `kiddy-app/`
2. Run final sync: `./sync_deployment.sh`
3. Update AdSense IDs in SEO files
4. Upload `Deployment_v2.0/` to web server
5. Test live site

---
**Remember: `kiddy-app/` is your development environment, `Deployment_v2.0/` is your production package!**
