#!/bin/bash

# Kiddy Learning Platform - SEO-First Sync Script
# This script makes SEO-optimized files the default and syncs everything

echo "🚀 Starting SEO-first sync: Making SEO the default..."

# Create backup of current deployment
echo "📦 Creating backup of current deployment..."
if [ -d "Deployment_v2.0_backup" ]; then
    rm -rf Deployment_v2.0_backup
fi
cp -r Deployment_v2.0 Deployment_v2.0_backup

# Step 1: Replace basic files with SEO versions in main source
echo "🎯 Making SEO files the default in main source (kiddy-app/src/)..."

# Replace basic files with SEO-optimized versions
if [ -f "Deployment_v2.0/index_seo.html" ]; then
    cp Deployment_v2.0/index_seo.html kiddy-app/src/index.html
    echo "   ✅ Replaced index.html with SEO-optimized version"
fi

if [ -f "Deployment_v2.0/style_seo.css" ]; then
    cp Deployment_v2.0/style_seo.css kiddy-app/src/style.css
    echo "   ✅ Replaced style.css with SEO-optimized version"
fi

# Remove old SEO files since they're now the default
if [ -f "kiddy-app/src/index_seo.html" ]; then
    rm kiddy-app/src/index_seo.html
    echo "   🗑️  Removed separate index_seo.html (now default)"
fi

if [ -f "kiddy-app/src/style_seo.css" ]; then
    rm kiddy-app/src/style_seo.css
    echo "   🗑️  Removed separate style_seo.css (now default)"
fi

# Step 2: Sync from kiddy-app to deployment

# Step 2: Sync from kiddy-app to deployment
echo "📁 Syncing SEO-optimized files to deployment..."

# Copy core source files (now SEO-optimized) from kiddy-app to deployment
cp kiddy-app/src/index.html Deployment_v2.0/index.html
cp kiddy-app/src/style.css Deployment_v2.0/style.css
cp kiddy-app/src/app.js Deployment_v2.0/app.js

# Also maintain SEO versions for compatibility
cp kiddy-app/src/index.html Deployment_v2.0/index_seo.html
cp kiddy-app/src/style.css Deployment_v2.0/style_seo.css
echo "   ✅ Created compatibility copies (index_seo.html, style_seo.css)"

# Copy individual app files
echo "🎯 Syncing individual learning apps..."

# Alphabet App
cp kiddy-app/src/alphabet_index.html Deployment_v2.0/alphabet_index.html
cp kiddy-app/src/alphabet_style.css Deployment_v2.0/alphabet_style.css
cp kiddy-app/src/alphabet_app.js Deployment_v2.0/alphabet_app.js

# Numbers App
cp kiddy-app/src/numbers_index.html Deployment_v2.0/numbers_index.html
cp kiddy-app/src/numbers_style.css Deployment_v2.0/numbers_style.css
cp kiddy-app/src/numbers_app.js Deployment_v2.0/numbers_app.js

# Shapes App
cp kiddy-app/src/shapes_index.html Deployment_v2.0/shapes_index.html
cp kiddy-app/src/shapes_style.css Deployment_v2.0/shapes_style.css
cp kiddy-app/src/shapes_app.js Deployment_v2.0/shapes_app.js

# Colors App
cp kiddy-app/src/colors_index.html Deployment_v2.0/colors_index.html
cp kiddy-app/src/colors_style.css Deployment_v2.0/colors_style.css
cp kiddy-app/src/colors_app.js Deployment_v2.0/colors_app.js

# Legal and Information Pages
echo "📋 Syncing legal and information pages..."
cp kiddy-app/src/privacy-policy.html Deployment_v2.0/privacy-policy.html
cp kiddy-app/src/terms-of-service.html Deployment_v2.0/terms-of-service.html
cp kiddy-app/src/contact.html Deployment_v2.0/contact.html
cp kiddy-app/src/about.html Deployment_v2.0/about.html

# Copy assets folder
echo "🎨 Syncing assets..."
if [ -d "kiddy-app/assets" ]; then
    cp -r kiddy-app/assets/* Deployment_v2.0/assets/
fi

# Update documentation
echo "📚 Syncing documentation..."
cp kiddy-app/README.md Deployment_v2.0/README.md

echo "✅ SEO-first sync completed successfully!"
echo "📍 Main source: kiddy-app/src/ (now SEO-optimized by default)"
echo "📍 Deployment ready: Deployment_v2.0/"
echo ""
echo "📄 All files are now SEO-optimized:"
echo "   • index.html (SEO-optimized, production ready)"
echo "   • style.css (SEO + responsive, production ready)"
echo "   • Compatibility: index_seo.html + style_seo.css (same content)"
echo ""
echo "📋 Legal pages included:"
echo "   • privacy-policy.html (COPPA compliant)"
echo "   • terms-of-service.html (comprehensive terms)"
echo "   • contact.html (multiple contact methods)"
echo "   • about.html (mission and values)"
echo ""
echo "⚠️  Remember to:"
echo "   1. Make all changes in kiddy-app/src/ (now SEO by default)"
echo "   2. Run this sync script to update deployment"
echo "   3. Update AdSense IDs in files before going live"
echo "   4. Replace 'your-domain.com' with actual domain"
echo "   5. Update email addresses in legal pages"
echo ""
echo "🎯 Note: SEO optimization is now the default for all files"
