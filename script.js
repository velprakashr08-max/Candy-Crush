const AudioManager={
    ctx:null,
    init(){
        if(!this.ctx) {
            try{this.ctx =new(window.AudioContext || window.webkitAudioContext)();} catch (e){}
        }
    },
    play(type){
        if (!this.ctx) return;
        const now =this.ctx.currentTime;
        const osc =this.ctx.createOscillator();
        const gain =this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        const sounds={
            select:{f:600,t:'sine',d:0.1,v:0.15},
            swap:{f:500,t:'triangle',d:0.15,v:0.12},
            match:{f:800,t:'sine',d:0.2,v:0.15},
            bigMatch:{f:1000,t:'square',d:0.25, v:0.12},
            special:{f:1200,t:'sawtooth',d:0.35,v:0.1},
            combo:{f:900,t:'sine',d:0.3,v:0.14},
            noMatch:{f:250,t:'square',d:0.2,v:0.1},
            victory:{f:523,t:'sine',d:0.8,v:0.15},
            gameOver:{f:200,t:'sawtooth',d:0.6,v:0.1},
            click:{f:440,t:'sine',d:0.08,v:0.1},
            hint:{f:700,t:'triangle',d:0.15,v:0.12},
            shuffle:{f:350,t:'square',d:0.2,v:0.1},
            star:{f:1100,t:'sine',d:0.3,v:0.12},
            colorBomb:{f:300,t:'sawtooth',d:0.5,v:0.13},
        };
        const s = sounds[type] || sounds.click;
        osc.type = s.t;    
        osc.frequency.setValueAtTime(s.f, now);    
        if (type === 'victory') {
            [523,659,784,1047].forEach((fr, i) => osc.frequency.setValueAtTime(fr, now + i * 0.18));
        }
        if (type === 'colorBomb') {          
            osc.frequency.setValueAtTime(300, now);       
            osc.frequency.linearRampToValueAtTime(1200, now + 0.3);  
            osc.frequency.linearRampToValueAtTime(600, now + s.d);    
        }   
        if (type === 'combo') {         
            osc.frequency.linearRampToValueAtTime(s.f * 1.5, now + s.d);
        } 
        gain.gain.setValueAtTime(s.v, now);           
        gain.gain.exponentialRampToValueAtTime(0.001, now + s.d);     
        osc.start(now);  
        osc.stop(now + s.d + 0.01);                  
    }              
};          
          

const CANDY_TYPES = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'];
   
const LEVELS = [  
    {   
        id: 1,
        name: 'Sweet Start',
        rows: 8,
        cols: 8,
        target: 1500,
        moves: 30,
        colors: ['Red', 'Blue', 'Green', 'Yellow'],
        specialsEnabled: true,
        blockers: 0,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    },
    {
        id: 2,
        name: 'Candy Storm',
        rows: 8,
        cols: 8,
        target: 3000,
        moves: 28,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'],
        specialsEnabled: true,
        blockers: 3,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    },
    {
        id: 3,
        name: 'Sugar Rush',
        rows: 8,
        cols: 8,
        target: 5000,
        moves: 30,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'],
        specialsEnabled: true,
        blockers: 5,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    },
    {
        id: 4,
        name: 'Jelly Jam',
        rows: 8,
        cols: 8,
        target: 7000,
        moves: 28,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'],
        specialsEnabled: true,
        blockers: 7,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    },
    {
        id: 5,
        name: 'Candy Blizzard',
        rows: 8,
        cols: 8,
        target: 9000,
        moves: 28,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specialsEnabled: true,
        blockers: 8,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    },
    {
        id: 6,
        name: 'Neon Sweets',
        rows: 8,
        cols: 8,
        target: 12000,
        moves: 25,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specialsEnabled: true,
        blockers: 10,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    },
    {
        id: 7,
        name: 'Rainbow Road',
        rows: 8,
        cols: 8,
        target: 15000,
        moves: 25,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specialsEnabled: true,
        blockers: 10,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    },
    {
        id: 8,
        name: 'Sugar Fiesta',
        rows: 8,
        cols: 8,
        target: 18000,
        moves: 23,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specialsEnabled: true,
        blockers: 12,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    },
    {
        id: 9,
        name: 'Candy Chaos',
        rows: 8,
        cols: 8,
        target: 22000,
        moves: 22,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specialsEnabled: true,
        blockers: 13,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    },
    {
        id: 10,
        name: 'Sugar Peak',
        rows: 8,
        cols: 8,
        target: 28000,
        moves: 20,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specialsEnabled: true,
        blockers: 15,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    },
    {
        id: 11,
        name: 'Candy Kingdom',
        rows: 8,
        cols: 8,
        target: 35000,
        moves: 20,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specialsEnabled: true,
        blockers: 17,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    },
    {
        id: 12,
        name: 'Sweet Apocalypse',
        rows: 8,
        cols: 8,
        target: 45000,
        moves: 18,
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'],
        specialsEnabled: true,
        blockers: 20,
        star1: 0.33,
        star2: 0.66,
        star3: 1.0
    }
];


let game = {
    board: [],
    rows: 8,
    cols: 8,
    selected: null,
    score: 0,
    moves: 0,
    target: 0,
    level: 1,
    isAnimating: false,
    combo: 0,
    maxCombo: 0,
    hintTimeout: null,
    colors: [],
    specialsEnabled: false,
    starsEarned: 0,
    levelData: null,
    dragStart: null,
    isDragging: false,
    dragGhost: null,
    swapMode: false,
    swapFirst: null,
};

let savedData = {
    levelStars: {},   
    bestScores: {},   
    unlockedLevel: 1, 
    coins: 100,
    inventory: { extraMoves: 0, rowBlast: 0, colBlast: 0, colorBomb: 0, wrappedBlast: 0 },
    profile: {
        name: 'Player',
        avatar: '🍬',
        gamesPlayed: 0,
        levelsWon: 0,
    },
};

const $ = id => document.getElementById(id);
const startScreen    = $('start-screen');
const levelScreen    = $('level-screen');
const gameScreen     = $('game-screen');
const victoryScreen  = $('victory-screen');
const gameoverScreen = $('gameover-screen');
const boardEl        = $('game-board');
const scoreEl        = $('current-score');
const movesEl        = $('moves-left');
const targetEl       = $('target-score');
const progressFill   = $('progress-fill');
const comboDisplay   = $('combo-display');
const comboText      = $('combo-text');
const scorePopups    = $('score-popups');
const toastContainer = $('toast-container');


function loadData() {
    try {
        const d = JSON.parse(localStorage.getItem('candyCrushSaga'));
        if (d) {
            savedData = {
                ...savedData,
                ...d,
                profile:   { ...savedData.profile,   ...(d.profile   || {}) },
                inventory: { ...savedData.inventory, ...(d.inventory || {}) },
            };
        }
    } catch (e) {}
}      

function saveData() {
    localStorage.setItem('candyCrushSaga', JSON.stringify(savedData));
}

// ==================== PROFILE ====================
function renderProfile() {
    const { name, avatar } = savedData.profile;
    // HUD chips
    const hudAvEls  = [$('hud-avatar'), $('level-hud-avatar')];
    const hudNmEls  = [$('hud-name'),   $('level-hud-name')];
    hudAvEls.forEach(el => { if (el) el.textContent = avatar; });
    hudNmEls.forEach(el => { if (el) el.textContent = name || 'Player'; });
}

function openProfile() {
    const { name, avatar } = savedData.profile;
    // name input
    $('profile-name-input').value = name || '';
    // avatar picker
    $('avatar-display').textContent = avatar;
    document.querySelectorAll('.av-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.av === avatar);
    });
    // stats
    const totalStars = Object.values(savedData.levelStars).reduce((a, b) => a + b, 0);
    const levelsWon  = savedData.profile.levelsWon || 0;
    const topScore   = savedData.bestScores
        ? Math.max(0, ...Object.values(savedData.bestScores))
        : 0;
    $('pstat-levels').textContent = levelsWon;
    $('pstat-stars').textContent  = totalStars;
    $('pstat-best').textContent   = topScore > 0 ? topScore.toLocaleString() : '—';

    $('profile-screen').classList.remove('hidden');
    AudioManager.play('click');
}

function closeProfile() {
    $('profile-screen').classList.add('hidden');
}

function saveProfile() {
    const name   = $('profile-name-input').value.trim() || 'Player';
    const avatar = $('avatar-display').textContent;
    savedData.profile.name   = name;
    savedData.profile.avatar = avatar;
    saveData();
    renderProfile();
    closeProfile();
    showToast('Profile saved!', 'success');
    AudioManager.play('click');
}

// ==================== COINS ====================
function renderCoins() {
    const coins = savedData.coins || 0;
    document.querySelectorAll('.coin-count-display').forEach(el => el.textContent = coins.toLocaleString());
}

