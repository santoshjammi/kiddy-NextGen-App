// Production-Ready ABC Fun Land App
// Simplified and optimized for deployment

// Alphabet data with all 26 letters
const alphabetData = {
  A: { word: 'Apple', image: 'assets/apple.webp', audio: 'assets/apple.mp3' },
  B: { word: 'Ball', image: 'assets/ball.webp', audio: 'assets/ball.mp3' },
  C: { word: 'Cat', image: 'assets/cat.webp', audio: 'assets/cat.mp3' },
  D: { word: 'Dog', image: 'assets/dog.webp', audio: 'assets/dog.mp3' },
  E: { word: 'Elephant', image: 'assets/elephant.webp', audio: 'assets/elephant.mp3' },
  F: { word: 'Fish', image: 'assets/fish.webp', audio: 'assets/fish.mp3' },
  G: { word: 'Grapes', image: 'assets/grapes.webp', audio: 'assets/grapes.mp3' },
  H: { word: 'Hat', image: 'assets/hat.webp', audio: 'assets/hat.mp3' },
  I: { word: 'Ice Cream', image: 'assets/icecream.webp', audio: 'assets/icecream.mp3' },
  J: { word: 'Juice', image: 'assets/juice.webp', audio: 'assets/juice.mp3' },
  K: { word: 'Kite', image: 'assets/kite.webp', audio: 'assets/kite.mp3' },
  L: { word: 'Lion', image: 'assets/lion.webp', audio: 'assets/lion.mp3' },
  M: { word: 'Monkey', image: 'assets/monkey.webp', audio: 'assets/monkey.mp3' },
  N: { word: 'Nest', image: 'assets/nest.webp', audio: 'assets/nest.mp3' },
  O: { word: 'Orange', image: 'assets/orange.webp', audio: 'assets/orange.mp3' },
  P: { word: 'Penguin', image: 'assets/penguin.webp', audio: 'assets/penguin.mp3' },
  Q: { word: 'Queen', image: 'assets/queen.webp', audio: 'assets/queen.mp3' },
  R: { word: 'Rabbit', image: 'assets/rabbit.webp', audio: 'assets/rabbit.mp3' },
  S: { word: 'Sun', image: 'assets/sun.webp', audio: 'assets/sun.mp3' },
  T: { word: 'Tiger', image: 'assets/tiger.webp', audio: 'assets/tiger.mp3' },
  U: { word: 'Umbrella', image: 'assets/umbrella.webp', audio: 'assets/umbrella.mp3' },
  V: { word: 'Violin', image: 'assets/violin.webp', audio: 'assets/violin.mp3' },
  W: { word: 'Whale', image: 'assets/whale.webp', audio: 'assets/whale.mp3' },
  X: { word: 'Xylophone', image: 'assets/xylophone.webp', audio: 'assets/xylophone.mp3' },
  Y: { word: 'Yacht', image: 'assets/yacht.webp', audio: 'assets/yacht.mp3' },
  Z: { word: 'Zebra', image: 'assets/zebra.webp', audio: 'assets/zebra.mp3' }
};

// Game state
let currentLetter = null;
let visitedLetters = new Set();
let currentAudio = null;

// DOM elements
let elements = {};

// Return to hub function
function returnToHub() {
    window.location.href = 'index.html';
}

// Simple sound effect
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silently fail if Web Audio API not supported
    }
}

function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Silently fail if Web Audio API not supported
    }
}

// Preload assets for better performance
function preloadAssets() {
    Object.values(alphabetData).forEach(({ image, audio }) => {
        // Preload images
        const img = new Image();
        img.src = image;
        
        // Preload audio
        const aud = new Audio();
        aud.src = audio;
        aud.preload = 'auto';
    });
}

// Create alphabet grid
function createAlphabetGrid() {
    const grid = elements.alphabetGrid;
    grid.innerHTML = '';
    
    for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(65 + i);
        const data = alphabetData[letter];
        
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.setAttribute('data-letter', letter);
        
        card.innerHTML = `
            <div class="letter-display">${letter}</div>
            <div class="letter-name">${data.word}</div>
        `;
        
        card.addEventListener('click', () => selectLetter(letter));
        card.addEventListener('mouseenter', playClickSound);
        
        grid.appendChild(card);
    }
}

