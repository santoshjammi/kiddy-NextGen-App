// Shape Explorer - Interactive Shapes Learning App

// Shape data with descriptions and fun facts
const shapeData = {
    circle: {
        name: 'Circle',
        description: 'A round shape with no corners',
        funFact: 'Circles are everywhere! Look for wheels, balls, and the sun!',
        className: 'circle',
        examples: ['wheel', 'ball', 'sun', 'moon', 'pizza']
    },
    square: {
        name: 'Square',
        description: 'A shape with 4 equal sides and 4 corners',
        funFact: 'Squares have 4 equal sides and 4 right angles. Windows are often square!',
        className: 'square',
        examples: ['window', 'book', 'box', 'tile', 'picture frame']
    },
    triangle: {
        name: 'Triangle',
        description: 'A shape with 3 sides and 3 corners',
        funFact: 'Triangles are the strongest shape! That\'s why we see them in bridges.',
        className: 'triangle',
        examples: ['roof', 'mountain', 'slice of pizza', 'arrow', 'sail']
    },
    rectangle: {
        name: 'Rectangle',
        description: 'A shape with 4 sides, opposite sides are equal',
        funFact: 'Your TV screen, tablet, and most doors are rectangles!',
        className: 'rectangle',
        examples: ['door', 'TV', 'book', 'phone', 'envelope']
    },
    oval: {
        name: 'Oval',
        description: 'A stretched circle shape, like an egg',
        funFact: 'Eggs are oval shaped because it\'s the strongest shape for thin shells!',
        className: 'oval',
        examples: ['egg', 'face', 'mirror', 'track', 'balloon']
    },
    diamond: {
        name: 'Diamond',
        description: 'A square turned on its point',
        funFact: 'Diamonds sparkle because of their special shape! Baseball fields are diamond-shaped too.',
        className: 'diamond',
        examples: ['jewel', 'baseball field', 'kite', 'road sign', 'playing card']
    },
    star: {
        name: 'Star',
        description: 'A shape with pointed rays going outward',
        funFact: 'Real stars in the sky are actually sphere-shaped, but they look pointy because they\'re so bright!',
        className: 'star',
        examples: ['flag', 'decoration', 'award', 'sheriff badge', 'sea star']
    },
    heart: {
        name: 'Heart',
        description: 'A special shape that means love and caring',
        funFact: 'The heart shape doesn\'t look like a real heart, but it\'s been a symbol of love for hundreds of years!',
        className: 'heart',
        examples: ['valentine', 'emoji', 'decoration', 'candy', 'card']
    },
    hexagon: {
        name: 'Hexagon',
        description: 'A shape with 6 equal sides',
        funFact: 'Bees make their honeycombs in hexagon shapes because it uses the least wax and is super strong!',
        className: 'hexagon',
        examples: ['honeycomb', 'nut', 'soccer ball patch', 'snowflake', 'tile']
    }
};

// App state
let currentShapeIndex = 0;
let shapeKeys = Object.keys(shapeData);
let completedShapes = new Set();
let currentAudio = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    generateShapesGrid();
    updateDisplay();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    console.log('Shape Explorer initialized!');
});

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('kiddyHub_shapesCompleted');
    if (saved) {
        completedShapes = new Set(JSON.parse(saved));
    }
    updateMainProgress();
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('kiddyHub_shapesCompleted', JSON.stringify([...completedShapes]));
    localStorage.setItem('kiddyHub_shapesProgress', completedShapes.size.toString());
    updateMainProgress();
}

// Update main progress bar
function updateMainProgress() {
    const progressFill = document.getElementById('mainProgress');
    const progressCount = document.getElementById('progressCount');
    
    const percentage = (completedShapes.size / shapeKeys.length) * 100;
    progressFill.style.width = percentage + '%';
    progressCount.textContent = `${completedShapes.size}/${shapeKeys.length}`;
    
    // Update hub progress if function exists
    if (typeof updateProgress === 'function') {
        updateProgress('shapes', completedShapes.size, shapeKeys.length);
    }
}

// Generate shapes grid
function generateShapesGrid() {
    const grid = document.getElementById('shapesGrid');
    grid.innerHTML = '';
    
    shapeKeys.forEach((shapeKey, index) => {
        const shapeInfo = shapeData[shapeKey];
        const card = document.createElement('div');
        card.className = 'shape-card';
        card.onclick = () => selectShape(index);
        
        if (index === currentShapeIndex) {
            card.classList.add('active');
        }
        
        if (completedShapes.has(shapeKey)) {
            card.classList.add('completed');
        }
        
        // Create mini shape for the card
        const miniShape = document.createElement('div');
        miniShape.className = `shape card-shape ${shapeInfo.className}`;
        
        const shapeName = document.createElement('div');
        shapeName.className = 'card-shape-name';
        shapeName.textContent = shapeInfo.name;
        
        card.appendChild(miniShape);
        card.appendChild(shapeName);
        grid.appendChild(card);
    });
}