// ==================== SHOP ====================
function openShop() {
    renderShop();
    $('shop-screen').classList.remove('hidden');
    AudioManager.play('click');
}
function closeShop() {
    $('shop-screen').classList.add('hidden');
}
function renderShop() {
    $('shop-coin-count').textContent = (savedData.coins || 0).toLocaleString();
    const inv = savedData.inventory;
    ['rowBlast','colBlast','wrappedBlast','colorBomb','extraMoves'].forEach(key => {
        const el = $(`own-${key}`);
        if (el) el.textContent = inv[key] || 0;
    });
    document.querySelectorAll('.shop-buy-btn').forEach(btn => {
        const cost = parseInt(btn.dataset.cost);
        btn.disabled = (savedData.coins || 0) < cost;
    });
}
function buyItem(itemKey, cost) {
    if ((savedData.coins || 0) < cost) {
        showToast('Not enough coins! 🪙', 'error');
        return;
    }
    savedData.coins -= cost;
    savedData.inventory[itemKey] = (savedData.inventory[itemKey] || 0) + 1;
    saveData();
    renderShop();
    renderCoins();
    renderPowerupBar();
    AudioManager.play('star');
    showToast(`${itemKey.replace(/([A-Z])/g,' $1').trim()} purchased! 🎉`, 'success');
}

// ==================== POWERUP BAR ====================
function renderPowerupBar() {
    const inv = savedData.inventory;
    ['rowBlast','colBlast','wrappedBlast','colorBomb','extraMoves'].forEach(key => {
        const countEl = $(`pu-count-${key}`);
        const btn     = $(`pu-${key}`);
        const qty = inv[key] || 0;
        if (countEl) countEl.textContent = qty;
        if (btn) {
            btn.disabled = qty <= 0;
            btn.classList.toggle('pu-empty', qty <= 0);
        }
    });
}

function usePowerup(key) {
    if (game.isAnimating) { showToast('Wait for the board to settle!', 'warning'); return; }
    const inv = savedData.inventory;
    if (!inv[key] || inv[key] <= 0) { showToast('Visit the shop to get powerups! 🛒', 'info'); return; }

    inv[key]--;
    saveData();
    renderPowerupBar();
    AudioManager.play('special');

    async function applyAndCascade(matches, score) {
        game.isAnimating = true;
        game.score += score;
        await animateMatches(matches, score);
        matches.forEach(m => { if (game.board[m.r]?.[m.c]?.type !== 'blocker') { checkAdjacentBlockers(m.r, m.c); game.board[m.r][m.c] = null; } });
        await doGravityFillRender();
        updateScore();
        await processBoardCascade();
        game.isAnimating = false;
        checkWinLoseState();
        scheduleHint();
    }

    if (key === 'rowBlast') {
        const r = Math.floor(Math.random() * game.rows);
        const matches = [];
        for (let c = 0; c < game.cols; c++) { if (game.board[r][c]?.type !== 'blocker') matches.push({ r, c }); }
        showLineClearEffect(r, null);
        applyAndCascade(matches, matches.length * 25);

    } else if (key === 'colBlast') {
        const c = Math.floor(Math.random() * game.cols);
        const matches = [];
        for (let r = 0; r < game.rows; r++) { if (game.board[r][c]?.type !== 'blocker') matches.push({ r, c }); }
        showLineClearEffect(null, c);
        applyAndCascade(matches, matches.length * 25);

    } else if (key === 'wrappedBlast') {
        const cr = Math.floor(game.rows / 2), cc = Math.floor(game.cols / 2);
        const matches = [];
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            const nr = cr + dr, nc = cc + dc;
            if (nr >= 0 && nr < game.rows && nc >= 0 && nc < game.cols && game.board[nr][nc]?.type !== 'blocker')
                matches.push({ r: nr, c: nc });
        }
        showExplosionEffect(cr, cc);
        applyAndCascade(matches, matches.length * 30);

    } else if (key === 'colorBomb') {
        const targetColor = findBestBombColor(Math.floor(game.rows / 2), Math.floor(game.cols / 2));
        const matches = [];
        if (targetColor) {
            for (let r = 0; r < game.rows; r++)
                for (let c = 0; c < game.cols; c++)
                    if (game.board[r][c]?.color === targetColor && game.board[r][c].type !== 'blocker')
                        matches.push({ r, c });
        }
        showColorBombEffect(targetColor);
        applyAndCascade(matches, matches.length * 30);

    } else if (key === 'extraMoves') {
        game.moves += 5;
        movesEl.textContent = game.moves;
        updateMovesStyle();
        showToast('+5 Moves added! 🎯', 'success');
    }
}

function checkWinLoseState() {
    if (game.moves <= 0) {
        if (game.score >= Math.ceil(game.levelData.star1 * game.target)) { winLevel(); }
        else { loseLevel(); }
    }
}


function showScreen(screen) {
    [startScreen, levelScreen, gameScreen, victoryScreen, gameoverScreen].forEach(s => {
        s.classList.add('hidden');
    });
    screen.classList.remove('hidden');   
}


const howToPlayBtn=document.getElementById('how-to-play-btn');
const htpScreen=document.getElementById('how-to-play-screen');
const htpCloseBtn=document.getElementById('htp-close-btn');
const htpGotItBtn=document.getElementById('htp-got-it-btn');

howToPlayBtn.addEventListener('click',()=>{
    htpScreen.classList.remove('hidden');
});

function closeHtp(){
    htpScreen.classList.add('hidden');
}

htpCloseBtn.addEventListener('click',closeHtp);
htpGotItBtn.addEventListener('click',closeHtp);   

htpScreen.addEventListener('click',
    (e)=>{   
        if(e.target===htpScreen) closeHtp();
    }
)        
function goToStart() {    
    AudioManager.play('click');
    showScreen(startScreen);
}

function goToLevels() {
    AudioManager.play('click');
    updateLevelCards();
    showScreen(levelScreen);
}

function updateLevelCards() {
    LEVELS.forEach(lv => {
        const card = document.querySelector(`.level-card[data-level="${lv.id}"]`);
        if (!card) return;

        const unlocked = lv.id <= savedData.unlockedLevel;

        card.classList.toggle('unlocked', unlocked);
        card.classList.toggle('locked', !unlocked);

        const lock = card.querySelector('.lock-overlay');
        const playBtn = card.querySelector('.level-play-btn');

        if (unlocked) {
            if (lock) lock.style.display = 'none';
            playBtn.disabled = false;
            playBtn.textContent = 'PLAY';
        } else {
            if (lock) lock.style.display = 'flex';
            playBtn.disabled = true;
            playBtn.textContent = 'LOCKED';
        }

        // Best score under node
        let bestEl = card.querySelector('.node-best');
        const best = savedData.bestScores[lv.id] || 0;
        if (best > 0) {
            if (!bestEl) {
                bestEl = document.createElement('div');
                bestEl.className = 'node-best';
                const nameEl = card.querySelector('.node-name');
                if (nameEl) nameEl.after(bestEl);
            }
            bestEl.textContent = 'Best: ' + best.toLocaleString();
        } else if (bestEl) {
            bestEl.remove();
        }

        
        const starsContainer = $(`stars-${lv.id}`);
        if (starsContainer) {
            const earned = savedData.levelStars[lv.id] || 0;
            const spans = starsContainer.querySelectorAll('.star');
            spans.forEach((s, i) => {
                s.classList.toggle('earned', i < earned);
            });
        }
    });
}


function startLevel(levelNum) {
    AudioManager.init();
    AudioManager.play('click');

    const levelData = LEVELS.find(l => l.id === levelNum);
    if (!levelData) return;

    game = {
        board: [],
        rows: levelData.rows,
        cols: levelData.cols,
        selected: null,
        score: 0,
        moves: levelData.moves,
        target: levelData.target,
        level: levelNum,
        isAnimating: false,
        combo: 0,
        maxCombo: 0,
        hintTimeout: null,
        colors: levelData.colors,
        specialsEnabled: levelData.specialsEnabled,
        starsEarned: 0,
        levelData,
        dragStart: null,
        isDragging: false,
        dragGhost: null,
        swapMode: false,
        swapFirst: null,
    };

    targetEl.textContent = Math.ceil(levelData.target * levelData.star1).toLocaleString();
    scoreEl.textContent = '0';
    movesEl.textContent = game.moves;
    progressFill.style.width = '0%';

    ['pstar1', 'pstar2', 'pstar3'].forEach(id => { $(id).classList.remove('earned'); });
    comboDisplay.classList.add('hidden');
    const movesBlock = document.querySelector('.moves-block');
    if (movesBlock) movesBlock.classList.remove('low-moves');
    boardEl.style.gridTemplateColumns = `repeat(${game.cols}, var(--candy-size))`;
    boardEl.style.gridTemplateRows    = `repeat(${game.rows}, var(--candy-size))`;
    renderPowerupBar();
    initBoard();
    renderBoard();
    showScreen(gameScreen);
    scheduleHint();
}


