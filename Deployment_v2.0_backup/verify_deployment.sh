#!/bin/bash

# Kiddy Learning Hub v2.0 - Deployment Verification Script
# Run this script to verify your deployment is complete and functional

echo "🎓 Kiddy Learning Hub v2.0 - Deployment Verification"
echo "=================================================="

# Check if all required files are present
echo ""
echo "📁 Checking Core Files..."

files_to_check=(
    "index.html"
    "style.css" 
    "app.js"
    "README.md"
    "DEPLOYMENT_GUIDE.md"
    "alphabet_index.html"
    "alphabet_style.css"
    "alphabet_app.js"
    "numbers_index.html"
    "numbers_style.css"
    "numbers_app.js"
    "shapes_index.html"
    "shapes_style.css"
    "shapes_app.js"
    "colors_index.html"
    "colors_style.css"
    "colors_app.js"
)

missing_files=0
for file in "${files_to_check[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING!"
        missing_files=$((missing_files + 1))
    fi
done

# Check asset directories
echo ""
echo "📂 Checking Asset Directories..."

asset_dirs=(
    "assets"
    "numbers_assets"
    "shapes_assets"
    "colors_assets"
)

missing_dirs=0
for dir in "${asset_dirs[@]}"; do
    if [[ -d "$dir" ]]; then
        file_count=$(find "$dir" -type f | wc -l)
        echo "✅ $dir/ ($file_count files)"
    else
        echo "❌ $dir/ - MISSING!"
        missing_dirs=$((missing_dirs + 1))
    fi
done

# Check for development files that shouldn't be deployed
echo ""
echo "🧹 Checking for Development Files..."

dev_files=(
    ".env"
    "__pycache__"
    "requirements.txt"
    "generate_*.py"
    "test_*.py"
    "create_*.py"
    "enhanced_*"
    "main_*"
)

dev_files_found=0
for pattern in "${dev_files[@]}"; do
    if ls $pattern 1> /dev/null 2>&1; then
        echo "⚠️  Development files found: $pattern"
        dev_files_found=$((dev_files_found + 1))
    fi
done

if [[ $dev_files_found -eq 0 ]]; then
    echo "✅ No development files found - Clean deployment!"
fi

# Summary
echo ""
echo "📊 Deployment Summary"
echo "===================="

total_files=$(find . -type f | wc -l)
total_size=$(du -sh . | cut -f1)

echo "📁 Total Files: $total_files"
echo "💾 Total Size: $total_size"

if [[ $missing_files -eq 0 && $missing_dirs -eq 0 ]]; then
    echo ""
    echo "🎉 DEPLOYMENT READY!"
    echo "✅ All required files present"
    echo "✅ All asset directories found"
    echo "✅ Ready for web server upload"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Upload all files to your web server"
    echo "2. Set index.html as default page"
    echo "3. Test at your domain"
    echo "4. Share with young learners!"
else
    echo ""
    echo "❌ DEPLOYMENT INCOMPLETE"
    echo "Missing files: $missing_files"
    echo "Missing directories: $missing_dirs"
    echo "Please check the issues above before deploying."
fi

echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo "📚 For technical details, see README.md"
