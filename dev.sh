#!/bin/bash

# Quick Development Helper Script
# Use this for common development tasks

case "$1" in
    "start")
        echo "🚀 Starting development server (SEO-optimized by default)..."
        cd kiddy-app/src && python -m http.server 8080
        echo "   🎯 Main page: http://localhost:8080/index.html (SEO-optimized)"
        ;;
    "test-deploy")
        echo "🧪 Starting deployment test server..."
        cd Deployment_v2.0 && python -m http.server 8081
        echo "   🎯 Main page: http://localhost:8081/index.html (SEO-optimized)"
        echo "   📄 Compatibility: http://localhost:8081/index_seo.html (same content)"
        ;;
    "sync")
        echo "🔄 Syncing deployment (SEO-optimized by default)..."
        ./sync_deployment.sh
        ;;
    "full-test")
        echo "🔄 Full sync and test..."
        ./sync_deployment.sh
        echo "🧪 Starting deployment test..."
        cd Deployment_v2.0 && python -m http.server 8081
        echo "   🎯 Main page: http://localhost:8081/index.html (SEO-optimized)"
        ;;
    *)
        echo "🎯 Kiddy Learning Platform - Development Helper"
        echo ""
        echo "Usage: ./dev.sh [command]"
        echo ""
        echo "Commands:"
        echo "  start       - Start development server (SEO-optimized, port 8080)"
        echo "  test-deploy - Start deployment test server (SEO-optimized, port 8081)"
        echo "  sync        - Sync SEO-optimized files to deployment"
        echo "  full-test   - Sync and test deployment"
        echo ""
        echo "Development Workflow:"
        echo "  1. Edit files in kiddy-app/src/ (SEO-optimized by default)"
        echo "  2. Run: ./dev.sh start (test changes)"
        echo "  3. Run: ./dev.sh sync (update deployment)"
        echo "  4. Run: ./dev.sh test-deploy (test deployment)"
        echo ""
        echo "📄 All files are now SEO-optimized by default:"
        echo "  🎯 index.html - SEO-optimized landing page"
        echo "  🎯 style.css - SEO + responsive styles"
        echo "  🚀 Ready for production deployment"
        ;;
esac