function initBoard() {
    game.board = [];
    for (let r = 0; r < game.rows; r++) {
        game.board[r] = [];
        for (let c = 0; c < game.cols; c++) {
            game.board[r][c] = createCandy(r, c);
        }
    }

    
    if (game.levelData.blockers > 0) {
        let placed = 0;
        const maxAttempts = 200;
        let attempts = 0;
        while (placed < game.levelData.blockers && attempts < maxAttempts) {
            const r = Math.floor(Math.random() * game.rows);
            const c = Math.floor(Math.random() * game.cols);
            if (game.board[r][c].type !== 'blocker') {
                game.board[r][c] = { type: 'blocker', color: null, special: null, img: 'images/Choco.png' };
                placed++;
            }
            attempts++;
        }
    }

    let hasMatches = true;
    let safety = 0;
    while (hasMatches && safety < 50) {
        hasMatches = false;
        for (let r = 0; r < game.rows; r++) {
            for (let c = 0; c < game.cols; c++) {
                if (game.board[r][c].type === 'blocker') continue;
                
                if (c >= 2 &&
                    game.board[r][c].color === game.board[r][c-1].color &&
                    game.board[r][c].color === game.board[r][c-2].color) {
                    game.board[r][c] = createCandy(r, c);
                    hasMatches = true;
                }
                
                if (r >= 2 &&
                    game.board[r][c].color === game.board[r-1][c].color &&
                    game.board[r][c].color === game.board[r-2][c].color) {
                    game.board[r][c] = createCandy(r, c);
                    hasMatches = true;
                }
            }
        }
        safety++;
    }
}

function createCandy(r, c) {
    const color = game.colors[Math.floor(Math.random() * game.colors.length)];
    return {
        type: 'candy',
        color,
        special: null,
        img: `images/${color}.png`
    };
}

function getSpecialImg(color, special) {
    if (special === 'striped-h') return `images/${color}-Striped-Horizontal.png`;
    if (special === 'striped-v') return `images/${color}-Striped-Vertical.png`;
    if (special === 'wrapped')  return `images/${color}-Wrapped.png`;
    if (special === 'color-bomb') return 'images/Choco.png';
    return `images/${color}.png`;
}


function renderBoard() {
    boardEl.innerHTML = '';
    
    const existingBanner = document.querySelector('.swap-mode-banner');
    if (existingBanner) existingBanner.remove();

    for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'candy-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;

            const candy = game.board[r][c];
            if (candy && candy.type === 'blocker') {
                cell.classList.add('blocker');
                const img = document.createElement('img');
                img.src = candy.img;
                img.className = 'candy-img';
                img.draggable = false;
                cell.appendChild(img);
            } else if (candy && (candy.color || candy.special === 'color-bomb')) {
                const img = document.createElement('img');
                img.src = candy.special ? getSpecialImg(candy.color, candy.special) : candy.img;
                img.className = 'candy-img';
                img.draggable = false;
                cell.appendChild(img);
                if (candy.special) {
                    cell.classList.add('special-glow');
                    if (candy.special === 'color-bomb') {
                        cell.classList.add('color-bomb-cell');
                    }
                }
            }

            if (game.selected && game.selected.r === r && game.selected.c === c) {
                cell.classList.add('selected');
            }

            
            if (game.swapMode) {
                cell.classList.add('swap-mode-active');
                if (game.swapFirst && game.swapFirst.r === r && game.swapFirst.c === c) {
                    cell.classList.add('swap-selected');
                }
            }

            
            cell.addEventListener('click', (e) => {
                if (game.isDragging) return; 
                if (game.swapMode) {
                    onSwapModeClick(r, c);
                } else {
                    onCellClick(r, c);
                }
            });

            
            cell.addEventListener('mousedown', (e) => {
                if (game.isAnimating || game.swapMode) return;
                if (candy?.type === 'blocker') return;
                e.preventDefault();
                startDrag(r, c, e.clientX, e.clientY);
            });

            
            let touchStart = null;
            cell.addEventListener('touchstart', e => {
                touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, r, c };
                if (!game.isAnimating && !game.swapMode && candy?.type !== 'blocker') {
                    startDrag(r, c, e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            cell.addEventListener('touchmove', e => {
                if (game.isDragging && game.dragGhost) {
                    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
                    e.preventDefault();
                }
            }, { passive: false });

            cell.addEventListener('touchend', e => {
                if (game.isDragging) {
                    endDrag(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                    touchStart = null;
                    return;
                }
                if (!touchStart) return;
                const dx = e.changedTouches[0].clientX - touchStart.x;
                const dy = e.changedTouches[0].clientY - touchStart.y;
                const absDx = Math.abs(dx);
                const absDy = Math.abs(dy);

                if (absDx < 15 && absDy < 15) {
                    if (game.swapMode) {
                        onSwapModeClick(touchStart.r, touchStart.c);
                    } else {
                        onCellClick(touchStart.r, touchStart.c);
                    }
                    touchStart = null;
                    return;
                }

                let tr, tc;
                if (absDx > absDy) {
                    tr = touchStart.r;
                    tc = touchStart.c + (dx > 0 ? 1 : -1);
                } else {
                    tr = touchStart.r + (dy > 0 ? 1 : -1);
                    tc = touchStart.c;
                }

                if (tr >= 0 && tr < game.rows && tc >= 0 && tc < game.cols) {
                    game.selected = { r: touchStart.r, c: touchStart.c };
                    onCellClick(tr, tc);
                }
                touchStart = null;
            }, { passive: true });

            boardEl.appendChild(cell);
        }
    }
}

function updateCellVisual(r, c) {
    const idx = r * game.cols + c;
    const cell = boardEl.children[idx];
    if (!cell) return;

    const candy = game.board[r][c];
    cell.innerHTML = '';
    cell.className = 'candy-cell';

    if (!candy || (!candy.color && candy.special !== 'color-bomb')) {
        if (candy && candy.type === 'blocker') {
            cell.classList.add('blocker');
            const img = document.createElement('img');
            img.src = candy.img;
            img.className = 'candy-img';
            img.draggable = false;
            cell.appendChild(img);
        }
        return;
    }

    const img = document.createElement('img');
    img.src = candy.special ? getSpecialImg(candy.color, candy.special) : candy.img;
    img.className = 'candy-img';
    img.draggable = false;
    cell.appendChild(img);

    if (candy.special) {
        cell.classList.add('special-glow');
        if (candy.special === 'color-bomb') {
            cell.classList.add('color-bomb-cell');
        }
    }
}


function onCellClick(r, c) {
    if (game.isAnimating) return;
    const candy = game.board[r][c];
    if (!candy || candy.type === 'blocker') return;

    AudioManager.init();

    if (!game.selected) {
        game.selected = { r, c };
        AudioManager.play('select');
        highlightSelected(r, c);
        clearHint();
        scheduleHint();
        return;
    }

    const sr = game.selected.r;
    const sc = game.selected.c;

    if (sr === r && sc === c) {
        game.selected = null;
        clearHighlight();
        return;
    }

    const isAdjacent = (Math.abs(sr - r) + Math.abs(sc - c)) === 1;
    if (!isAdjacent) {
        game.selected = { r, c };
        AudioManager.play('select');
        highlightSelected(r, c);
        return;
    }

    
    clearHint();
    clearHighlight();
    trySwap(sr, sc, r, c);
}

function highlightSelected(r, c) {
    boardEl.querySelectorAll('.candy-cell.selected').forEach(el => el.classList.remove('selected'));
    const idx = r * game.cols + c;
    if (boardEl.children[idx]) boardEl.children[idx].classList.add('selected');
}

function clearHighlight() {
    boardEl.querySelectorAll('.candy-cell.selected').forEach(el => el.classList.remove('selected'));
}


function startDrag(r, c, x, y) {
    if (game.isAnimating || game.swapMode) return;
    const candy = game.board[r][c];
    if (!candy || candy.type === 'blocker') return;

    game.dragStart = { r, c, x, y };
    game.isDragging = false; 

    
    const idx = r * game.cols + c;
    const cell = boardEl.children[idx];
    if (cell) cell.classList.add('dragging');
}

function moveDrag(x, y) {
    if (!game.dragStart) return;
    const dx = x - game.dragStart.x;
    const dy = y - game.dragStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 12 && !game.isDragging) return; 

    if (!game.isDragging) {
        game.isDragging = true;
        AudioManager.init();
        AudioManager.play('select');

        
        const candy = game.board[game.dragStart.r][game.dragStart.c];
        if (candy) {
            const ghost = document.createElement('img');
            ghost.src = candy.special ? getSpecialImg(candy.color, candy.special) : candy.img;
            ghost.className = 'drag-ghost';
            document.body.appendChild(ghost);
            game.dragGhost = ghost;
        }
    }

    if (game.dragGhost) {
        game.dragGhost.style.left = `${x - 35}px`;
        game.dragGhost.style.top = `${y - 35}px`;
    }

    
    boardEl.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    const target = getCellUnderPoint(x, y);
    if (target) {
        const { r: tr, c: tc } = target;
        const isAdj = (Math.abs(tr - game.dragStart.r) + Math.abs(tc - game.dragStart.c)) === 1;
        if (isAdj && game.board[tr][tc]?.type !== 'blocker') {
            const idx = tr * game.cols + tc;
            if (boardEl.children[idx]) boardEl.children[idx].classList.add('drag-over');
        }
    }
}

function endDrag(x, y) {
    
    if (game.dragGhost) {
        game.dragGhost.remove();
        game.dragGhost = null;
    }
    boardEl.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    boardEl.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

    if (!game.dragStart) { game.isDragging = false; return; }

    if (game.isDragging) {
        const target = getCellUnderPoint(x, y);
        if (target) {
            const { r: tr, c: tc } = target;
            const sr = game.dragStart.r;
            const sc = game.dragStart.c;
            const isAdj = (Math.abs(tr - sr) + Math.abs(tc - sc)) === 1;
            if (isAdj && game.board[tr][tc]?.type !== 'blocker') {
                game.selected = null;
                clearHighlight();
                clearHint();
                trySwap(sr, sc, tr, tc);
            }
        }
    }

    game.dragStart = null;
    
    setTimeout(() => { game.isDragging = false; }, 50);
}

function getCellUnderPoint(x, y) {
    const cells = boardEl.querySelectorAll('.candy-cell');
    for (const cell of cells) {
        const rect = cell.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            return { r: parseInt(cell.dataset.row), c: parseInt(cell.dataset.col) };
        }
    }
    return null;
}


