// Color World - Interactive Colors Learning App

// Color data with descriptions and examples
const colorData = {
    red: {
        name: 'Red',
        description: 'A warm, bright color like fire and roses',
        className: 'red',
        examples: ['🍎 apple', '🌹 rose', '🚗 fire truck', '❤️ heart', '🍓 strawberry']
    },
    blue: {
        name: 'Blue',
        description: 'A cool, calm color like the sky and ocean',
        className: 'blue',
        examples: ['🌊 ocean', '☁️ sky', '🫐 blueberry', '👖 jeans', '🐋 whale']
    },
    yellow: {
        name: 'Yellow',
        description: 'A bright, cheerful color like the sun',
        className: 'yellow',
        examples: ['☀️ sun', '🍌 banana', '🌻 sunflower', '🐣 chick', '🧀 cheese']
    },
    green: {
        name: 'Green',
        description: 'A natural color like grass and leaves',
        className: 'green',
        examples: ['🌱 grass', '🍃 leaves', '🐸 frog', '🥒 cucumber', '🌲 tree']
    },
    orange: {
        name: 'Orange',
        description: 'A warm color between red and yellow',
        className: 'orange',
        examples: ['🍊 orange', '🥕 carrot', '🎃 pumpkin', '🦊 fox', '🔥 fire']
    },
    purple: {
        name: 'Purple',
        description: 'A royal color made from red and blue',
        className: 'purple',
        examples: ['🍇 grapes', '🦄 unicorn', '👑 crown', '🌸 flower', '🍆 eggplant']
    },
    pink: {
        name: 'Pink',
        description: 'A soft, gentle color like cotton candy',
        className: 'pink',
        examples: ['🌸 cherry blossom', '🐷 pig', '💖 heart', '🎀 bow', '🍑 peach']
    },
    brown: {
        name: 'Brown',
        description: 'An earthy color like tree bark and soil',
        className: 'brown',
        examples: ['🌳 tree trunk', '🐻 bear', '🍫 chocolate', '🥜 nuts', '🏠 wood']
    },
    black: {
        name: 'Black',
        description: 'The darkest color, like the night sky',
        className: 'black',
        examples: ['🌙 night', '🐧 penguin', '⚫ circle', '🖤 heart', '🐈‍⬛ cat']
    },
    white: {
        name: 'White',
        description: 'The lightest color, like fresh snow',
        className: 'white',
        examples: ['❄️ snow', '☁️ clouds', '🐑 sheep', '🥛 milk', '🦢 swan']
    },
    gray: {
        name: 'Gray',
        description: 'A neutral color between black and white',
        className: 'gray',
        examples: ['🐘 elephant', '☁️ storm clouds', '🪨 rock', '🐭 mouse', '🏢 building']
    },
    turquoise: {
        name: 'Turquoise',
        description: 'A beautiful blue-green color like tropical water',
        className: 'turquoise',
        examples: ['🏝️ tropical water', '💎 gemstone', '🦚 peacock', '🌊 lagoon', '💙 jewel']
    }
};

// Color mixing combinations
const colorMixes = {
    'red,blue': { result: 'purple', color: '#5352ed' },
    'blue,yellow': { result: 'green', color: '#2ed573' },
    'red,yellow': { result: 'orange', color: '#ff6348' },
    'red,white': { result: 'pink', color: '#ff3838' },
    'black,white': { result: 'gray', color: '#747d8c' }
};

// App state
let currentColorIndex = 0;
let colorKeys = Object.keys(colorData);
let completedColors = new Set();
let currentAudio = null;
let mixingMode = false;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    generateColorsGrid();
    updateDisplay();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    console.log('Color World initialized!');
});

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('kiddyHub_colorsCompleted');
    if (saved) {
        completedColors = new Set(JSON.parse(saved));
    }
    updateMainProgress();
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('kiddyHub_colorsCompleted', JSON.stringify([...completedColors]));
    localStorage.setItem('kiddyHub_colorsProgress', completedColors.size.toString());
    updateMainProgress();
}

// Update main progress bar
function updateMainProgress() {
    const progressFill = document.getElementById('mainProgress');
    const progressCount = document.getElementById('progressCount');
    
    const percentage = (completedColors.size / colorKeys.length) * 100;
    progressFill.style.width = percentage + '%';
    progressCount.textContent = `${completedColors.size}/${colorKeys.length}`;
    
    // Update hub progress if function exists
    if (typeof updateProgress === 'function') {
        updateProgress('colors', completedColors.size, colorKeys.length);
    }
}

// Generate colors grid
function generateColorsGrid() {
    const grid = document.getElementById('colorsGrid');
    grid.innerHTML = '';
    
    colorKeys.forEach((colorKey, index) => {
        const colorInfo = colorData[colorKey];
        const card = document.createElement('div');
        card.className = 'color-card';
        card.onclick = () => selectColor(index);
        
        if (index === currentColorIndex) {
            card.classList.add('active');
        }
        
        if (completedColors.has(colorKey)) {
            card.classList.add('completed');
        }
        
        // Create color circle for the card
        const colorCircle = document.createElement('div');
        colorCircle.className = `card-color-circle ${colorInfo.className}`;
        
        const colorName = document.createElement('div');
        colorName.className = 'card-color-name';
        colorName.textContent = colorInfo.name;
        
        card.appendChild(colorCircle);
        card.appendChild(colorName);
        grid.appendChild(card);
    });
}

