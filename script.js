// ==================== GAME CONSTANTS & CONFIG ====================
const CANDY_COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'];
const GRID_SIZE = 8;
const MATCH_MIN = 3;

// Level data - progressively harder
const LEVELS = [
    // Level 1 - Easy (Tutorial)
    {
        id: 1,
        name: "Sweet Beginning",
        target: 5000,
        moves: 25,
        timeLimit: 0, // 0 means no timer
        colors: ['Red', 'Blue', 'Green'],
        specials: false,
        blockers: false
    },
    // Level 2 - Still Easy
    {
        id: 2,
        name: "Fruit Garden",
        target: 8000,
        moves: 22,
        timeLimit: 0,
        colors: ['Red', 'Blue', 'Green', 'Yellow'],
        specials: false,
        blockers: false
    },
    // Level 3 - Introduces specials
    {
        id: 3,
        name: "Candy Factory",
        target: 12000,
        moves: 20,
        timeLimit: 0,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'],
        specials: true,
        blockers: false
    },
    // Level 4 - More challenging
    {
        id: 4,
        name: "Sugar Rush",
        target: 15000,
        moves: 18,
        timeLimit: 0,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specials: true,
        blockers: false
    },
    // Level 5 - Introduces timer
    {
        id: 5,
        name: "Timed Challenge",
        target: 12000,
        moves: 15,
        timeLimit: 90, // 90 seconds
        colors: ['Red', 'Blue', 'Green', 'Yellow'],
        specials: true,
        blockers: false
    },
    // Level 6 - Harder with blockers
    {
        id: 6,
        name: "Chocolate Cave",
        target: 18000,
        moves: 20,
        timeLimit: 0,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'],
        specials: true,
        blockers: true,
        blockerCount: 3
    },
    // Level 7 - Mixed challenge
    {
        id: 7,
        name: "Mountain Pass",
        target: 20000,
        moves: 16,
        timeLimit: 120,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specials: true,
        blockers: true,
        blockerCount: 5
    },
    // Level 8 - Difficult
    {
        id: 8,
        name: "Volcano Eruption",
        target: 25000,
        moves: 14,
        timeLimit: 90,
        colors: ['Red', 'Orange', 'Yellow'],
        specials: true,
        blockers: true,
        blockerCount: 7
    },
    // Level 9 - Very Hard
    {
        id: 9,
        name: "Candy Castle",
        target: 30000,
        moves: 12,
        timeLimit: 60,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specials: true,
        blockers: true,
        blockerCount: 10
    },
    // Level 10 - Boss Level
    {
        id: 10,
        name: "KING'S CHALLENGE",
        target: 50000,
        moves: 10,
        timeLimit: 120,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specials: true,
        blockers: true,
        blockerCount: 15
    },
    // Levels 11-20 (Add more here)
    {
        id: 11,
        name: "Forest Mystery",
        target: 22000,
        moves: 18,
        timeLimit: 0,
        colors: ['Green', 'Yellow', 'Orange'],
        specials: true,
        blockers: true,
        blockerCount: 4
    },
    {
        id: 12,
        name: "Ocean Depths",
        target: 24000,
        moves: 17,
        timeLimit: 0,
        colors: ['Blue', 'Purple'],
        specials: true,
        blockers: true,
        blockerCount: 6
    },
    {
        id: 13,
        name: "Desert Heat",
        target: 26000,
        moves: 16,
        timeLimit: 150,
        colors: ['Red', 'Orange', 'Yellow'],
        specials: true,
        blockers: true,
        blockerCount: 8
    },
    {
        id: 14,
        name: "Arctic Freeze",
        target: 28000,
        moves: 15,
        timeLimit: 0,
        colors: ['Blue', 'Green', 'Purple'],
        specials: true,
        blockers: true,
        blockerCount: 10
    },
    {
        id: 15,
        name: "Jungle Rapids",
        target: 32000,
        moves: 14,
        timeLimit: 180,
        colors: ['Green', 'Yellow', 'Orange', 'Red'],
        specials: true,
        blockers: true,
        blockerCount: 12
    },
    {
        id: 16,
        name: "Space Station",
        target: 35000,
        moves: 13,
        timeLimit: 0,
        colors: ['Blue', 'Purple', 'Red'],
        specials: true,
        blockers: true,
        blockerCount: 14
    },
    {
        id: 17,
        name: "Dragon's Lair",
        target: 38000,
        moves: 12,
        timeLimit: 120,
        colors: ['Red', 'Orange', 'Yellow'],
        specials: true,
        blockers: true,
        blockerCount: 16
    },
    {
        id: 18,
        name: "Magic Forest",
        target: 40000,
        moves: 11,
        timeLimit: 0,
        colors: ALL_COLORS,
        specials: true,
        blockers: true,
        blockerCount: 18
    },
    {
        id: 19,
        name: "Temple Run",
        target: 45000,
        moves: 10,
        timeLimit: 150,
        colors: ALL_COLORS,
        specials: true,
        blockers: true,
        blockerCount: 20
    },
    {
        id: 20,
        name: "FINAL SHOWDOWN",
        target: 100000,
        moves: 8,
        timeLimit: 180,
        colors: ALL_COLORS,
        specials: true,
        blockers: true,
        blockerCount: 25
    }
];