document.addEventListener('mousemove', (e) => {
    if (game.dragStart) {
        moveDrag(e.clientX, e.clientY);
    }
});

document.addEventListener('mouseup', (e) => {
    if (game.dragStart) {
        endDrag(e.clientX, e.clientY);
    }
});


function enterSwapMode() {
    if (game.isAnimating) return;
    game.swapMode = true;
    game.swapFirst = null;
    game.selected = null;
    clearHighlight();
    clearHint();

    
    const shuffleBtn = $('shuffle-btn');
    shuffleBtn.classList.add('active');
    shuffleBtn.innerHTML = '<i class="icon-shuffle"></i> Cancel Swap';


    const banner = document.createElement('div');
    banner.className = 'swap-mode-banner';
    banner.innerHTML = 'Pick 2 candies to swap <button class="cancel-swap"><i class="icon-close"></i></button>';
    banner.querySelector('.cancel-swap').addEventListener('click', exitSwapMode);
    document.querySelector('.board-wrapper').appendChild(banner);


    boardEl.querySelectorAll('.candy-cell:not(.blocker)').forEach(cell => {
        cell.classList.add('swap-mode-active');
    });

    showToast('Select any 2 candies to swap!', 'info');
    AudioManager.play('click');
}

function exitSwapMode() {
    game.swapMode = false;
    game.swapFirst = null;

    const shuffleBtn = $('shuffle-btn');
    shuffleBtn.classList.remove('active');
    shuffleBtn.innerHTML = '<i class="icon-shuffle"></i> Shuffle';

    const banner = document.querySelector('.swap-mode-banner');
    if (banner) banner.remove();

    boardEl.querySelectorAll('.swap-mode-active').forEach(el => el.classList.remove('swap-mode-active'));
    boardEl.querySelectorAll('.swap-selected').forEach(el => el.classList.remove('swap-selected'));

    scheduleHint();
    AudioManager.play('click');
}

function onSwapModeClick(r, c) {
    if (game.isAnimating) return;
    const candy = game.board[r][c];
    if (!candy || candy.type === 'blocker') return;

    AudioManager.init();
    AudioManager.play('select');

    if (!game.swapFirst) {
        
        game.swapFirst = { r, c };
        const idx = r * game.cols + c;
        boardEl.querySelectorAll('.swap-selected').forEach(el => el.classList.remove('swap-selected'));
        if (boardEl.children[idx]) boardEl.children[idx].classList.add('swap-selected');
        return;
    }

    
    if (game.swapFirst.r === r && game.swapFirst.c === c) {
        game.swapFirst = null;
        boardEl.querySelectorAll('.swap-selected').forEach(el => el.classList.remove('swap-selected'));
        return;
    }

    
    const sr = game.swapFirst.r;
    const sc = game.swapFirst.c;

    
    game.moves--;
    movesEl.textContent = game.moves;
    updateMovesStyle();

    exitSwapMode();

    
    game.isAnimating = true;
    AudioManager.play('swap');
    swap(sr, sc, r, c);
    animateSwap(sr, sc, r, c).then(async () => {
    
        const matches = findAllMatches();
        if (matches.length > 0) {
            game.combo = 0;
            await processBoardCascade();
        }
        game.isAnimating = false;

        if (game.moves <= 0) { checkWinLoseState(); return; }
        if (!hasValidMoves()) {
            showToast('No matches possible! Use Shuffle.', 'warning');
        }
        scheduleHint();
    });
}


async function trySwap(r1, c1, r2, c2) {
    game.isAnimating = true;
    game.selected = null;

    AudioManager.play('swap');

    
    const candy1 = game.board[r1][c1];
    const candy2 = game.board[r2][c2];
    const isColorBombSwap = candy1?.special === 'color-bomb' || candy2?.special === 'color-bomb';

    
    if (isColorBombSwap) {
        if (candy1?.special === 'color-bomb' && candy2?.color) {
            candy1._bombTargetColor = candy2.color;
        }
        if (candy2?.special === 'color-bomb' && candy1?.color) {
            candy2._bombTargetColor = candy1.color;
        }
    }

    
    const specialCombo = checkSpecialCombo(r1, c1, r2, c2);

    
    swap(r1, c1, r2, c2);

    
    await animateSwap(r1, c1, r2, c2);

    
    if (specialCombo && specialCombo.size > 0) {
        game.moves--;
        movesEl.textContent = game.moves;
        updateMovesStyle();
        game.combo = 0;

        
        const comboMatches = [...specialCombo].map(k => {
            const [r, c] = k.split(',').map(Number);
            return { r, c };
        });

        
        const totalScore = comboMatches.length * 40;
        game.score += totalScore;

        await animateMatches(comboMatches, totalScore);

    
        for (const m of comboMatches) {
            if (game.board[m.r]?.[m.c]?.type !== 'blocker') {
                checkAdjacentBlockers(m.r, m.c);
                game.board[m.r][m.c] = null;
            }
        }

        await doGravityFillRender();
        updateScore();

        await processBoardCascade();

        game.isAnimating = false;
        if (game.moves <= 0) { checkWinLoseState(); return; }
        if (!hasValidMoves()) {
            showToast('No moves left! Shuffling...', 'warning');
            shuffleBoard();
        }
        scheduleHint();
        return;
    }

    if (isColorBombSwap) {
        game.moves--;
        movesEl.textContent = game.moves;
        updateMovesStyle();
        game.combo = 0;

        const bombCandy = candy1?.special === 'color-bomb' ? candy1 : candy2;
        const partnerCandy = candy1?.special === 'color-bomb' ? candy2 : candy1;
        const bombPos = candy1?.special === 'color-bomb' ? { r: r2, c: c2 } : { r: r1, c: c1 };
        const targetColor = partnerCandy?.color;

        if (targetColor) {
            const bombClears = [];
            for (let rr = 0; rr < game.rows; rr++) {
                for (let cc = 0; cc < game.cols; cc++) {
                    if (game.board[rr][cc]?.color === targetColor && game.board[rr][cc].type !== 'blocker') {
                        bombClears.push({ r: rr, c: cc });
                    }
                }
            }
            if (!bombClears.find(m => m.r === bombPos.r && m.c === bombPos.c)) {
                bombClears.push(bombPos);
            }

            showColorBombEffect(targetColor);
            AudioManager.play('colorBomb');

            const totalScore = bombClears.length * 30;
            game.score += totalScore;

            await animateMatches(bombClears, totalScore);

            for (const m of bombClears) {
                if (game.board[m.r]?.[m.c]?.type !== 'blocker') {
                    checkAdjacentBlockers(m.r, m.c);
                    game.board[m.r][m.c] = null;
                }
            }

            await doGravityFillRender();
            updateScore();

            await processBoardCascade();
        }

        game.isAnimating = false;
        if (game.moves <= 0) { checkWinLoseState(); return; }
        if (!hasValidMoves()) {
            showToast('No moves left! Shuffling...', 'warning');
            shuffleBoard();
        }
        scheduleHint();
        return;
    }    

    const matches = findAllMatches();
    if (matches.length === 0) {
    
        AudioManager.play('noMatch');     
        swap(r1, c1, r2, c2);
        await animateSwap(r1, c1, r2, c2);
        game.isAnimating = false;
        scheduleHint();
        return;
    } 

    
    game.moves--;
    movesEl.textContent = game.moves;
    updateMovesStyle();
           
    game.combo = 0;     
          
    await processBoardCascade();           

    game.isAnimating = false;

    
    if (game.moves <= 0) {
        checkWinLoseState();
        return;
    }

    
    if (!hasValidMoves()) {    
        showToast('No moves left! Shuffling...', 'warning');
        shuffleBoard();
    }

    scheduleHint();
}

