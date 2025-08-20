#!/bin/bash

# 🎓 Kiddy Learning Hub - GitHub Repository Preparation Script
# This script prepares your project for GitHub by organizing files properly

echo "🎓 Preparing Kiddy Learning Hub for GitHub..."
echo "============================================="

# Create new organized structure
echo "📁 Creating organized directory structure..."
mkdir -p kiddy-app/{src,scripts,docs,assets}

# Copy main application files
echo "🎓 Copying main application files..."
cd Kindergarten/app
cp index.html style.css app.js ../../kiddy-app/src/
cp alphabet_* numbers_* shapes_* colors_* ../../kiddy-app/src/
cp README.md ../../kiddy-app/

# Copy development scripts
echo "🤖 Copying development scripts..."
cp generateImage.py generate_*_assets.py requirements.txt ../../kiddy-app/scripts/

# Copy documentation
echo "📚 Copying documentation..."
cp ../docs/PRD.md ../../kiddy-app/docs/
cd ../../

# Copy deployment guide if it exists
if [ -f "Deployment_v2.0/DEPLOYMENT_GUIDE.md" ]; then
    cp Deployment_v2.0/DEPLOYMENT_GUIDE.md kiddy-app/docs/
fi

# Create environment template
echo "⚙️ Creating environment template..."
cat > kiddy-app/scripts/.env.example << 'EOF'
# Google Gemini API Configuration
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Instructions:
# 1. Copy this file to .env
# 2. Replace 'your_gemini_api_key_here' with your actual API key
# 3. Never commit the .env file to GitHub
EOF

# Create development setup guide
echo "📖 Creating development guide..."
cat > kiddy-app/docs/DEVELOPMENT.md << 'EOF'
# 🛠️ Development Guide

## Prerequisites
- Python 3.8+
- Google Gemini API key

## Setup
1. Clone the repository
2. Copy `scripts/.env.example` to `scripts/.env`
3. Add your Gemini API key to `scripts/.env`
4. Install dependencies: `pip install -r scripts/requirements.txt`

## Generating Assets
```bash
cd scripts
python generate_alphabet_assets.py
python generate_numbers_assets.py
python generate_shapes_assets.py
python generate_colors_assets.py
```

## Local Testing
```bash
cd src
python -m http.server 8080
# Open http://localhost:8080
```
EOF

# Asset handling decision
echo ""
echo "🎨 Asset Handling Decision Required:"
echo "=================================="
echo "Your project has 296 educational assets (~8MB total)"
echo ""
echo "Options:"
echo "1. Include assets in GitHub (complete repository)"
echo "2. Exclude assets (code-only, users generate locally)"
echo "3. Use Git LFS for large assets"
echo ""
read -p "Choose option (1/2/3): " asset_choice

case $asset_choice in
    1)
        echo "📦 Including all assets in repository..."
        cp -r Kindergarten/app/assets kiddy-app/assets/alphabet
        cp -r Kindergarten/app/numbers_assets kiddy-app/assets/numbers
        cp -r Kindergarten/app/shapes_assets kiddy-app/assets/shapes
        cp -r Kindergarten/app/colors_assets kiddy-app/assets/colors
        # Update .gitignore to allow assets
        sed -i '' 's/# \*\*\/assets\//# Assets included in repository/' .gitignore
        ;;
    2)
        echo "🚫 Excluding assets from repository..."
        echo "Users will need to generate assets locally using scripts"
        # Keep assets excluded in .gitignore
        ;;
    3)
        echo "📦 Setting up Git LFS for assets..."
        cp -r Kindergarten/app/assets kiddy-app/assets/alphabet
        cp -r Kindergarten/app/numbers_assets kiddy-app/assets/numbers
        cp -r Kindergarten/app/shapes_assets kiddy-app/assets/shapes
        cp -r Kindergarten/app/colors_assets kiddy-app/assets/colors
        # Create .gitattributes for LFS
        cat > kiddy-app/.gitattributes << 'EOF'
# Git LFS Configuration for Large Assets
*.webp filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
assets/** filter=lfs diff=lfs merge=lfs -text
EOF
        echo "📝 Note: Install Git LFS: https://git-lfs.github.io/"
        ;;
esac

# Copy updated .gitignore
cp .gitignore kiddy-app/

# Create a proper README for GitHub
echo "📖 Creating GitHub README..."
cat > kiddy-app/README.md << 'EOF'
# 🎓 Kiddy Learning Hub

> A comprehensive interactive educational platform for kindergarten children (ages 3-6)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-Web-blue)](https://github.com/yourusername/kiddy-learning-hub)
[![Apps](https://img.shields.io/badge/Apps-4%20Complete-green)](https://github.com/yourusername/kiddy-learning-hub)

## 🌟 Features

- 🔤 **ABC Letters** - Alphabet recognition with phonetics (A-Z)
- 🔢 **Number Fun** - Counting and number recognition (1-100)  
- 🔺 **Shape Explorer** - Basic geometric shapes learning
- 🎨 **Color World** - Color recognition and mixing

## 🚀 Quick Start

### Live Demo
[View Live Demo](https://your-demo-url.com) 

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/kiddy-learning-hub.git
cd kiddy-learning-hub

# Start local server
cd src
python -m http.server 8080

# Open http://localhost:8080
```

### Asset Generation (Optional)
If assets aren't included, generate them:
```bash
cd scripts
pip install -r requirements.txt
# Add your Gemini API key to .env
python generate_alphabet_assets.py
python generate_numbers_assets.py
python generate_shapes_assets.py
python generate_colors_assets.py
```

## 📚 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [Development Setup](docs/DEVELOPMENT.md)
- [Product Requirements](docs/PRD.md)

## 🎯 Educational Objectives

- **Pre-Literacy**: Alphabet recognition and phonetics
- **Pre-Math**: Number recognition and counting
- **Visual Processing**: Shape and color identification
- **Cognitive Development**: Pattern recognition and memory
- **Multi-Modal Learning**: Visual + auditory reinforcement

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Assets**: AI-generated with Google Gemini 2.0 Flash
- **Audio**: Text-to-Speech (gTTS)
- **Hosting**: Static web hosting compatible

## 📱 Compatibility

- ✅ Chrome 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Mobile browsers (iOS/Android)
- ✅ Tablet optimized

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Google Gemini 2.0 Flash for AI-generated educational content
- Early childhood education principles and best practices
- Open source community for inspiration and tools

---

**Made with ❤️ for young learners everywhere**
EOF

echo ""
echo "✅ GitHub Repository Preparation Complete!"
echo "========================================"
echo ""
echo "📁 Your organized repository is ready in: ./kiddy-app/"
echo ""
echo "🚀 Next Steps:"
echo "1. cd kiddy-app"
echo "2. git init"
echo "3. git add ."
echo "4. git commit -m 'Initial commit: Kiddy Learning Hub v2.0'"
echo "5. Create repository on GitHub"
echo "6. git remote add origin https://github.com/yourusername/kiddy-app.git"
echo "7. git push -u origin main"
echo ""
echo "📝 Don't forget to:"
echo "- Add a LICENSE file"
echo "- Update the GitHub README with your actual demo URL"
echo "- Create GitHub issues for any planned features"
echo "- Set up GitHub Pages for easy demo hosting"
echo ""
echo "🎓 Ready to share your educational platform with the world! 🌟"