// ==================== GAME STATE ====================
let currentUser = null;
let currentLevel = 1;
let gameBoard = [];
let selectedCandy = null;
let currentScore = 0;
let movesLeft = 0;
let targetScore = 0;
let timer = null;
let timeLeft = 0;
let boosterSystem = null;
let gameActive = false;

// ==================== BOOSTER SYSTEM ====================
class BoosterSystem {
    constructor() {
        this.boosters = {
            hammer: { 
                count: 3, 
                name: 'Lollipop Hammer', 
                icon: '🔨',
                price: 100,
                description: 'Remove any one candy'
            },
            extraMoves: { 
                count: 2, 
                name: '+5 Moves', 
                icon: '⏱️',
                price: 150,
                description: 'Add 5 more moves'
            },
            ufo: { 
                count: 1, 
                name: 'UFO', 
                icon: '🛸',
                price: 200,
                description: 'Create 3 wrapped candies'
            },
            shuffle: { 
                count: 2, 
                name: 'Shuffle', 
                icon: '🔄',
                price: 80,
                description: 'Shuffle the board'
            },
            colorBomb: {
                count: 0,
                name: 'Color Bomb',
                icon: '💣',
                price: 300,
                description: 'Create a color bomb'
            }
        };
        this.activeBooster = null;
        this.coins = 1000;
    }

    render() {
        const bar = document.getElementById('booster-bar');
        let html = '';
        
        Object.keys(this.boosters).forEach(key => {
            const b = this.boosters[key];
            html += `
                <div class="booster-item ${b.count > 0 ? 'available' : 'sold-out'}" 
                     data-booster="${key}">
                    <span class="booster-icon">${b.icon}</span>
                    <span class="booster-count">${b.count}</span>
                    <span class="booster-name">${b.name}</span>
                </div>
            `;
        });
        
        bar.innerHTML = html;
        
        // Add click handlers
        document.querySelectorAll('.booster-item.available').forEach(item => {
            item.addEventListener('click', () => {
                const key = item.dataset.booster;
                this.selectBooster(key);
            });
        });
    }

    selectBooster(key) {
        if (this.activeBooster === key) {
            this.activeBooster = null;
            document.querySelectorAll('.booster-item').forEach(i => 
                i.classList.remove('active'));
        } else {
            this.activeBooster = key;
            document.querySelectorAll('.booster-item').forEach(i => 
                i.classList.remove('active'));
            document.querySelector(`[data-booster="${key}"]`).classList.add('active');
            
            // Show instruction
            if (key === 'hammer') {
                showMessage('Click on any candy to remove it!', 'info');
            } else if (key === 'ufo') {
                showMessage('UFO will create wrapped candies!', 'info');
            } else if (key === 'shuffle') {
                this.useBooster('shuffle');
            }
        }
    }