// Select a shape
function selectShape(index) {
    currentShapeIndex = index;
    const shapeKey = shapeKeys[index];
    
    // Mark as completed
    completedShapes.add(shapeKey);
    saveProgress();
    
    updateDisplay();
    generateShapesGrid();
    
    // Auto-play audio
    setTimeout(() => {
        playShapeAudio();
    }, 300);
}

// Update main display
function updateDisplay() {
    const shapeKey = shapeKeys[currentShapeIndex];
    const shapeInfo = shapeData[shapeKey];
    
    // Update shape counter
    document.getElementById('shapeCounter').textContent = `Shape ${currentShapeIndex + 1} of ${shapeKeys.length}`;
    
    // Update shape display
    const shapeContainer = document.getElementById('shapeContainer');
    shapeContainer.innerHTML = `<div class="shape ${shapeInfo.className}" onclick="playShapeAudio()"></div>`;
    
    // Update text content
    document.getElementById('shapeName').textContent = shapeInfo.name;
    document.getElementById('shapeDescription').textContent = shapeInfo.description;
    document.getElementById('funFactText').textContent = shapeInfo.funFact;
    
    // Load shape image if available
    loadShapeImage();
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Load shape image
function loadShapeImage() {
    const img = document.getElementById('shapeImage');
    const shapeKey = shapeKeys[currentShapeIndex];
    const imagePath = `shapes_assets/${shapeKey}.webp`;
    
    // Check if image exists
    img.onload = function() {
        img.classList.remove('hidden');
    };
    
    img.onerror = function() {
        img.classList.add('hidden');
    };
    
    img.src = imagePath;
}

// Play shape audio
function playShapeAudio() {
    if (currentAudio) {
        currentAudio.pause();
    }
    
    const shapeKey = shapeKeys[currentShapeIndex];
    const audioPath = `shapes_assets/${shapeKey}.mp3`;
    currentAudio = new Audio(audioPath);
    
    currentAudio.onerror = function() {
        // If audio file doesn't exist, use text-to-speech as fallback
        speakShape();
    };
    
    currentAudio.play().catch(() => {
        // Fallback to speech synthesis
        speakShape();
    });
}

// Text-to-speech fallback
function speakShape() {
    if ('speechSynthesis' in window) {
        const shapeInfo = shapeData[shapeKeys[currentShapeIndex]];
        const utterance = new SpeechSynthesisUtterance(
            `${shapeInfo.name}. ${shapeInfo.description}`
        );
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
    }
}

// Navigation functions
function previousShape() {
    if (currentShapeIndex > 0) {
        selectShape(currentShapeIndex - 1);
    }
}

function nextShape() {
    if (currentShapeIndex < shapeKeys.length - 1) {
        selectShape(currentShapeIndex + 1);
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentShapeIndex === 0;
    nextBtn.disabled = currentShapeIndex === shapeKeys.length - 1;
}

// Keyboard navigation
function handleKeyboard(event) {
    switch(event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            previousShape();
            break;
        case 'ArrowRight':
            event.preventDefault();
            nextShape();
            break;
        case ' ':
        case 'Enter':
            event.preventDefault();
            playShapeAudio();
            break;
        case 'Escape':
            returnToHub();
            break;
    }
}

// Reset progress function
function resetProgress() {
    if (confirm('Are you sure you want to start over? This will reset all your progress!')) {
        // Clear completed shapes
        completedShapes.clear();
        
        // Reset to first shape
        currentShapeIndex = 0;
        
        // Clear localStorage
        localStorage.removeItem('shapesProgress');
        localStorage.removeItem('shapesCurrentIndex');
        
        // Update display
        displayShape();
        updateProgress();
        
        console.log('Shapes progress reset successfully');
    }
}

// Random shape function
function randomShape() {
    const randomIndex = Math.floor(Math.random() * shapes.length);
    selectShape(shapes[randomIndex]);
}

// Return to main hub
function returnToHub() {
    window.location.href = 'index.html';
}

// Global function exports
window.selectShape = selectShape;
window.previousShape = previousShape;
window.nextShape = nextShape;
window.playShapeAudio = playShapeAudio;
window.resetProgress = resetProgress;
window.randomShape = randomShape;
window.returnToHub = returnToHub;