function swap(r1, c1, r2, c2) {
    const temp = game.board[r1][c1];
    game.board[r1][c1] = game.board[r2][c2];
    game.board[r2][c2] = temp;
}

async function animateSwap(r1, c1, r2, c2) {
    const idx1 = r1 * game.cols + c1;
    const idx2 = r2 * game.cols + c2;
    const cell1 = boardEl.children[idx1];
    const cell2 = boardEl.children[idx2];

    if (cell1 && cell2) {
        const dr = r2 - r1;
        const dc = c2 - c1;
        const cellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--candy-size'));
        const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-gap'));
        const offset = cellSize + gap;

        
        cell1.style.transition = 'transform 0.25s cubic-bezier(.25,.8,.25,1)';
        cell1.style.transform = `translate(${dc * offset}px, ${dr * offset}px)`;
        cell1.style.zIndex = '15';

        
        cell2.style.transition = 'transform 0.25s cubic-bezier(.25,.8,.25,1)';
        cell2.style.transform = `translate(${-dc * offset}px, ${-dr * offset}px)`;

        await sleep(260);

        
        cell1.style.transition = '';
        cell1.style.transform = '';
        cell1.style.zIndex = '';
        cell2.style.transition = '';
        cell2.style.transform = '';
    }

    updateCellVisual(r1, c1);
    updateCellVisual(r2, c2);
}

function findAllMatches() {
    const matches = new Set();


    for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.cols - 2; c++) {
            const candy = game.board[r][c];
            const color = candy?.color;
            if (!color || candy.type === 'blocker' || candy.special === 'color-bomb') continue;
            let matchLen = 1;
            while (c + matchLen < game.cols &&
                   game.board[r][c + matchLen]?.color === color &&
                   game.board[r][c + matchLen].type !== 'blocker' &&
                   game.board[r][c + matchLen].special !== 'color-bomb') {
                matchLen++;
            }
            if (matchLen >= 3) {
                for (let i = 0; i < matchLen; i++) {
                    matches.add(`${r},${c + i}`);
                }
            }
            c += matchLen - 1;
        }
    }

    
    for (let c = 0; c < game.cols; c++) {
        for (let r = 0; r < game.rows - 2; r++) {
            const candy = game.board[r][c];
            const color = candy?.color;
            if (!color || candy.type === 'blocker' || candy.special === 'color-bomb') continue;
            let matchLen = 1;
            while (r + matchLen < game.rows &&
                   game.board[r + matchLen][c]?.color === color &&
                   game.board[r + matchLen][c].type !== 'blocker' &&
                   game.board[r + matchLen][c].special !== 'color-bomb') {
                matchLen++;
            }
            if (matchLen >= 3) {
                for (let i = 0; i < matchLen; i++) {
                    matches.add(`${r + i},${c}`);
                }
            }
            r += matchLen - 1;
        }
    }

    return [...matches].map(k => {
        const [r, c] = k.split(',').map(Number);
        return { r, c };
    });
}

function findMatchShapes() {
    const hMatches = [];
    const vMatches = [];

    
    for (let r = 0; r < game.rows; r++) {
        let c = 0;
        while (c < game.cols) {
            const candy = game.board[r][c];
            const color = candy?.color;
            if (!color || candy.type === 'blocker' || candy.special === 'color-bomb') { c++; continue; }
            let end = c + 1;
            while (end < game.cols && game.board[r][end]?.color === color && game.board[r][end].type !== 'blocker' && game.board[r][end].special !== 'color-bomb') end++;
            const len = end - c;
            if (len >= 3) {
                const cells = [];
                for (let i = c; i < end; i++) cells.push({ r, c: i });
                hMatches.push({ cells, len, dir: 'h', color, startR: r, startC: c, endC: end - 1 });
            }
            c = end;
        }
    }

    
    for (let c = 0; c < game.cols; c++) {
        let r = 0;
        while (r < game.rows) {
            const candy = game.board[r][c];
            const color = candy?.color;
            if (!color || candy.type === 'blocker' || candy.special === 'color-bomb') { r++; continue; }
            let end = r + 1;
            while (end < game.rows && game.board[end][c]?.color === color && game.board[end][c].type !== 'blocker' && game.board[end][c].special !== 'color-bomb') end++;
            const len = end - r;
            if (len >= 3) {
                const cells = [];
                for (let i = r; i < end; i++) cells.push({ r: i, c });
                vMatches.push({ cells, len, dir: 'v', color, startR: r, endR: end - 1, startC: c });
            }
            r = end;
        }
    }

    
    const ltShapes = [];
    const usedH = new Set();
    const usedV = new Set();

    for (let hi = 0; hi < hMatches.length; hi++) {
        for (let vi = 0; vi < vMatches.length; vi++) {
            const h = hMatches[hi];
            const v = vMatches[vi];
            if (h.color !== v.color) continue;

            
            const intersection = h.cells.find(hc => v.cells.find(vc => vc.r === hc.r && vc.c === hc.c));
            if (intersection) {
                
                const mergedCells = [...h.cells];
                for (const vc of v.cells) {
                    if (!mergedCells.find(mc => mc.r === vc.r && mc.c === vc.c)) {
                        mergedCells.push(vc);
                    }
                }
                ltShapes.push({
                    cells: mergedCells,
                    len: mergedCells.length,
                    dir: 'lt',
                    color: h.color,
                    intersection
                });
                usedH.add(hi);
                usedV.add(vi);
            }
        }
    }

    
    const shapes = [...ltShapes];
    for (let i = 0; i < hMatches.length; i++) {
        if (!usedH.has(i)) shapes.push(hMatches[i]);
    }
    for (let i = 0; i < vMatches.length; i++) {
        if (!usedV.has(i)) shapes.push(vMatches[i]);
    }

    return shapes;
}


async function processBoardCascade() {
    let matches = findAllMatches();
    while (matches.length > 0) {
        game.combo++;
        if (game.combo > game.maxCombo) game.maxCombo = game.combo;

        if (game.combo >= 2) {
            showCombo(game.combo);
            AudioManager.play('combo');
        }

        
        const shapes = findMatchShapes();
        const specialsToCreate = [];

        if (game.specialsEnabled) {
            for (const shape of shapes) {
                if (shape.dir === 'lt') {
                    
                    specialsToCreate.push({
                        r: shape.intersection.r,
                        c: shape.intersection.c,
                        color: shape.color,
                        special: 'wrapped'
                    });
                } else if (shape.len >= 5) {
                    
                    const mid = shape.cells[Math.floor(shape.cells.length / 2)];
                    specialsToCreate.push({
                        r: mid.r,
                        c: mid.c,
                        color: shape.color,
                        special: 'color-bomb'
                    });
                } else if (shape.len === 4) {
                    
                    const mid = shape.cells[Math.floor(shape.cells.length / 2)];
                    const special = shape.dir === 'h' ? 'striped-v' : 'striped-h';
                    specialsToCreate.push({
                        r: mid.r,
                        c: mid.c,
                        color: shape.color,
                        special
                    });
                }
            }
        }

        
        const extraClears = new Set();
        const processedSpecials = new Set();

        function activateSpecialsInList(matchList) {
            for (const m of matchList) {
                const key = `${m.r},${m.c}`;
                if (processedSpecials.has(key)) continue;
                const candy = game.board[m.r][m.c];
                if (candy && candy.special) {
                    processedSpecials.add(key);
                    const cleared = activateSpecial(candy, m.r, m.c);
                    const newClears = [];
                    cleared.forEach(pos => {
                        const pk = `${pos.r},${pos.c}`;
                        if (!extraClears.has(pk)) {
                            extraClears.add(pk);
                            newClears.push(pos);
                        }
                    });
                
                    if (newClears.length > 0) {
                        activateSpecialsInList(newClears);
                    }
                }
            }
        }
        activateSpecialsInList(matches);

        
        extraClears.forEach(key => {
            const [r, c] = key.split(',').map(Number);
            if (!matches.find(m => m.r === r && m.c === c)) {
                matches.push({ r, c });
            }
        });

        
        const baseScore = matches.length * 20;
        const comboBonus = game.combo > 1 ? Math.floor(baseScore * (game.combo - 1) * 0.5) : 0;
        const totalScore = baseScore + comboBonus;
        game.score += totalScore;

        await animateMatches(matches, totalScore);

        
        for (const m of matches) {
            if (game.board[m.r][m.c]?.type !== 'blocker') {
                
                checkAdjacentBlockers(m.r, m.c);
                game.board[m.r][m.c] = null;
            }
        }

    
        for (const sp of specialsToCreate) {
            if (!game.board[sp.r][sp.c]) {
                game.board[sp.r][sp.c] = {
                    type: 'candy',
                    color: sp.special === 'color-bomb' ? null : sp.color,
                    special: sp.special,
                    img: sp.special === 'color-bomb' ? 'images/Choco.png' : `images/${sp.color}.png`
                };
                AudioManager.play('special');
            }
        }


        await doGravityFillRender();

    
        updateScore();

        matches = findAllMatches();
    }
}

