// Number Fun - Interactive Numbers Learning App

// Number word mappings
const numberWords = {
    1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
    6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
    11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen',
    16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty',
    21: 'Twenty-One', 22: 'Twenty-Two', 23: 'Twenty-Three', 24: 'Twenty-Four', 25: 'Twenty-Five',
    26: 'Twenty-Six', 27: 'Twenty-Seven', 28: 'Twenty-Eight', 29: 'Twenty-Nine', 30: 'Thirty',
    31: 'Thirty-One', 32: 'Thirty-Two', 33: 'Thirty-Three', 34: 'Thirty-Four', 35: 'Thirty-Five',
    36: 'Thirty-Six', 37: 'Thirty-Seven', 38: 'Thirty-Eight', 39: 'Thirty-Nine', 40: 'Forty',
    41: 'Forty-One', 42: 'Forty-Two', 43: 'Forty-Three', 44: 'Forty-Four', 45: 'Forty-Five',
    46: 'Forty-Six', 47: 'Forty-Seven', 48: 'Forty-Eight', 49: 'Forty-Nine', 50: 'Fifty',
    51: 'Fifty-One', 52: 'Fifty-Two', 53: 'Fifty-Three', 54: 'Fifty-Four', 55: 'Fifty-Five',
    56: 'Fifty-Six', 57: 'Fifty-Seven', 58: 'Fifty-Eight', 59: 'Fifty-Nine', 60: 'Sixty',
    61: 'Sixty-One', 62: 'Sixty-Two', 63: 'Sixty-Three', 64: 'Sixty-Four', 65: 'Sixty-Five',
    66: 'Sixty-Six', 67: 'Sixty-Seven', 68: 'Sixty-Eight', 69: 'Sixty-Nine', 70: 'Seventy',
    71: 'Seventy-One', 72: 'Seventy-Two', 73: 'Seventy-Three', 74: 'Seventy-Four', 75: 'Seventy-Five',
    76: 'Seventy-Six', 77: 'Seventy-Seven', 78: 'Seventy-Eight', 79: 'Seventy-Nine', 80: 'Eighty',
    81: 'Eighty-One', 82: 'Eighty-Two', 83: 'Eighty-Three', 84: 'Eighty-Four', 85: 'Eighty-Five',
    86: 'Eighty-Six', 87: 'Eighty-Seven', 88: 'Eighty-Eight', 89: 'Eighty-Nine', 90: 'Ninety',
    91: 'Ninety-One', 92: 'Ninety-Two', 93: 'Ninety-Three', 94: 'Ninety-Four', 95: 'Ninety-Five',
    96: 'Ninety-Six', 97: 'Ninety-Seven', 98: 'Ninety-Eight', 99: 'Ninety-Nine', 100: 'One Hundred'
};

// App state
let currentNumber = 1;
let currentRange = [1, 10];
let completedNumbers = new Set();
let currentAudio = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    generateNumbersGrid();
    updateDisplay();
    updateRangeDisplay();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    console.log('Number Fun App initialized!');
});

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('kiddyHub_numbersCompleted');
    if (saved) {
        completedNumbers = new Set(JSON.parse(saved));
    }
    updateMainProgress();
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('kiddyHub_numbersCompleted', JSON.stringify([...completedNumbers]));
    localStorage.setItem('kiddyHub_numbersProgress', completedNumbers.size.toString());
    updateMainProgress();
}

// Update main progress bar
function updateMainProgress() {
    const progressFill = document.getElementById('mainProgress');
    const progressCount = document.getElementById('progressCount');
    
    const percentage = (completedNumbers.size / 100) * 100;
    progressFill.style.width = percentage + '%';
    progressCount.textContent = `${completedNumbers.size}/100`;
    
    // Update hub progress if function exists
    if (typeof updateProgress === 'function') {
        updateProgress('numbers', completedNumbers.size, 100);
    }
}

// Generate numbers grid for current range
function generateNumbersGrid() {
    const grid = document.getElementById('numbersGrid');
    grid.innerHTML = '';
    
    for (let i = currentRange[0]; i <= currentRange[1]; i++) {
        const card = document.createElement('div');
        card.className = 'number-card';
        card.textContent = i;
        card.onclick = () => selectNumber(i);
        
        if (i === currentNumber) {
            card.classList.add('active');
        }
        
        if (completedNumbers.has(i)) {
            card.classList.add('completed');
        }
        
        grid.appendChild(card);
    }
}

// Select a number
function selectNumber(num) {
    currentNumber = num;
    
    // Mark as completed
    completedNumbers.add(num);
    saveProgress();
    
    updateDisplay();
    generateNumbersGrid();
    
    // Auto-play audio
    setTimeout(() => {
        playNumberAudio();
    }, 300);
}