    useBooster(key, row = null, col = null) {
        if (this.boosters[key].count <= 0) return false;
        
        switch(key) {
            case 'hammer':
                if (row !== null && col !== null) {
                    gameBoard[row][col] = null;
                    this.boosters[key].count--;
                    renderBoard();
                    setTimeout(() => processMatches(), 200);
                }
                break;
                
            case 'extraMoves':
                movesLeft += 5;
                document.getElementById('moves-left').textContent = movesLeft;
                this.boosters[key].count--;
                showMessage(`+5 Moves added!`, 'success');
                break;
                
            case 'ufo':
                // Create 3 wrapped candies
                for (let i = 0; i < 3; i++) {
                    let r, c;
                    do {
                        r = Math.floor(Math.random() * GRID_SIZE);
                        c = Math.floor(Math.random() * GRID_SIZE);
                    } while (gameBoard[r][c] && gameBoard[r][c].includes('Wrapped'));
                    
                    if (gameBoard[r][c]) {
                        const color = gameBoard[r][c].split('-')[0];
                        gameBoard[r][c] = `${color}-Wrapped`;
                    }
                }
                this.boosters[key].count--;
                renderBoard();
                showMessage(`🛸 UFO created wrapped candies!`, 'success');
                break;
                
            case 'shuffle':
                shuffleBoard();
                this.boosters[key].count--;
                showMessage(`Board shuffled!`, 'success');
                break;
                
            case 'colorBomb':
                if (row !== null && col !== null) {
                    // Implementation for color bomb
                }
                break;
        }
        
        this.render();
        this.saveToUser();
        this.activeBooster = null;
        document.querySelectorAll('.booster-item').forEach(i => 
            i.classList.remove('active'));
        
        return true;
    }

    saveToUser() {
        if (currentUser) {
            currentUser.progress.boosters = this.boosters;
            currentUser.progress.coins = this.coins;
            saveUserData();
        }
    }

    loadFromUser(user) {
        if (user && user.progress) {
            if (user.progress.boosters) {
                this.boosters = user.progress.boosters;
            }
            if (user.progress.coins) {
                this.coins = user.progress.coins;
            }
        }
    }
}

// ==================== USER MANAGEMENT ====================
function initUserSystem() {
    // Load users from localStorage
    if (!localStorage.getItem('candyUsers')) {
        localStorage.setItem('candyUsers', JSON.stringify([]));
    }
}

function registerUser(name, color) {
    const users = JSON.parse(localStorage.getItem('candyUsers'));
    
    // Check if name exists
    if (users.find(u => u.name === name)) {
        showMessage('register', 'Name already exists!', 'error');
        return false;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        color: color,
        createdAt: new Date().toISOString(),
        progress: {
            levelsUnlocked: 1,
            stars: {},
            highScores: {},
            boosters: {
                hammer: { count: 3, name: 'Lollipop Hammer', icon: '🔨', price: 100 },
                extraMoves: { count: 2, name: '+5 Moves', icon: '⏱️', price: 150 },
                ufo: { count: 1, name: 'UFO', icon: '🛸', price: 200 },
                shuffle: { count: 2, name: 'Shuffle', icon: '🔄', price: 80 },
                colorBomb: { count: 0, name: 'Color Bomb', icon: '💣', price: 300 }
            },
            coins: 1000
        }
    };
    
    users.push(newUser);
    localStorage.setItem('candyUsers', JSON.stringify(users));
    
    showMessage('register', 'Account created! Please login.', 'success');
    document.querySelector('[data-tab="login"]').click();
    return true;
}

function loginUser(name) {
    const users = JSON.parse(localStorage.getItem('candyUsers'));
    const user = users.find(u => u.name === name);
    
    if (user) {
        currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        showMainMenu();
        return true;
    } else {
        showMessage('login', 'User not found! Please register.', 'error');
        return false;
    }
}

function saveUserData() {
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('candyUsers'));
    const index = users.findIndex(u => u.id === currentUser.id);
    
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('candyUsers', JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

function logoutUser() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    showAuthScreen();
}

// ==================== GAME BOARD FUNCTIONS ====================
function initBoard(levelData) {
    gameBoard = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        const row = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            const color = levelData.colors[Math.floor(Math.random() * levelData.colors.length)];
            row.push(color);
        }
        gameBoard.push(row);
    }
    
    // Remove initial matches
    while (hasMatches()) {
        resolveMatches(false); // Don't score initial matches
    }
    
    // Add blockers if needed
    if (levelData.blockers && levelData.blockerCount) {
        addBlockers(levelData.blockerCount);
    }
}