function activateSpecial(candy, r, c) {
    const cleared = [];
    if (candy.special === 'striped-h') {
        
        for (let cc = 0; cc < game.cols; cc++) {
            if (game.board[r][cc] && game.board[r][cc].type !== 'blocker') {
                cleared.push({ r, c: cc });
            }
        }
        showLineClearEffect(r, null); 
    } else if (candy.special === 'striped-v') {
        
        for (let rr = 0; rr < game.rows; rr++) {
            if (game.board[rr][c] && game.board[rr][c].type !== 'blocker') {
                cleared.push({ r: rr, c });
            }
        }
        showLineClearEffect(null, c); 
    } else if (candy.special === 'wrapped') {

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < game.rows && nc >= 0 && nc < game.cols) {
                    if (game.board[nr][nc] && game.board[nr][nc].type !== 'blocker') {
                        cleared.push({ r: nr, c: nc });
                    }
                }
            }
        }
        showExplosionEffect(r, c); 
    } else if (candy.special === 'color-bomb') {
        
        const targetColor = candy._bombTargetColor || findBestBombColor(r, c);
        if (targetColor) {
            for (let rr = 0; rr < game.rows; rr++) {
                for (let cc = 0; cc < game.cols; cc++) {
                    if (game.board[rr][cc]?.color === targetColor && game.board[rr][cc].type !== 'blocker') {
                        cleared.push({ r: rr, c: cc });
                    }
                }
            }
            showColorBombEffect(targetColor);
            AudioManager.play('colorBomb');
        }
    }
    return cleared;
}


function findBestBombColor(r, c) {
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < game.rows && nc >= 0 && nc < game.cols) {
            const adj = game.board[nr][nc];
            if (adj && adj.color && adj.type !== 'blocker' && adj.special !== 'color-bomb') {
                return adj.color;
            }
        }
    }
    
    const counts = {};
    for (let rr = 0; rr < game.rows; rr++) {
        for (let cc = 0; cc < game.cols; cc++) {
            const clr = game.board[rr][cc]?.color;
            if (clr) counts[clr] = (counts[clr] || 0) + 1;
        }
    }
    let best = null, bestCount = 0;
    for (const [clr, cnt] of Object.entries(counts)) {
        if (cnt > bestCount) { best = clr; bestCount = cnt; }
    }
    return best;
}


function checkSpecialCombo(r1, c1, r2, c2) {
    const candy1 = game.board[r1][c1];
    const candy2 = game.board[r2][c2];
    if (!candy1?.special || !candy2?.special) return null;

    const s1 = candy1.special;
    const s2 = candy2.special;
    const comboCells = new Set();

    
    if (s1 === 'color-bomb' && s2 === 'color-bomb') {
        for (let r = 0; r < game.rows; r++) {
            for (let c = 0; c < game.cols; c++) {
                if (game.board[r][c] && game.board[r][c].type !== 'blocker') {
                    comboCells.add(`${r},${c}`);
                }
            }
        }
        showColorBombEffect(null); 
        AudioManager.play('special');
        return comboCells;
    }

    
    if (s1 === 'color-bomb' || s2 === 'color-bomb') {
        const bomb = s1 === 'color-bomb' ? candy1 : candy2;
        const other = s1 === 'color-bomb' ? candy2 : candy1;
        const targetColor = other.color;

        
        for (let r = 0; r < game.rows; r++) {
            for (let c = 0; c < game.cols; c++) {
                if (game.board[r][c]?.color === targetColor && game.board[r][c].type !== 'blocker') {
                    comboCells.add(`${r},${c}`);
                    
                    if (other.special && other.special !== 'color-bomb') {
                        const activated = activateSpecial({ special: other.special }, r, c);
                        activated.forEach(pos => comboCells.add(`${pos.r},${pos.c}`));
                    }
                }
            }
        }
        showColorBombEffect(targetColor);
        AudioManager.play('special');
        return comboCells;
    }

    if ((s1 === 'striped-h' || s1 === 'striped-v') && (s2 === 'striped-h' || s2 === 'striped-v')) {
        for (let cc = 0; cc < game.cols; cc++) {
            if (game.board[r1][cc]?.type !== 'blocker') comboCells.add(`${r1},${cc}`);
        }
        for (let rr = 0; rr < game.rows; rr++) {
            if (game.board[rr][c1]?.type !== 'blocker') comboCells.add(`${rr},${c1}`);
        }
        showLineClearEffect(r1, null);
        showLineClearEffect(null, c1);
        AudioManager.play('special');
        return comboCells;
    }

    
    if (s1 === 'wrapped' && s2 === 'wrapped') {
        for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
                const nr = r1 + dr;
                const nc = c1 + dc;
                if (nr >= 0 && nr < game.rows && nc >= 0 && nc < game.cols) {
                    if (game.board[nr][nc]?.type !== 'blocker') {
                        comboCells.add(`${nr},${nc}`);
                    }
                }
            }
        }
        showExplosionEffect(r1, c1, true);
        AudioManager.play('special');
        return comboCells;
    }

    
    if ((s1 === 'wrapped' && (s2 === 'striped-h' || s2 === 'striped-v')) ||
        (s2 === 'wrapped' && (s1 === 'striped-h' || s1 === 'striped-v'))) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let cc = 0; cc < game.cols; cc++) {
                const rr = r1 + dr;
                if (rr >= 0 && rr < game.rows && game.board[rr][cc]?.type !== 'blocker') {
                    comboCells.add(`${rr},${cc}`);
                }
            }
        }
        for (let dc = -1; dc <= 1; dc++) {
            for (let rr = 0; rr < game.rows; rr++) {
                const cc = c1 + dc;
                if (cc >= 0 && cc < game.cols && game.board[rr][cc]?.type !== 'blocker') {
                    comboCells.add(`${rr},${cc}`);
                }
            }
        }
        showLineClearEffect(r1, null);
        showLineClearEffect(null, c1);
        showExplosionEffect(r1, c1);
        AudioManager.play('special');
        return comboCells;
    }

    return null; 
}


function showLineClearEffect(row, col) {
    const boardRect = boardEl.getBoundingClientRect();
    const cellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--candy-size'));
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-gap'));
    const padding = 10; 

    const line = document.createElement('div');
    line.className = 'line-clear-effect';

    if (row !== null) {
        
        line.classList.add('horizontal');
        line.style.top = `${padding + row * (cellSize + gap) + cellSize / 2}px`;
        line.style.left = `${padding}px`;
        line.style.width = `${game.cols * (cellSize + gap) - gap}px`;
    } else if (col !== null) {
        
        line.classList.add('vertical');
        line.style.left = `${padding + col * (cellSize + gap) + cellSize / 2}px`;
        line.style.top = `${padding}px`;
        line.style.height = `${game.rows * (cellSize + gap) - gap}px`;
    }

    boardEl.appendChild(line);
    setTimeout(() => line.remove(), 600);
}

function showExplosionEffect(row, col, big = false) {
    const cellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--candy-size'));
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-gap'));
    const padding = 10;

    const explosion = document.createElement('div');
    explosion.className = 'explosion-effect' + (big ? ' big' : '');
    explosion.style.left = `${padding + col * (cellSize + gap) + cellSize / 2}px`;
    explosion.style.top = `${padding + row * (cellSize + gap) + cellSize / 2}px`;

    boardEl.appendChild(explosion);
    setTimeout(() => explosion.remove(), 700);

    
    const count = big ? 16 : 10;
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const dist = big ? 80 : 50;
        const p = document.createElement('div');
        p.className = 'explosion-particle';
        p.style.left = explosion.style.left;
        p.style.top = explosion.style.top;
        p.style.setProperty('--px', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--py', `${Math.sin(angle) * dist}px`);
        boardEl.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }
}

function showColorBombEffect(targetColor) {
    const colors = {
        Red: '#ef4444', Blue: '#3b82f6', Green: '#22c55e',
        Yellow: '#facc15', Orange: '#f97316', Purple: '#a855f7'
    };

    
    const flash = document.createElement('div');
    flash.className = 'color-bomb-flash';
    if (targetColor && colors[targetColor]) {
        flash.style.background = `radial-gradient(circle, ${colors[targetColor]}88, transparent 70%)`;
    } else {
        
        flash.style.background = 'radial-gradient(circle, rgba(255,215,0,0.6), transparent 70%)';
    }
    boardEl.appendChild(flash);
    setTimeout(() => flash.remove(), 800);

    
    const boardRect = boardEl.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'color-bomb-particle';
        const color = targetColor ? colors[targetColor] : '#ffd700';
        p.style.background = color || '#ffd700';
        p.style.left = `${Math.random() * boardRect.width}px`;
        p.style.top = `${Math.random() * boardRect.height}px`;
        p.style.setProperty('--px', `${(Math.random() - 0.5) * 100}px`);
        p.style.setProperty('--py', `${(Math.random() - 0.5) * 100}px`);
        boardEl.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }


    boardEl.classList.add('board-shake');
    setTimeout(() => boardEl.classList.remove('board-shake'), 400);
}