// Update main display
function updateDisplay() {
    document.getElementById('currentNumber').textContent = currentNumber;
    document.getElementById('numberWord').textContent = numberWords[currentNumber];
    
    // Update visual counter (dots for numbers 1-20, grouped for larger numbers)
    updateVisualCounter();
    
    // Load number image if available
    loadNumberImage();
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Update visual counter
function updateVisualCounter() {
    const counter = document.getElementById('visualCounter');
    counter.innerHTML = '';
    
    if (currentNumber <= 20) {
        // Show individual dots for 1-20
        for (let i = 0; i < currentNumber; i++) {
            const dot = document.createElement('div');
            dot.className = 'counter-dot';
            dot.style.animationDelay = (i * 0.1) + 's';
            counter.appendChild(dot);
        }
    } else {
        // Show grouped representation for larger numbers
        const tens = Math.floor(currentNumber / 10);
        const ones = currentNumber % 10;
        
        // Show tens groups
        for (let i = 0; i < tens; i++) {
            const group = document.createElement('div');
            group.style.display = 'flex';
            group.style.flexWrap = 'wrap';
            group.style.margin = '2px';
            group.style.padding = '5px';
            group.style.border = '2px solid #4ecdc4';
            group.style.borderRadius = '8px';
            group.style.background = 'rgba(78, 205, 196, 0.1)';
            
            for (let j = 0; j < 10; j++) {
                const dot = document.createElement('div');
                dot.className = 'counter-dot';
                dot.style.width = '8px';
                dot.style.height = '8px';
                dot.style.margin = '1px';
                dot.style.animationDelay = ((i * 10 + j) * 0.05) + 's';
                group.appendChild(dot);
            }
            counter.appendChild(group);
        }
        
        // Show remaining ones
        if (ones > 0) {
            const onesGroup = document.createElement('div');
            onesGroup.style.display = 'flex';
            onesGroup.style.flexWrap = 'wrap';
            onesGroup.style.margin = '2px';
            
            for (let i = 0; i < ones; i++) {
                const dot = document.createElement('div');
                dot.className = 'counter-dot';
                dot.style.animationDelay = ((tens * 10 + i) * 0.05) + 's';
                counter.appendChild(dot);
            }
        }
    }
}

// Load number image
function loadNumberImage() {
    const img = document.getElementById('numberImage');
    const imagePath = `numbers_assets/${currentNumber}.webp`;
    
    // Check if image exists
    img.onload = function() {
        img.style.display = 'block';
        img.classList.remove('hidden');
    };
    
    img.onerror = function() {
        img.style.display = 'none';
        img.classList.add('hidden');
    };
    
    img.src = imagePath;
}

// Play number audio
function playNumberAudio() {
    if (currentAudio) {
        currentAudio.pause();
    }
    
    const audioPath = `numbers_assets/${currentNumber}.mp3`;
    currentAudio = new Audio(audioPath);
    
    currentAudio.onerror = function() {
        // If audio file doesn't exist, use text-to-speech as fallback
        speakNumber();
    };
    
    currentAudio.play().catch(() => {
        // Fallback to speech synthesis
        speakNumber();
    });
}

// Text-to-speech fallback
function speakNumber() {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(numberWords[currentNumber]);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        speechSynthesis.speak(utterance);
    }
}

// Navigation functions
function previousNumber() {
    if (currentNumber > 1) {
        selectNumber(currentNumber - 1);
        
        // Switch range if needed
        if (currentNumber < currentRange[0]) {
            changeRange('prev');
        }
    }
}

function nextNumber() {
    if (currentNumber < 100) {
        selectNumber(currentNumber + 1);
        
        // Switch range if needed
        if (currentNumber > currentRange[1]) {
            changeRange('next');
        }
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentNumber === 1;
    nextBtn.disabled = currentNumber === 100;
}

// Change number range
function changeRange(direction) {
    if (typeof direction === 'string') {
        if (direction === 'prev' && currentRange[0] > 1) {
            currentRange = [currentRange[0] - 10, currentRange[1] - 10];
        } else if (direction === 'next' && currentRange[1] < 100) {
            currentRange = [currentRange[0] + 10, currentRange[1] + 10];
        }
    } else {
        // Called from select dropdown
        const select = document.getElementById('rangeSelect');
        const selectedRange = select.value.split('-');
        currentRange = [parseInt(selectedRange[0]), parseInt(selectedRange[1])];
    }
    
    // Update display
    updateRangeDisplay();
    generateNumbersGrid();
    
    // Update range selector
    const select = document.getElementById('rangeSelect');
    select.value = `${currentRange[0]}-${currentRange[1]}`;
}

// Update range display
function updateRangeDisplay() {
    const rangeDisplay = document.getElementById('rangeDisplay');
    rangeDisplay.textContent = `Numbers ${currentRange[0]}-${currentRange[1]}`;
    
    // Update range navigation buttons
    const prevRangeBtn = document.querySelector('.range-navigation .range-btn:first-child');
    const nextRangeBtn = document.querySelector('.range-navigation .range-btn:last-child');
    
    prevRangeBtn.disabled = currentRange[0] === 1;
    nextRangeBtn.disabled = currentRange[1] === 100;
}

// Keyboard navigation
function handleKeyboard(event) {
    switch(event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            previousNumber();
            break;
        case 'ArrowRight':
            event.preventDefault();
            nextNumber();
            break;
        case ' ':
        case 'Enter':
            event.preventDefault();
            playNumberAudio();
            break;
        case 'Escape':
            returnToHub();
            break;
    }
}

// Reset progress function
function resetProgress() {
    if (confirm('Are you sure you want to start over? This will reset all your progress!')) {
        // Clear completed numbers
        completedNumbers.clear();
        
        // Reset to first number and range
        currentNumber = 1;
        currentRange = [1, 10];
        
        // Clear localStorage
        localStorage.removeItem('numbersProgress');
        localStorage.removeItem('numbersCurrentNumber');
        localStorage.removeItem('numbersCurrentRange');
        
        // Update display
        displayNumber(currentNumber);
        updateRangeDisplay();
        
        console.log('Progress reset successfully');
    }
}

// Random number function
function randomNumber() {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    selectNumber(randomNum);
}

// Return to main hub
function returnToHub() {
    window.location.href = 'index.html';
}

// Global function exports
window.selectNumber = selectNumber;
window.previousNumber = previousNumber;
window.nextNumber = nextNumber;
window.playNumberAudio = playNumberAudio;
window.changeRange = changeRange;
window.resetProgress = resetProgress;
window.randomNumber = randomNumber;
window.returnToHub = returnToHub;
