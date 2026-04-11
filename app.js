/**
 * random number generator - app logic
 * Pivot: Web-based RNG with Music Scale mapping
 */

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

let currentScale = {
    key: 'C',
    type: 'Major',
    notes: []
};

// Elements
const btnGenerate = document.getElementById('btn-generate');
const btnRandomScale = document.getElementById('btn-random-scale');
const lockScaleCheck = document.getElementById('lock-scale');
const currentScaleEl = document.getElementById('current-scale');
const scaleNotesEl = document.getElementById('scale-notes');
const gridContainer = document.getElementById('grid-container');
const translationContainer = document.getElementById('translation-container');

let numberPool = [];

/**
 * Calculates the notes for a given scale key and type.
 */
function getScaleNotes(key, type) {
    const rootIndex = NOTES.indexOf(key);
    const intervals = type === 'Major' ? MAJOR_INTERVALS : MINOR_INTERVALS;
    return intervals.map(i => NOTES[(rootIndex + i) % 12]);
}

/**
 * Randomizes the global scale if not locked or manually forced.
 */
function randomizeScale(manual = false) {
    if (lockScaleCheck.checked && !manual) return;
    
    const randomKey = NOTES[Math.floor(Math.random() * NOTES.length)];
    const randomType = Math.random() > 0.5 ? 'Major' : 'Minor';
    
    currentScale.key = randomKey;
    currentScale.type = randomType;
    currentScale.notes = getScaleNotes(randomKey, randomType);
    
    updateScaleDisplay();
}

/**
 * Updates the UI display for the current scale.
 */
function updateScaleDisplay() {
    currentScaleEl.textContent = `${currentScale.key.toLowerCase()} ${currentScale.type.toLowerCase()}`;
    scaleNotesEl.textContent = currentScale.notes.join(' ').toLowerCase();
}

/**
 * Shuffles an array in place.
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Builds the number pool based on min/max.
 */
function buildPool(min, max) {
    const pool = [];
    const start = Math.min(min, max);
    const end = Math.max(min, max);
    for (let k = start; k <= end; k++) {
        pool.push(k);
    }
    shuffle(pool);
    return pool;
}

/**
 * Helper to force pool reset on setting changes.
 */
function resetPool() {
    numberPool = [];
}

/**
 * Core generation function for the RNG grid and music mapping.
 */
function generate() {
    const min = parseInt(document.getElementById('input-min').value) || 1;
    const max = parseInt(document.getElementById('input-max').value) || 7;
    const cols = parseInt(document.getElementById('input-cols').value) || 1;
    const rows = parseInt(document.getElementById('input-rows').value) || 1;
    const noRepeats = document.getElementById('no-repeats').checked;
    
    if (!lockScaleCheck.checked) {
        randomizeScale();
    }
    
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridContainer.innerHTML = '';
    
    let allNumbers = [];
    
    // For 'No Repeats', we ensure the grid is as unique as possible.
    // If we are starting a NEW grid, we should probably prefer a batch of unique values.
    // However, to satisfy "continuous sequence", we only refill when empty.
    
    const totalCells = rows * cols;

    for (let i = 0; i < totalCells; i++) {
        let num;
        
        if (noRepeats) {
            if (numberPool.length === 0) {
                // Initialize or Rebuild pool
                numberPool = buildPool(min, max);
            }
            num = numberPool.pop();
        } else {
            num = Math.floor(Math.random() * (Math.abs(max - min) + 1)) + Math.min(min, max);
        }
        
        allNumbers.push(num);
        
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.textContent = num;
        div.style.animationDelay = `${i * 0.04}s`;
        gridContainer.appendChild(div);
    }
    
    // Map numbers to scale notes
    if (currentScale.notes.length > 0) {
        const translated = allNumbers.map(n => {
            const len = currentScale.notes.length;
            const index = (n - 1) % len;
            const safeIndex = ((index % len) + len) % len;
            return currentScale.notes[safeIndex];
        });
        
        translationContainer.textContent = translated.join(' ').toLowerCase();
    }
}

// Event Listeners
btnGenerate.addEventListener('click', generate);
btnRandomScale.addEventListener('click', () => randomizeScale(true));

// Logic: Any setting change resets the unique sequence pool.
document.getElementById('input-min').addEventListener('input', resetPool);
document.getElementById('input-max').addEventListener('input', resetPool);
document.getElementById('no-repeats').addEventListener('change', resetPool);

// Initial application state
randomizeScale(true);

// Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        generate();
    }
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generate();
    });
});