function checkAdjacentBlockers(r, c) {
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < game.rows && nc >= 0 && nc < game.cols) {
            if (game.board[nr][nc]?.type === 'blocker') {
                game.board[nr][nc] = null;
            }
        }
    }
}

function applyGravity() {
    for (let c = 0; c < game.cols; c++) {
        let writeRow = game.rows - 1;
        for (let r = game.rows - 1; r >= 0; r--) {
            if (game.board[r][c] && game.board[r][c].type === 'blocker') {
                
                if (writeRow !== r) {
                    
                }
                writeRow = r - 1;
                continue;
            }
            if (game.board[r][c]) {
                if (writeRow !== r) {
                    game.board[writeRow][c] = game.board[r][c];
                    game.board[r][c] = null;
                }
                writeRow--;
            }
        }
    }
}

function fillEmpty() {
    for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.cols; c++) {
            if (!game.board[r][c]) {
                game.board[r][c] = createCandy(r, c);
            }
        }
    }
}


async function animateMatches(matches, score) {
    
    const midR = matches.reduce((s, m) => s + m.r, 0) / matches.length;
    const midC = matches.reduce((s, m) => s + m.c, 0) / matches.length;

    matches.forEach(m => {
        const idx = m.r * game.cols + m.c;
        const cell = boardEl.children[idx];
        if (cell) {
            cell.classList.add('match-pop');
            spawnParticles(cell, game.board[m.r]?.[m.c]?.color);
        }
    });

    
    showScorePopup(midR, midC, `+${score}`, score > 100);

    
    if (matches.length >= 5 || game.combo >= 3) {
        boardEl.classList.add('board-shake');
        AudioManager.play('bigMatch');
        setTimeout(() => boardEl.classList.remove('board-shake'), 350);
    } else {
        AudioManager.play('match');
    }

    await sleep(400);
}

async function animateFall() {
    boardEl.querySelectorAll('.candy-cell').forEach(cell => {
        cell.classList.add('candy-fall');
    });
    await sleep(350);
    boardEl.querySelectorAll('.candy-cell').forEach(cell => {
        cell.classList.remove('candy-fall');
    });
}

// Smooth gravity: only animates newly-spawned cells, no full board rebuild
async function doGravityFillRender() {
    applyGravity();
    // Collect positions that are empty (will receive new candies)
    const newCells = [];
    for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.cols; c++) {
            if (!game.board[r][c]) newCells.push({ r, c });
        }
    }
    fillEmpty();
    // Update each cell without nuking the whole board DOM
    for (let r = 0; r < game.rows; r++)
        for (let c = 0; c < game.cols; c++)
            updateCellVisual(r, c);
    // Animate only the new cells (fall from above)
    newCells.forEach(({ r, c }) => {
        const idx = r * game.cols + c;
        const cell = boardEl.children[idx];
        if (cell) cell.classList.add('candy-fall');
    });
    await sleep(420);
    newCells.forEach(({ r, c }) => {
        const idx = r * game.cols + c;
        const cell = boardEl.children[idx];
        if (cell) cell.classList.remove('candy-fall');
    });
}

function showScorePopup(r, c, text, big = false) {
    const popup = document.createElement('div');
    popup.className = 'score-popup' + (big ? ' big' : '');
    popup.textContent = text;
    const cellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--candy-size'));
    const gap = 3;
    popup.style.left = `${c * (cellSize + gap) + cellSize / 2}px`;
    popup.style.top = `${r * (cellSize + gap)}px`;
    scorePopups.appendChild(popup);
    setTimeout(() => popup.remove(), 1200);
}

function spawnParticles(cell, color) {
    const colors = {
        Red: '#ef4444', Blue: '#3b82f6', Green: '#22c55e',
        Yellow: '#facc15', Orange: '#f97316', Purple: '#a855f7'
    };
    const c = colors[color] || '#fff';

    for (let i = 0; i < 6; i++) {
        const p = document.createElement('div');
        p.className = 'match-particle';
        p.style.background = c;
        p.style.setProperty('--px', `${(Math.random() - 0.5) * 60}px`);
        p.style.setProperty('--py', `${(Math.random() - 0.5) * 60}px`);
        const rect = cell.getBoundingClientRect();
        const boardRect = boardEl.getBoundingClientRect();
        p.style.left = `${rect.left - boardRect.left + rect.width / 2}px`;
        p.style.top = `${rect.top - boardRect.top + rect.height / 2}px`;
        scorePopups.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }
}


function showCombo(count) {
    comboDisplay.classList.remove('hidden');
    const labels = ['', '', 'SWEET!', 'DELICIOUS!', 'SUGAR RUSH!', 'DIVINE!', 'TASTY!'];
    const label = labels[Math.min(count, labels.length - 1)] || 'INCREDIBLE!';
    comboText.textContent = `${label} x${count}`;
    comboText.style.animation = 'none';
    void comboText.offsetWidth;
    comboText.style.animation = 'comboFlash 1s ease forwards';
    setTimeout(() => comboDisplay.classList.add('hidden'), 1200);
}


function updateScore() {
    animateScoreCount(parseInt(scoreEl.textContent.replace(/,/g, '')), game.score, scoreEl);

    const pct = Math.min(100, (game.score / game.target) * 100);
    progressFill.style.width = `${pct}%`;

    const ld = game.levelData;
    if (pct >= ld.star1 * 100 && !$('pstar1').classList.contains('earned')) {
        $('pstar1').classList.add('earned');
        AudioManager.play('star');
    }
    if (pct >= ld.star2 * 100 && !$('pstar2').classList.contains('earned')) {
        $('pstar2').classList.add('earned');
        AudioManager.play('star');
    }
    if (pct >= ld.star3 * 100 && !$('pstar3').classList.contains('earned')) {
        $('pstar3').classList.add('earned');
        AudioManager.play('star');
    }
}

function animateScoreCount(from, to, el) {
    const diff = to - from;
    if (diff <= 0) { el.textContent = to.toLocaleString(); return; }
    const steps = 20;
    const inc = Math.ceil(diff / steps);
    let current = from;
    const interval = setInterval(() => {
        current += inc;
        if (current >= to) {
            current = to;
            clearInterval(interval);
        }
        el.textContent = current.toLocaleString();
    }, 30);
}

function updateMovesStyle() {
    const movesBlock = document.querySelector('.moves-block');
    if (game.moves <= 5) {
        movesBlock.classList.add('low-moves');
    } else {
        movesBlock.classList.remove('low-moves');
    }
}


function scheduleHint() {
    clearHint();
    game.hintTimeout = setTimeout(() => showHint(), 5000);
}

function clearHint() {
    if (game.hintTimeout) {
        clearTimeout(game.hintTimeout);
        game.hintTimeout = null;
    }
    boardEl.querySelectorAll('.hint-cell').forEach(el => el.classList.remove('hint-cell'));
}

function showHint() {
    const move = findValidMove();
    if (!move) return;

    [move.from, move.to].forEach(pos => {
        const idx = pos.r * game.cols + pos.c;
        if (boardEl.children[idx]) {
            boardEl.children[idx].classList.add('hint-cell');
        }
    });
    AudioManager.play('hint');
}

function findValidMove() {
    for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.cols; c++) {
            if (game.board[r][c]?.type === 'blocker') continue;
            const isColorBomb = game.board[r][c]?.special === 'color-bomb';

            
            if (c + 1 < game.cols && game.board[r][c + 1]?.type !== 'blocker') {
            
                if (isColorBomb || game.board[r][c + 1]?.special === 'color-bomb') {
                    return { from: { r, c }, to: { r, c: c + 1 } };
                }
                swap(r, c, r, c + 1);
                const m = findAllMatches();
                swap(r, c, r, c + 1);
                if (m.length > 0) return { from: { r, c }, to: { r, c: c + 1 } };
            }
            
            if (r + 1 < game.rows && game.board[r + 1][c]?.type !== 'blocker') {
                if (isColorBomb || game.board[r + 1]?.[c]?.special === 'color-bomb') {
                    return { from: { r, c }, to: { r: r + 1, c } };
                }
                swap(r, c, r + 1, c);
                const m = findAllMatches();
                swap(r, c, r + 1, c);
                if (m.length > 0) return { from: { r, c }, to: { r: r + 1, c } };
            }
        }
    }
    return null;
}

function hasValidMoves() {
    return !!findValidMove();
}


