/**
 * random number generator - Square One Reset
 * Single, robust logic engine for RNG and Music Scales
 */

// --- Constants & Data ---
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

// --- Application State ---
let currentScale = {
    key: 'C',
    type: 'Major',
    notes: []
};

// --- Core Helper Functions ---

/**
 * Returns the note names for a given key and scale type.
 */
function calculateScaleNotes(key, type) {
    const rootIndex = NOTES.indexOf(key);
    const intervals = (type === 'Major') ? MAJOR_INTERVALS : MINOR_INTERVALS;
    return intervals.map(i => NOTES[(rootIndex + i) % 12]);
}

/**
 * Shuffles an array in place using Fisher-Yates.
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Updates the UI display for the scale.
 */
function updateScaleUI() {
    const displayEl = document.getElementById('scale-display');
    const notesEl = document.getElementById('scale-notes');
    if (displayEl) displayEl.textContent = `${currentScale.key.toLowerCase()} ${currentScale.type.toLowerCase()}`;
    if (notesEl) notesEl.textContent = currentScale.notes.join(' ').toLowerCase();
}

/**
 * Randomizes the scale if not locked.
 */
function randomizeScale(manual = false) {
    const lockScale = document.getElementById('lock-scale').checked;
    if (lockScale && !manual) return;

    const randomKey = NOTES[Math.floor(Math.random() * NOTES.length)];
    const randomType = Math.random() > 0.5 ? 'Major' : 'Minor';
    
    currentScale.key = randomKey;
    currentScale.type = randomType;
    currentScale.notes = calculateScaleNotes(randomKey, randomType);
    
    updateScaleUI();
}

/**
 * The main generator function.
 */
function generate() {
    // 1. Get Elements & Inputs
    const minInput = document.getElementById('input-min');
    const maxInput = document.getElementById('input-max');
    const colsInput = document.getElementById('input-cols');
    const rowsInput = document.getElementById('input-rows');
    const noRepeatsInput = document.getElementById('no-repeats');
    const statusEl = document.getElementById('no-repeats-status');
    const gridContainer = document.getElementById('grid-container');
    const translationContainer = document.getElementById('translation-container');

    const min = parseInt(minInput.value) || 1;
    const max = parseInt(maxInput.value) || 7;
    const cols = parseInt(colsInput.value) || 1;
    const rows = parseInt(rowsInput.value) || 1;
    const noRepeats = noRepeatsInput.checked;

    // 2. Prep scale randomization
    randomizeScale();

    // 3. Setup Grid
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridContainer.innerHTML = '';
    
    // 4. Generate Numbers logic (Fresh Pool for every click)
    let numbers = [];
    const actualMin = Math.min(min, max);
    const actualMax = Math.max(min, max);
    const rangeSize = actualMax - actualMin + 1;
    const totalNeeded = rows * cols;
    
    let pool = [];

    // If No Repeats is on, we ensure the FIRST 'rangeSize' numbers are unique in the grid.
    if (noRepeats) {
        for (let k = actualMin; k <= actualMax; k++) pool.push(k);
        shuffle(pool);
        if (statusEl) statusEl.textContent = (totalNeeded > rangeSize) ? '(exhausted, repeating)' : '(active)';
    } else {
        if (statusEl) statusEl.textContent = '';
    }

    // 5. Build Result Set
    for (let i = 0; i < totalNeeded; i++) {
        let num;
        if (noRepeats) {
            if (pool.length === 0) {
                // Refill if exhausted
                for (let k = actualMin; k <= actualMax; k++) pool.push(k);
                shuffle(pool);
            }
            num = pool.pop();
        } else {
            num = Math.floor(Math.random() * (actualMax - actualMin + 1)) + actualMin;
        }
        numbers.push(num);

        // Add to DOM
        const cell = document.createElement('div');
        cell.className = 'grid-item';
        cell.textContent = num;
        cell.style.animationDelay = `${i * 0.04}s`;
        gridContainer.appendChild(cell);
    }

    // 6. Map to Notes
    if (currentScale.notes.length > 0) {
        const translated = numbers.map(n => {
            const len = currentScale.notes.length;
            const index = (n - 1) % len;
            const safeIndex = ((index % len) + len) % len;
            return currentScale.notes[safeIndex];
        });
        translationContainer.textContent = translated.join(' ').toLowerCase();
    }
}

/**
 * Sets the scale manually from the dropdown selectors.
 */
function setManualScale() {
    const key = document.getElementById('select-key').value;
    const type = document.getElementById('select-type').value;
    
    currentScale.key = key;
    currentScale.type = type;
    currentScale.notes = calculateScaleNotes(key, type);
    
    // Automatically lock the scale when manually set to prevent randomization
    document.getElementById('lock-scale').checked = true;
    
    updateScaleUI();
}

// --- Initialization & Listeners ---

// Initial setup
randomizeScale(true);

// Click Listeners
document.getElementById('btn-generate').addEventListener('click', generate);
document.getElementById('btn-random-scale').addEventListener('click', () => randomizeScale(true));
document.getElementById('btn-set-scale').addEventListener('click', setManualScale);

// Shortcut Handlers
document.addEventListener('keydown', (e) => {
    // Only trigger if not in an input
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        generate();
    }
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generate();
    });
});