function addBlockers(count) {
    for (let i = 0; i < count; i++) {
        let r, c;
        do {
            r = Math.floor(Math.random() * GRID_SIZE);
            c = Math.floor(Math.random() * GRID_SIZE);
        } while (gameBoard[r][c] === 'Choco');
        
        gameBoard[r][c] = 'Choco';
    }
}

function renderBoard() {
    const boardElement = document.getElementById('game-board');
    boardElement.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
    
    let html = '';
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const candy = gameBoard[r][c];
            const isSelected = selectedCandy && 
                              selectedCandy.row === r && 
                              selectedCandy.col === c;
            
            let imageFile = 'blank.png';
            if (candy) {
                if (candy === 'Choco') {
                    imageFile = 'Choco.png';
                } else if (candy.includes('-')) {
                    // Special candy
                    imageFile = candy + '.png';
                } else {
                    imageFile = candy + '.png';
                }
            }
            
            html += `
                <div class="candy-cell ${isSelected ? 'selected' : ''}" 
                     data-row="${r}" data-col="${c}">
                    <img src="images/${imageFile}" alt="candy">
                </div>
            `;
        }
    }
    
    boardElement.innerHTML = html;
    
    // Add click handlers
    document.querySelectorAll('.candy-cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

function handleCellClick(e) {
    if (!gameActive) return;
    
    const cell = e.currentTarget;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    // Check if clicked on blocker
    if (gameBoard[row][col] === 'Choco') {
        showMessage('Cannot move chocolate!', 'error');
        return;
    }
    
    // Check if booster is active
    if (boosterSystem && boosterSystem.activeBooster) {
        handleBoosterClick(row, col);
        return;
    }
    
    if (!selectedCandy) {
        // First selection
        selectedCandy = { row, col };
        renderBoard();
    } else {
        // Second selection - check if adjacent
        const first = selectedCandy;
        const second = { row, col };
        
        if (isAdjacent(first, second)) {
            // Swap candies
            swapCandies(first, second);
            
            if (hasMatches()) {
                // Valid swap - use a move
                movesLeft--;
                document.getElementById('moves-left').textContent = movesLeft;
                processMatches();
            } else {
                // Invalid swap - swap back
                swapCandies(first, second);
                showMessage('No match! Try again.', 'error');
            }
        } else {
            // Not adjacent - select new candy
            selectedCandy = { row, col };
        }
        
        renderBoard();
    }
}

function handleBoosterClick(row, col) {
    if (boosterSystem.activeBooster === 'hammer') {
        if (gameBoard[row][col] !== 'Choco') {
            boosterSystem.useBooster('hammer', row, col);
        } else {
            showMessage('Cannot remove chocolate with hammer!', 'error');
        }
    } else if (boosterSystem.activeBooster === 'ufo') {
        boosterSystem.useBooster('ufo');
    }
}

function isAdjacent(c1, c2) {
    const rowDiff = Math.abs(c1.row - c2.row);
    const colDiff = Math.abs(c1.col - c2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function swapCandies(c1, c2) {
    const temp = gameBoard[c1.row][c1.col];
    gameBoard[c1.row][c1.col] = gameBoard[c2.row][c2.col];
    gameBoard[c2.row][c2.col] = temp;
}

function hasMatches() {
    return findMatches().length > 0;
}

function findMatches() {
    const matches = [];
    
    // Check horizontal matches
    for (let r = 0; r < GRID_SIZE; r++) {
        let matchLength = 1;
        for (let c = 1; c < GRID_SIZE; c++) {
            if (gameBoard[r][c] && gameBoard[r][c-1] && 
                !gameBoard[r][c].includes('Choco') && !gameBoard[r][c-1].includes('Choco') &&
                gameBoard[r][c].split('-')[0] === gameBoard[r][c-1].split('-')[0]) {
                matchLength++;
            } else {
                if (matchLength >= MATCH_MIN) {
                    for (let i = 0; i < matchLength; i++) {
                        matches.push({ row: r, col: c - 1 - i });
                    }
                }
                matchLength = 1;
            }
        }
        if (matchLength >= MATCH_MIN) {
            for (let i = 0; i < matchLength; i++) {
                matches.push({ row: r, col: GRID_SIZE - 1 - i });
            }
        }
    }
    
    // Check vertical matches
    for (let c = 0; c < GRID_SIZE; c++) {
        let matchLength = 1;
        for (let r = 1; r < GRID_SIZE; r++) {
            if (gameBoard[r][c] && gameBoard[r-1][c] && 
                !gameBoard[r][c].includes('Choco') && !gameBoard[r-1][c].includes('Choco') &&
                gameBoard[r][c].split('-')[0] === gameBoard[r-1][c].split('-')[0]) {
                matchLength++;
            } else {
                if (matchLength >= MATCH_MIN) {
                    for (let i = 0; i < matchLength; i++) {
                        matches.push({ row: r - 1 - i, col: c });
                    }
                }
                matchLength = 1;
            }
        }
        if (matchLength >= MATCH_MIN) {
            for (let i = 0; i < matchLength; i++) {
                matches.push({ row: GRID_SIZE - 1 - i, col: c });
            }
        }
    }
    
    // Remove duplicates
    const uniqueMatches = [];
    const seen = new Set();
    
    matches.forEach(match => {
        const key = `${match.row},${match.col}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueMatches.push(match);
        }
    });
    
    return uniqueMatches;
}

async function processMatches(addScore = true) {
    let matchesFound = false;
    let matchesProcessed = 0;
    
    while (true) {
        const matches = findMatches();
        if (matches.length === 0) break;
        
        matchesFound = true;
        matchesProcessed++;
        
        // Check for special candies
        if (LEVELS[currentLevel-1].specials) {
            checkForSpecialCandies(matches);
        }
        
        // Add score
        if (addScore) {
            const matchScore = matches.length * 10 * matchesProcessed;
            currentScore += matchScore;
            document.getElementById('current-score').textContent = currentScore;
            
            // Check for level complete
            if (currentScore >= targetScore) {
                levelComplete();
                return;
            }
        }
        
        // Animate removal
        animateMatches(matches);
        await sleep(300);
        
        // Remove matched candies
        matches.forEach(m => {
            gameBoard[m.row][m.col] = null;
        });
        
        // Apply gravity
        applyGravity();
        renderBoard();
        await sleep(200);
        
        // Fill empty spaces
        fillEmptySpaces();
        renderBoard();
        await sleep(200);
    }
    
    if (matchesFound) {
        renderBoard();
    }
    
    // Check game over
    if (movesLeft <= 0 && currentScore < targetScore) {
        gameOver();
    }
}

function checkForSpecialCandies(matches) {
    // Group by row/col to find patterns
    const rowCounts = {};
    const colCounts = {};
    
    matches.forEach(m => {
        rowCounts[m.row] = (rowCounts[m.row] || 0) + 1;
        colCounts[m.col] = (colCounts[m.col] || 0) + 1;
    });
    
    // Check for 4+ in a row (striped)
    Object.keys(rowCounts).forEach(row => {
        if (rowCounts[row] >= 4) {
            const col = parseInt(row);
            const color = gameBoard[row][col].split('-')[0];
            gameBoard[row][col] = `${color}-Striped-Horizontal`;
        }
    });
    
    Object.keys(colCounts).forEach(col => {
        if (colCounts[col] >= 4) {
            const row = parseInt(col);
            const color = gameBoard[row][col].split('-')[0];
            gameBoard[row][col] = `${color}-Striped-Vertical`;
        }
    });
    
    // Check for 5+ total (wrapped)
    if (matches.length >= 5) {
        const middle = matches[Math.floor(matches.length / 2)];
        const color = gameBoard[middle.row][middle.col].split('-')[0];
        gameBoard[middle.row][middle.col] = `${color}-Wrapped`;
    }
}

function applyGravity() {
    for (let c = 0; c < GRID_SIZE; c++) {
        const column = [];
        
        // Collect non-null candies
        for (let r = 0; r < GRID_SIZE; r++) {
            if (gameBoard[r][c] && gameBoard[r][c] !== 'Choco') {
                column.push(gameBoard[r][c]);
            }
        }
        
        // Fill from bottom
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
            if (gameBoard[r][c] === 'Choco') continue;
            
            if (column.length > 0) {
                gameBoard[r][c] = column.pop();
            } else {
                gameBoard[r][c] = null;
            }
        }
    }
}

function fillEmptySpaces() {
    const levelData = LEVELS[currentLevel-1];
    
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (gameBoard[r][c] === null) {
                const color = levelData.colors[Math.floor(Math.random() * levelData.colors.length)];
                gameBoard[r][c] = color;
            }
        }
    }
}

function shuffleBoard() {
    const levelData = LEVELS[currentLevel-1];
    
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (gameBoard[r][c] !== 'Choco') {
                gameBoard[r][c] = levelData.colors[Math.floor(Math.random() * levelData.colors.length)];
            }
        }
    }
    
    renderBoard();
}

function animateMatches(matches) {
    matches.forEach(m => {
        const cell = document.querySelector(`[data-row="${m.row}"][data-col="${m.col}"]`);
        if (cell) {
            cell.classList.add('match-animation');
            setTimeout(() => cell.classList.remove('match-animation'), 300);
        }
    });
}

// ==================== LEVEL MANAGEMENT ====================
function loadLevel(levelId) {
    currentLevel = levelId;
    const level = LEVELS[levelId-1];
    
    // Reset game state
    selectedCandy = null;
    currentScore = 0;
    movesLeft = level.moves;
    targetScore = level.target;
    
    // Update UI
    document.getElementById('level-name-display').textContent = `Level ${levelId}: ${level.name}`;
    document.getElementById('target-score').textContent = targetScore;
    document.getElementById('current-score').textContent = '0';
    document.getElementById('moves-left').textContent = movesLeft;
    
    // Initialize board
    initBoard(level);
    renderBoard();
    
    // Setup timer if needed
    if (level.timeLimit > 0) {
        timeLeft = level.timeLimit;
        startTimer();
    } else {
        document.getElementById('timer-display').parentElement.style.display = 'none';
    }
    
    gameActive = true;
}

function startTimer() {
    if (timer) clearInterval(timer);
    
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer-display').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameOver();
        }
    }, 1000);
}

function levelComplete() {
    gameActive = false;
    if (timer) clearInterval(timer);
    
    // Calculate stars
    const level = LEVELS[currentLevel-1];
    const percentScore = currentScore / targetScore;
    let stars = 1;
    if (percentScore >= 1.5) stars = 3;
    else if (percentScore >= 1.2) stars = 2;
    
    // Update progress
    if (currentUser) {
        if (!currentUser.progress.stars[currentLevel] || 
            currentUser.progress.stars[currentLevel] < stars) {
            currentUser.progress.stars[currentLevel] = stars;
        }
        
        if (currentLevel >= currentUser.progress.levelsUnlocked) {
            currentUser.progress.levelsUnlocked = currentLevel + 1;
        }
        
        // Add coins
        const coinsEarned = Math.floor(currentScore / 100) * stars;
        currentUser.progress.coins += coinsEarned;
        boosterSystem.coins = currentUser.progress.coins;
        
        saveUserData();
    }
    
    // Show victory screen
    document.getElementById('victory-level').textContent = currentLevel;
    document.getElementById('victory-score').textContent = currentScore;
    document.getElementById('victory-moves').textContent = movesLeft;
    document.getElementById('victory-coins').textContent = Math.floor(currentScore / 100) * stars;
    document.getElementById('victory-stars').innerHTML = '★'.repeat(stars) + '☆'.repeat(3-stars);
    
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('victory-screen').classList.remove('hidden');
}

function gameOver() {
    gameActive = false;
    if (timer) clearInterval(timer);
    
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.remove('hidden');
}

// ==================== UI SCREEN MANAGEMENT ====================
function showSplashScreen() {
    document.getElementById('splash-screen').classList.remove('hidden');
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('level-select-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
}

function showAuthScreen() {
    document.getElementById('splash-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('menu-screen').classList.add('hidden');
}

function showMainMenu() {
    if (!currentUser) return;
    
    document.getElementById('splash-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
    document.getElementById('level-select-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    
    // Update player info
    document.getElementById('player-name-display').textContent = currentUser.name;
    document.getElementById('player-level').textContent = currentUser.progress.levelsUnlocked;
    document.getElementById('player-coins').textContent = currentUser.progress.coins;
    document.getElementById('header-coins').textContent = currentUser.progress.coins;
    
    // Set avatar color
    document.getElementById('player-avatar').style.background = 
        currentUser.color === 'Red' ? '#ff6b6b' :
        currentUser.color === 'Blue' ? '#4ecdc4' :
        currentUser.color === 'Green' ? '#95e1d3' :
        currentUser.color === 'Yellow' ? '#ffe66d' :
        currentUser.color === 'Purple' ? '#b185db' : '#ffb347';
}

function showLevelSelect() {
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('level-select-screen').classList.remove('hidden');
    
    renderWorlds();
}

function renderWorlds() {
    const container = document.getElementById('worlds-container');
    const unlockedLevel = currentUser ? currentUser.progress.levelsUnlocked : 1;
    
    // Group levels into worlds (5 levels per world)
    const worlds = [];
    for (let i = 0; i < LEVELS.length; i += 5) {
        worlds.push(LEVELS.slice(i, i + 5));
    }
    
    let html = '';
    worlds.forEach((world, index) => {
        html += `
            <div class="world-card">
                <h2>🌍 World ${index + 1}</h2>
                <div class="level-grid">
        `;  
        
        world.forEach(level => {
            const stars = currentUser && currentUser.progress.stars[level.id] || 0;
            const isUnlocked = level.id <= unlockedLevel;
            
            html += `
                <div class="level-card ${isUnlocked ? 'unlocked' : 'locked'}" 
                     data-level="${level.id}">
                    <div class="level-number">${level.id}</div>
                    <div class="level-name">${level.name}</div>
                    <div class="stars">
                        ${'★'.repeat(stars)}${'☆'.repeat(3-stars)}
                    </div>
                    ${isUnlocked ? '<button class="play-btn">▶️ PLAY</button>' : '🔒'}
                </div>
            `;
        });
        
        html += '</div></div>';
    });
    
    container.innerHTML = html;
    
    // Add click handlers
    document.querySelectorAll('.level-card.unlocked').forEach(card => {
        card.addEventListener('click', () => {
            const levelId = parseInt(card.dataset.level);
            startLevel(levelId);
        });
    });
}

function startLevel(levelId) {
    document.getElementById('level-select-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    // Initialize booster system
    if (!boosterSystem) {
        boosterSystem = new BoosterSystem();
    }
    boosterSystem.loadFromUser(currentUser);
    boosterSystem.render();
    
    loadLevel(levelId);
}

function showMessage(type, text, className) {
    const element = document.getElementById(type === 'login' ? 'login-message' : 'register-message');
    element.textContent = text;
    element.className = `message ${className}`;
    
    setTimeout(() => {
        element.textContent = '';
        element.className = 'message';
    }, 3000);
}

function showHowToPlay() {
    document.getElementById('howto-modal').classList.remove('hidden');
}

function showBoosterShop() {
    if (!boosterSystem) return;
    
    const shop = document.getElementById('booster-shop');
    let html = '';
    
    Object.keys(boosterSystem.boosters).forEach(key => {
        const b = boosterSystem.boosters[key];
        html += `
            <div class="shop-item">
                <div class="shop-item-icon">${b.icon}</div>
                <div class="shop-item-details">
                    <div class="shop-item-name">${b.name}</div>
                    <div class="shop-item-desc">${b.description}</div>
                    <div class="shop-item-price">💰 ${b.price}</div>
                </div>
                <button class="buy-btn" data-booster="${key}" 
                        ${boosterSystem.coins < b.price ? 'disabled' : ''}>
                    BUY
                </button>
            </div>
        `;
    });
    
    shop.innerHTML = html;
    document.getElementById('shop-coins').textContent = boosterSystem.coins;
    document.getElementById('booster-modal').classList.remove('hidden');
    
    // Add buy handlers
    document.querySelectorAll('.buy-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.booster;
            const price = boosterSystem.boosters[key].price;
            
            if (boosterSystem.coins >= price) {
                boosterSystem.coins -= price;
                boosterSystem.boosters[key].count++;
                boosterSystem.saveToUser();
                showBoosterShop(); // Refresh
                boosterSystem.render(); // Update booster bar
            }
        });
    });
}

// ==================== UTILITY FUNCTIONS ====================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
    initUserSystem();
    
    // Check for saved session
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainMenu();
    } else {
        showSplashScreen();
    }
    
    // Splash screen
    document.getElementById('start-btn').addEventListener('click', () => {
        showAuthScreen();
    });
    
    // Auth tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            const formId = e.target.dataset.tab + '-form';
            document.getElementById('login-form').classList.remove('active');
            document.getElementById('register-form').classList.remove('active');
            document.getElementById(formId).classList.add('active');
        });
    });
    
    // Login
    document.getElementById('login-btn').addEventListener('click', () => {
        const name = document.getElementById('login-name').value;
        if (name.trim()) {
            loginUser(name.trim());
        } else {
            showMessage('login', 'Please enter your name!', 'error');
        }
    });
    
    // Register
    document.getElementById('register-btn').addEventListener('click', () => {
        const name = document.getElementById('reg-name').value;
        const color = document.getElementById('reg-color').value;
        
        if (name.trim()) {
            registerUser(name.trim(), color);
        } else {
            showMessage('register', 'Please enter a name!', 'error');
        }
    });
    
    // Menu buttons
    document.getElementById('play-btn').addEventListener('click', showLevelSelect);
    document.getElementById('boosters-btn').addEventListener('click', showBoosterShop);
    document.getElementById('howto-btn').addEventListener('click', showHowToPlay);
    document.getElementById('logout-btn').addEventListener('click', logoutUser);
    
    // Navigation
    document.getElementById('back-to-menu').addEventListener('click', showMainMenu);
    document.getElementById('game-back-btn').addEventListener('click', () => {
        if (confirm('Exit game? Your progress will be lost.')) {
            if (timer) clearInterval(timer);
            showLevelSelect();
        }
    });
    
    // Game controls
    document.getElementById('hint-btn').addEventListener('click', () => {
        showMessage('Look for matches!', 'info');
        // Simple hint: just highlight any possible move
        // Could be enhanced with actual hint detection
    });
    
    document.getElementById('shuffle-btn').addEventListener('click', () => {
        if (boosterSystem && boosterSystem.boosters.shuffle.count > 0) {
            boosterSystem.useBooster('shuffle');
        } else {
            showMessage('No shuffle boosters left!', 'error');
        }
    });
    
    // Victory screen
    document.getElementById('next-level-btn').addEventListener('click', () => {
        const nextLevel = currentLevel + 1;
        if (nextLevel <= LEVELS.length) {
            document.getElementById('victory-screen').classList.add('hidden');
            startLevel(nextLevel);
        } else {
            alert('Congratulations! You completed all levels!');
            showMainMenu();
        }
    });
    
    document.getElementById('replay-level-btn').addEventListener('click', () => {
        document.getElementById('victory-screen').classList.add('hidden');
        startLevel(currentLevel);
    });
    
    document.getElementById('victory-menu-btn').addEventListener('click', () => {
        document.getElementById('victory-screen').classList.add('hidden');
        showMainMenu();
    });
    
    // Game over screen
    document.getElementById('try-again-btn').addEventListener('click', () => {
        document.getElementById('gameover-screen').classList.add('hidden');
        startLevel(currentLevel);
    });
    
    document.getElementById('gameover-menu-btn').addEventListener('click', () => {
        document.getElementById('gameover-screen').classList.add('hidden');
        showMainMenu();
    });
    
    // Modals
    document.getElementById('close-howto').addEventListener('click', () => {
        document.getElementById('howto-modal').classList.add('hidden');
    });
    
    document.getElementById('close-booster').addEventListener('click', () => {
        document.getElementById('booster-modal').classList.add('hidden');
    });
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
    
    // Enter key for login
    document.getElementById('login-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('login-btn').click();
        }
    });
    
    document.getElementById('reg-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('register-btn').click();
        }
    });
});