// Kiddy Learning Hub - Main Navigation JavaScript

// App configuration
const apps = {
    alphabet: {
        title: 'ABC Letters',
        file: 'alphabet_index.html',
        description: 'Learn the alphabet A-Z'
    },
    numbers: {
        title: 'Number Fun',
        file: 'numbers_index.html',
        description: 'Count and learn numbers 1-100'
    },
    shapes: {
        title: 'Shape Explorer',
        file: 'shapes_index.html',
        description: 'Discover shapes and geometry'
    },
    colors: {
        title: 'Color World',
        file: 'colors_index.html',
        description: 'Learn colors and art'
    }
};

// Initialize the main hub
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kiddy Learning Hub initialized!');
    
    // Add click animations to app cards
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach(card => {
        card.addEventListener('click', function() {
            if (!this.classList.contains('coming-soon')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });

    // Load progress from localStorage
    loadProgress();
});

// Open specific learning app
function openApp(appName) {
    const app = apps[appName];
    if (!app) {
        console.error('App not found:', appName);
        return;
    }

    // Save current location
    localStorage.setItem('kiddyHub_returnTo', 'main');
    localStorage.setItem('kiddyHub_currentApp', appName);

    // Navigate to app
    if (appName === 'alphabet') {
        window.location.href = app.file;
    } else if (appName === 'numbers') {
        window.location.href = app.file;
    } else if (appName === 'shapes') {
        window.location.href = app.file;
    } else if (appName === 'colors') {
        window.location.href = app.file;
    } else {
        alert('This app is coming soon! 🚀');
    }
}

// Load and display progress for each app
function loadProgress() {
    // Alphabet progress (already complete)
    const alphabetCard = document.querySelector('.app-card[data-app="alphabet"]');
    if (alphabetCard) {
        const progressFill = alphabetCard.querySelector('.progress-fill');
        const progressText = alphabetCard.querySelector('.progress-text');
        progressFill.style.width = '100%';
        progressText.textContent = '26/26 Letters';
    }

    // Numbers progress
    const numbersProgress = localStorage.getItem('kiddyHub_numbersProgress') || '0';
    const numbersCard = document.querySelector('.app-card[data-app="numbers"]');
    if (numbersCard) {
        const progressFill = numbersCard.querySelector('.progress-fill');
        const progressText = numbersCard.querySelector('.progress-text');
        const percentage = Math.min((parseInt(numbersProgress) / 100) * 100, 100);
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${numbersProgress}/100 Numbers`;
    }

    // Shapes progress
    const shapesProgress = localStorage.getItem('kiddyHub_shapesProgress') || '0';
    const shapesCard = document.querySelector('.app-card[data-app="shapes"]');
    if (shapesCard) {
        const progressFill = shapesCard.querySelector('.progress-fill');
        const progressText = shapesCard.querySelector('.progress-text');
        const percentage = Math.min((parseInt(shapesProgress) / 10) * 100, 100);
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${shapesProgress}/10 Shapes`;
    }

    // Colors progress
    const colorsProgress = localStorage.getItem('kiddyHub_colorsProgress') || '0';
    const colorsCard = document.querySelector('.app-card[data-app="colors"]');
    if (colorsCard) {
        const progressFill = colorsCard.querySelector('.progress-fill');
        const progressText = colorsCard.querySelector('.progress-text');
        const percentage = Math.min((parseInt(colorsProgress) / 12) * 100, 100);
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${colorsProgress}/12 Colors`;
    }
}

// Return to hub from other apps
function returnToHub() {
    window.location.href = 'main_index.html';
}

// Update progress for specific app
function updateProgress(appName, current, total) {
    localStorage.setItem(`kiddyHub_${appName}Progress`, current);
    
    // Update display if on main page
    const card = document.querySelector(`.app-card[data-app="${appName}"]`);
    if (card) {
        const progressFill = card.querySelector('.progress-fill');
        const progressText = card.querySelector('.progress-text');
        const percentage = (current / total) * 100;
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${current}/${total} ${appName === 'numbers' ? 'Numbers' : 'Items'}`;
    }
}

// Global functions for app navigation
window.openApp = openApp;
window.returnToHub = returnToHub;
window.updateProgress = updateProgress;