// Select a color
function selectColor(index) {
    currentColorIndex = index;
    const colorKey = colorKeys[index];
    
    // Mark as completed
    completedColors.add(colorKey);
    saveProgress();
    
    updateDisplay();
    generateColorsGrid();
    
    // Auto-play audio
    setTimeout(() => {
        playColorAudio();
    }, 300);
}

// Update main display
function updateDisplay() {
    const colorKey = colorKeys[currentColorIndex];
    const colorInfo = colorData[colorKey];
    
    // Update color counter
    document.getElementById('colorCounter').textContent = `Color ${currentColorIndex + 1} of ${colorKeys.length}`;
    
    // Update color display
    const colorCircle = document.getElementById('colorCircle');
    colorCircle.className = `color-circle ${colorInfo.className}`;
    colorCircle.onclick = () => playColorAudio();
    
    // Update text content
    document.getElementById('colorName').textContent = colorInfo.name;
    document.getElementById('colorDescription').textContent = colorInfo.description;
    
    // Update examples
    updateExamples(colorInfo.examples);
    
    // Load color image if available
    loadColorImage();
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Update examples display
function updateExamples(examples) {
    const examplesList = document.getElementById('examplesList');
    examplesList.innerHTML = '';
    
    examples.forEach(example => {
        const item = document.createElement('div');
        item.className = 'example-item';
        item.textContent = example;
        examplesList.appendChild(item);
    });
}

// Load color image
function loadColorImage() {
    const img = document.getElementById('colorImage');
    const colorKey = colorKeys[currentColorIndex];
    const imagePath = `colors_assets/${colorKey}.webp`;
    
    // Check if image exists
    img.onload = function() {
        img.classList.remove('hidden');
    };
    
    img.onerror = function() {
        img.classList.add('hidden');
    };
    
    img.src = imagePath;
}

// Play color audio
function playColorAudio() {
    if (currentAudio) {
        currentAudio.pause();
    }
    
    const colorKey = colorKeys[currentColorIndex];
    const audioPath = `colors_assets/${colorKey}.mp3`;
    currentAudio = new Audio(audioPath);
    
    currentAudio.onerror = function() {
        // If audio file doesn't exist, use text-to-speech as fallback
        speakColor();
    };
    
    currentAudio.play().catch(() => {
        // Fallback to speech synthesis
        speakColor();
    });
}

// Text-to-speech fallback
function speakColor() {
    if ('speechSynthesis' in window) {
        const colorInfo = colorData[colorKeys[currentColorIndex]];
        const utterance = new SpeechSynthesisUtterance(
            `${colorInfo.name}. ${colorInfo.description}`
        );
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
    }
}

// Navigation functions
function previousColor() {
    if (currentColorIndex > 0) {
        selectColor(currentColorIndex - 1);
    }
}

function nextColor() {
    if (currentColorIndex < colorKeys.length - 1) {
        selectColor(currentColorIndex + 1);
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentColorIndex === 0;
    nextBtn.disabled = currentColorIndex === colorKeys.length - 1;
}

// Show color mixing interface
function showColorMixing() {
    const mixingSection = document.getElementById('colorMixing');
    mixingSection.classList.remove('hidden');
    mixingMode = true;
}

// Hide color mixing interface
function hideMixing() {
    const mixingSection = document.getElementById('colorMixing');
    mixingSection.classList.add('hidden');
    mixingMode = false;
}

// Try color mixing animation
function tryMixing() {
    const mixResult = document.getElementById('mixResult');
    
    // Animate the mixing process
    mixResult.style.transform = 'scale(1.3)';
    mixResult.style.transition = 'all 0.5s ease';
    
    setTimeout(() => {
        mixResult.style.transform = 'scale(1)';
        
        // Speak the result
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('Red plus blue makes purple!');
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
        }
    }, 500);
}

// Select mix color (placeholder for future enhancement)
function selectMixColor(index) {
    console.log('Selected mix color:', index);
    // Future: Allow users to select different colors to mix
}

// Keyboard navigation
function handleKeyboard(event) {
    if (mixingMode && event.key === 'Escape') {
        hideMixing();
        return;
    }
    
    switch(event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            previousColor();
            break;
        case 'ArrowRight':
            event.preventDefault();
            nextColor();
            break;
        case ' ':
        case 'Enter':
            event.preventDefault();
            playColorAudio();
            break;
        case 'Escape':
            returnToHub();
            break;
        case 'm':
        case 'M':
            showColorMixing();
            break;
    }
}

// Reset progress function
function resetProgress() {
    if (confirm('Are you sure you want to start over? This will reset all your progress!')) {
        // Clear completed colors
        completedColors.clear();
        
        // Reset to first color
        currentColorIndex = 0;
        
        // Clear localStorage
        localStorage.removeItem('colorsProgress');
        localStorage.removeItem('colorsCurrentIndex');
        
        // Hide mixing if open
        hideMixing();
        
        // Update display
        displayColor();
        updateProgress();
        
        console.log('Colors progress reset successfully');
    }
}

// Random color function
function randomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    selectColor(colors[randomIndex]);
}

// Return to main hub
function returnToHub() {
    window.location.href = 'index.html';
}

// Global function exports
window.selectColor = selectColor;
window.previousColor = previousColor;
window.nextColor = nextColor;
window.playColorAudio = playColorAudio;
window.showColorMixing = showColorMixing;
window.hideMixing = hideMixing;
window.tryMixing = tryMixing;
window.selectMixColor = selectMixColor;
window.resetProgress = resetProgress;
window.randomColor = randomColor;
window.returnToHub = returnToHub;