function shuffleBoard() {
    AudioManager.play('shuffle');
    const candies = [];
    for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.cols; c++) {
            if (game.board[r][c]?.type !== 'blocker') {
                candies.push(game.board[r][c]);
            }
        }
    }

    
    for (let i = candies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candies[i], candies[j]] = [candies[j], candies[i]];
    }

    let idx = 0;
    for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.cols; c++) {
            if (game.board[r][c]?.type !== 'blocker') {
                game.board[r][c] = candies[idx++];
            }
        }
    }

    
    let hasMatches = true;
    let safety = 0;
    while (hasMatches && safety < 50) {
        hasMatches = false;
        for (let r = 0; r < game.rows; r++) {
            for (let c = 0; c < game.cols; c++) {
                if (game.board[r][c]?.type === 'blocker') continue;
                if (c >= 2 &&
                    game.board[r][c]?.color === game.board[r][c-1]?.color &&
                    game.board[r][c]?.color === game.board[r][c-2]?.color) {
                    game.board[r][c] = createCandy(r, c);
                    hasMatches = true;
                }
                if (r >= 2 &&
                    game.board[r][c]?.color === game.board[r-1]?.[c]?.color &&
                    game.board[r][c]?.color === game.board[r-2]?.[c]?.color) {
                    game.board[r][c] = createCandy(r, c);
                    hasMatches = true;
                }
            }
        }
        safety++;
    }

    renderBoard();

    if (!hasValidMoves()) {
        shuffleBoard();
    }
}


function winLevel() {
    clearHint();
    AudioManager.play('victory');

    const pct = game.score / game.target;
    const ld = game.levelData;
    let stars = 0;
    if (pct >= ld.star1) stars = 1;
    if (pct >= ld.star2) stars = 2;
    if (pct >= ld.star3) stars = 3;

    game.starsEarned = stars;

    const prevStars = savedData.levelStars[game.level] || 0;
    savedData.levelStars[game.level] = Math.max(prevStars, stars);
    const prevBest = savedData.bestScores[game.level] || 0;
    const isNewBest = game.score > prevBest;
    savedData.bestScores[game.level] = Math.max(prevBest, game.score);
    if (game.level >= savedData.unlockedLevel && game.level < LEVELS.length) {
        savedData.unlockedLevel = game.level + 1;
    }
    savedData.profile.levelsWon = (savedData.profile.levelsWon || 0) + 1;
    savedData.profile.gamesPlayed = (savedData.profile.gamesPlayed || 0) + 1;
    saveData();

    
    const nhBanner = $('new-highscore-banner');
    if (nhBanner) {
        if (isNewBest && prevBest > 0) {
            nhBanner.classList.remove('hidden');
        } else {
            nhBanner.classList.add('hidden');
        }
    }

    
    $('victory-score').textContent = game.score.toLocaleString();
    $('victory-moves').textContent = game.moves;
    $('victory-combo').textContent = `x${game.maxCombo}`;

    const bestNow = savedData.bestScores[game.level] || game.score;
    let vBestRow = document.querySelector('.v-best-row');
    if (!vBestRow) {
        vBestRow = document.createElement('div');
        vBestRow.className = 'v-best-row';
        const statsEl = document.querySelector('.victory-stats');
        if (statsEl) statsEl.before(vBestRow);
    }
    vBestRow.innerHTML = `Best on this level: <strong>${bestNow.toLocaleString()}</strong>`;

    const starsRow = $('victory-stars');
    const vStars = starsRow.querySelectorAll('.v-star');
    vStars.forEach((s, i) => {
        s.classList.toggle('earned', i < stars);
        s.style.animation = i < stars ? `starPop 0.5s ease forwards ${0.3 + i * 0.3}s` : 'none';
        s.style.opacity = i < stars ? '' : '0.3';
    });

    
    const nextBtn = $('next-level-btn');
    if (game.level >= LEVELS.length) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
    }

    victoryScreen.classList.remove('hidden');
    startConfetti();
}

function loseLevel() {
    clearHint();
    AudioManager.play('gameOver');
    savedData.profile.gamesPlayed = (savedData.profile.gamesPlayed || 0) + 1;
    saveData();
    $('go-score').textContent = game.score.toLocaleString();
    $('go-target').textContent = game.target.toLocaleString();
    gameoverScreen.classList.remove('hidden');
}


let confettiAnimFrame = null;

function startConfetti() {
    const canvas = $('confetti-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#ff6b9d', '#4ecdc4', '#ffb347', '#a855f7', '#3b82f6', '#22c55e', '#ef4444', '#facc15', '#f97316'];

    for (let i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 8 + 4,
            h: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.2,
            opacity: 1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.rotSpeed;
            p.vy += 0.04;
            if (p.y > canvas.height) p.opacity -= 0.02;
            if (p.opacity <= 0) return;
            alive = true;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        if (alive) {
            confettiAnimFrame = requestAnimationFrame(draw);
        }
    }

    if (confettiAnimFrame) cancelAnimationFrame(confettiAnimFrame);
    draw();
}

function stopConfetti() {
    if (confettiAnimFrame) {
        cancelAnimationFrame(confettiAnimFrame);
        confettiAnimFrame = null;
    }
    const canvas = $('confetti-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

     
function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
} 

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}  


document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderProfile();   
    renderCoins();

    // Background music (disabled)
    /*
    const bgMusic = document.getElementById('bg-music');
    let musicOn = true;
    const mBtn = $('music-toggle-btn');
    const startBgMusic = () => {
        if (bgMusic && musicOn) { bgMusic.volume = 0.35; bgMusic.play().catch(() => {}); }
    };
    document.addEventListener('pointerdown', startBgMusic, { once: true });
    if (mBtn) {
        mBtn.addEventListener('click', () => {
            musicOn = !musicOn;
            if (musicOn) { bgMusic?.play().catch(() => {}); mBtn.textContent = '\uD83C\uDFB5'; }
            else { bgMusic?.pause(); mBtn.textContent = '\uD83D\uDD07'; }
        });
    }
    */

    // Profile buttons
    $('profile-open-btn').addEventListener('click', openProfile);
    $('level-profile-btn').addEventListener('click', openProfile);
    $('profile-close-btn').addEventListener('click', closeProfile);
    $('profile-save-btn').addEventListener('click', saveProfile);
    $('profile-screen').addEventListener('click', e => {
        if (e.target === $('profile-screen')) closeProfile();
    });
    document.querySelectorAll('.av-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.av-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            $('avatar-display').textContent = btn.dataset.av;
        });
    });

    // Shop buttons
    ['start-shop-btn','level-shop-btn','game-shop-btn'].forEach(id => {
        const el = $(id);
        if (el) el.addEventListener('click', openShop);
    });
    $('shop-close-btn').addEventListener('click', closeShop);
    $('shop-screen').addEventListener('click', e => { if (e.target === $('shop-screen')) closeShop(); });
    document.querySelectorAll('.shop-buy-btn').forEach(btn => {
        btn.addEventListener('click', () => buyItem(btn.dataset.item, parseInt(btn.dataset.cost)));
    });

    // Powerup buttons
    document.querySelectorAll('.pu-btn').forEach(btn => {
        btn.addEventListener('click', () => usePowerup(btn.dataset.pu));
    });

    $('start-btn').addEventListener('click', goToLevels);

    
    document.querySelectorAll('.level-card.unlocked .level-play-btn, .level-card .level-play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.level-card');
            if (card.classList.contains('locked')) return;
            const levelNum = parseInt(card.dataset.level);
            startLevel(levelNum);
        });
    });

    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('locked')) return;
            const levelNum = parseInt(card.dataset.level);
            startLevel(levelNum);
        });
    });

    
    $('game-back-btn').addEventListener('click', () => {
        clearHint();
        if (game.swapMode) exitSwapMode();
        goToLevels();
    });

    
    $('hint-btn').addEventListener('click', () => {
        if (game.isAnimating) return;
        clearHint();
        showHint();
    });

    $('shuffle-btn').addEventListener('click', () => {
        if (game.isAnimating) return;
        if (game.swapMode) {
            exitSwapMode();
            return;
        }
        if (game.moves <= 1) {
            showToast('Not enough moves to swap!', 'error');
            return;
        }
        enterSwapMode();
    });


    $('next-level-btn').addEventListener('click', () => {
        stopConfetti();
        victoryScreen.classList.add('hidden');
        const nextLv = game.level + 1;
        if (nextLv <= LEVELS.length) {
            startLevel(nextLv);
        } else {
            showToast('You completed all levels! 🎉', 'success');
            goToLevels();
        }
    });

    $('replay-btn').addEventListener('click', () => {
        stopConfetti();
        victoryScreen.classList.add('hidden');
        startLevel(game.level);
    });

    $('victory-menu-btn').addEventListener('click', () => {
        stopConfetti();
        victoryScreen.classList.add('hidden');
        goToLevels();
    });

    
    $('retry-btn').addEventListener('click', () => {
        gameoverScreen.classList.add('hidden');
        startLevel(game.level);
    });

    $('go-menu-btn').addEventListener('click', () => {
        gameoverScreen.classList.add('hidden');
        goToLevels();
    });

    
    window.addEventListener('resize', () => {
        const canvas = $('confetti-canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});