// Select letter with feedback
function selectLetter(letter) {
    const data = alphabetData[letter];
    if (!data) return;
    
    // Update active state
    document.querySelectorAll('.letter-card').forEach(card => {
        card.classList.remove('active');
    });
    
    const selectedCard = document.querySelector(`[data-letter="${letter}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    // Update display
    elements.currentLetter.textContent = letter;
    elements.currentWord.textContent = data.word;
    
    // Update image
    const img = elements.currentImage;
    img.src = data.image;
    img.alt = data.word;
    img.classList.remove('hidden');
    
    // Add celebration animation
    elements.mainDisplay.classList.add('celebrate');
    setTimeout(() => {
        elements.mainDisplay.classList.remove('celebrate');
    }, 600);
    
    // Play audio
    playAudio(data.audio);
    
    // Update progress
    if (!visitedLetters.has(letter)) {
        visitedLetters.add(letter);
        updateProgress();
        playSuccessSound();
    }
    
    // Show repeat button
    elements.repeatAudio.classList.remove('hidden');
    
    currentLetter = letter;
}

// Play audio with error handling
function playAudio(audioSrc) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    currentAudio = new Audio(audioSrc);
    currentAudio.volume = 0.8;
    
    currentAudio.play().catch(e => {
        console.log('Audio play failed:', e);
    });
}

// Update progress bar
function updateProgress() {
    const progressPercentage = (visitedLetters.size / 26) * 100;
    elements.progressBar.style.width = progressPercentage + '%';
    
    // Celebration when all letters are visited
    if (visitedLetters.size === 26) {
        setTimeout(() => {
            alert('🎉 Congratulations! You\'ve learned all the letters! 🎉');
        }, 500);
    }
}

// Random letter selection
function selectRandomLetter() {
    const letters = Object.keys(alphabetData);
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    selectLetter(randomLetter);
}

// Reset progress
function resetProgress() {
    visitedLetters.clear();
    updateProgress();
    
    // Clear active states
    document.querySelectorAll('.letter-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Reset display
    elements.currentLetter.textContent = '?';
    elements.currentWord.textContent = 'Click a letter to start!';
    elements.currentImage.classList.add('hidden');
    elements.repeatAudio.classList.add('hidden');
    
    currentLetter = null;
    
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
}

// Mascot interactions
function setupMascotInteractions() {
    const mascot = elements.mascot;
    const messages = [
        "Great job! 🌟",
        "Keep learning! 📚",
        "You're amazing! ✨",
        "Fun with letters! 🎨",
        "Learning is fun! 🎉"
    ];
    
    mascot.addEventListener('click', () => {
        const message = messages[Math.floor(Math.random() * messages.length)];
        alert(message); // Simple alert for production
        playSuccessSound();
    });
}

// Keyboard support
function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        const key = e.key.toUpperCase();
        
        // Letter keys A-Z
        if (key >= 'A' && key <= 'Z' && alphabetData[key]) {
            selectLetter(key);
        }
        
        // Space bar for random letter
        if (e.code === 'Space') {
            e.preventDefault();
            selectRandomLetter();
        }
        
        // Enter to repeat audio
        if (e.code === 'Enter' && currentLetter) {
            e.preventDefault();
            const data = alphabetData[currentLetter];
            if (data) {
                playAudio(data.audio);
            }
        }
    });
}

// Initialize DOM elements
function initializeElements() {
    elements = {
        alphabetGrid: document.getElementById('alphabet-grid'),
        mainDisplay: document.getElementById('main-display'),
        currentLetter: document.getElementById('current-letter'),
        currentWord: document.getElementById('current-word'),
        currentImage: document.getElementById('current-image'),
        progressBar: document.getElementById('progress-bar'),
        repeatAudio: document.getElementById('repeat-audio'),
        randomLetter: document.getElementById('random-letter'),
        resetProgress: document.getElementById('reset-progress'),
        mascot: document.getElementById('mascot'),
        loading: document.getElementById('loading'),
        app: document.getElementById('app')
    };
}

// Setup event listeners
function setupEventListeners() {
    elements.repeatAudio.addEventListener('click', () => {
        if (currentLetter) {
            const data = alphabetData[currentLetter];
            if (data) {
                playAudio(data.audio);
            }
        }
    });
    
    elements.randomLetter.addEventListener('click', selectRandomLetter);
    elements.resetProgress.addEventListener('click', resetProgress);
    
    setupMascotInteractions();
    setupKeyboardControls();
}

// App initialization
function initializeApp() {
    initializeElements();
    preloadAssets();
    createAlphabetGrid();
    setupEventListeners();
    
    // Hide loading and show app
    setTimeout(() => {
        elements.loading.style.display = 'none';
        elements.app.classList.remove('hidden');
        
        // Smooth entrance animation
        elements.app.style.opacity = '0';
        elements.app.style.transform = 'scale(0.9)';
        elements.app.style.transition = 'all 0.5s ease-out';
        
        setTimeout(() => {
            elements.app.style.opacity = '1';
            elements.app.style.transform = 'scale(1)';
        }, 100);
    }, 1500);
}

// Start the app
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle audio context for mobile devices
document.addEventListener('touchstart', () => {
    // Enable audio context on first touch for mobile
}, { once: true });
