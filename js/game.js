const Game = {
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
    
    init(levelNum) {
        const levelData = LEVELS.find(l => l.id === levelNum);
        if (!levelData) return false;
        
        this.levelData = levelData;
        this.rows = levelData.rows;
        this.cols = levelData.cols;
        this.target = levelData.target;
        this.moves = levelData.moves;
        this.level = levelNum;
        this.colors = levelData.colors;
        this.specialsEnabled = levelData.specialsEnabled;
        
        this.selected = null;
        this.score = 0;
        this.isAnimating = false;
        this.combo = 0;
        this.maxCombo = 0;
        this.dragStart = null;
        this.isDragging = false;
        this.dragGhost = null;
        this.swapMode = false;
        this.swapFirst = null;
        
        Board.init(this);
        return true;
    },
    
    initBoard() {
        this.board = [];
        for (let r = 0; r < this.rows; r++) {
            this.board[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.board[r][c] = Utils.createCandy(this.colors);
            }
        }

        if (this.levelData.blockers > 0) {
            let placed = 0;
            const maxAttempts = 200;
            let attempts = 0;
            while (placed < this.levelData.blockers && attempts < maxAttempts) {
                const r = Math.floor(Math.random() * this.rows);
                const c = Math.floor(Math.random() * this.cols);
                if (this.board[r][c].type !== 'blocker') {
                    this.board[r][c] = { type: 'blocker', color: null, special: null, img: 'images/Choco.png' };
                    placed++;
                }
                attempts++;
            }
        }

        this.removeInitialMatches();
    },
    
    removeInitialMatches() {
        let hasMatches = true;
        let safety = 0;
        while (hasMatches && safety < 50) {
            hasMatches = false;
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (this.board[r][c].type === 'blocker') continue;
                    
                    if (c >= 2 &&
                        this.board[r][c].color === this.board[r][c-1].color &&
                        this.board[r][c].color === this.board[r][c-2].color) {
                        this.board[r][c] = Utils.createCandy(this.colors);
                        hasMatches = true;
                    }
                    
                    if (r >= 2 &&
                        this.board[r][c].color === this.board[r-1][c].color &&
                        this.board[r][c].color === this.board[r-2][c].color) {
                        this.board[r][c] = Utils.createCandy(this.colors);
                        hasMatches = true;
                    }
                }
            }
            safety++;
        }
    },
    
    async trySwap(r1, c1, r2, c2) {
        this.isAnimating = true;
        this.selected = null;

        AudioManager.play('swap');

        const candy1 = this.board[r1][c1];
        const candy2 = this.board[r2][c2];
        const isColorBombSwap = candy1?.special === 'color-bomb' || candy2?.special === 'color-bomb';

        if (isColorBombSwap) {
            if (candy1?.special === 'color-bomb' && candy2?.color) {
                candy1._bombTargetColor = candy2.color;
            }
            if (candy2?.special === 'color-bomb' && candy1?.color) {
                candy2._bombTargetColor = candy1.color;
            }
        }

        const specialCombo = this.checkSpecialCombo(r1, c1, r2, c2);
        Board.swap(r1, c1, r2, c2);
        
        await Animations.animateSwap(r1, c1, r2, c2);

        if (specialCombo && specialCombo.size > 0) {
            await this.handleSpecialCombo(specialCombo);
            this.isAnimating = false;
            return true;
        }

        if (isColorBombSwap) {
            await this.handleColorBombSwap(candy1, candy2, r1, c1, r2, c2);
            this.isAnimating = false;
            return true;
        }

        const matches = Board.findAllMatches();
        if (matches.length === 0) {
            AudioManager.play('noMatch');
            Board.swap(r1, c1, r2, c2);
            await Animations.animateSwap(r1, c1, r2, c2);
            this.isAnimating = false;
            return false;
        }

        this.moves--;
        this.combo = 0;
        await this.processBoardCascade();
        this.isAnimating = false;

        this.checkPostMoveState();
        return true;
    },
    
    async processBoardCascade() {
        let matches = Board.findAllMatches();
        while (matches.length > 0) {
            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;

            if (this.combo >= 2) {
                Animations.showCombo(this.combo);
                AudioManager.play('combo');
            }

            const shapes = Board.findMatchShapes();
            const specialsToCreate = [];

            if (this.specialsEnabled) {
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

            const activateSpecialsInList = (matchList) => {
                for (const m of matchList) {
                    const key = `${m.r},${m.c}`;
                    if (processedSpecials.has(key)) continue;
                    const candy = this.board[m.r][m.c];
                    if (candy && candy.special) {
                        processedSpecials.add(key);
                        const cleared = this.activateSpecial(candy, m.r, m.c);
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
            };
            
            activateSpecialsInList(matches);

            extraClears.forEach(key => {
                const [r, c] = key.split(',').map(Number);
                if (!matches.find(m => m.r === r && m.c === c)) {
                    matches.push({ r, c });
                }
            });

            const baseScore = matches.length * 20;
            const comboBonus = this.combo > 1 ? Math.floor(baseScore * (this.combo - 1) * 0.5) : 0;
            const totalScore = baseScore + comboBonus;
            this.score += totalScore;

            await Animations.animateMatches(matches, totalScore);

            for (const m of matches) {
                if (this.board[m.r][m.c]?.type !== 'blocker') {
                    Board.checkAdjacentBlockers(m.r, m.c);
                    this.board[m.r][m.c] = null;
                }
            }

            for (const sp of specialsToCreate) {
                if (!this.board[sp.r][sp.c]) {
                    this.board[sp.r][sp.c] = {
                        type: 'candy',
                        color: sp.special === 'color-bomb' ? null : sp.color,
                        special: sp.special,
                        img: sp.special === 'color-bomb' ? 'images/Choco.png' : `images/${sp.color}.png`
                    };
                    AudioManager.play('special');
                }
            }

            await this.doGravityFillRender();
            UI.updateGameUI(this);

            matches = Board.findAllMatches();
        }
    },
    
    async doGravityFillRender() {
        Board.applyGravity();
        
        const newCells = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!this.board[r][c]) newCells.push({ r, c });
            }
        }
        
        Board.fillEmpty();
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                UI.updateCellVisual(r, c, this);
            }
        }
        
        await Animations.animateFall(newCells);
    },
    
    activateSpecial(candy, r, c) {
        const cleared = [];
        
        if (candy.special === 'striped-h') {
            for (let cc = 0; cc < this.cols; cc++) {
                if (this.board[r][cc] && this.board[r][cc].type !== 'blocker') {
                    cleared.push({ r, c: cc });
                }
            }
            Animations.showLineClearEffect(r, null);
        } else if (candy.special === 'striped-v') {
            for (let rr = 0; rr < this.rows; rr++) {
                if (this.board[rr][c] && this.board[rr][c].type !== 'blocker') {
                    cleared.push({ r: rr, c });
                }
            }
            Animations.showLineClearEffect(null, c);
        } else if (candy.special === 'wrapped') {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                        if (this.board[nr][nc] && this.board[nr][nc].type !== 'blocker') {
                            cleared.push({ r: nr, c: nc });
                        }
                    }
                }
            }
            Animations.showExplosionEffect(r, c);
        } else if (candy.special === 'color-bomb') {
            const targetColor = candy._bombTargetColor || Utils.findBestBombColor(this.board, r, c);
            if (targetColor) {
                for (let rr = 0; rr < this.rows; rr++) {
                    for (let cc = 0; cc < this.cols; cc++) {
                        if (this.board[rr][cc]?.color === targetColor && this.board[rr][cc].type !== 'blocker') {
                            cleared.push({ r: rr, c: cc });
                        }
                    }
                }
                Animations.showColorBombEffect(targetColor);
                AudioManager.play('colorBomb');
            }
        }
        return cleared;
    },
    
    checkSpecialCombo(r1, c1, r2, c2) {
        const candy1 = this.board[r1][c1];
        const candy2 = this.board[r2][c2];
        if (!candy1?.special || !candy2?.special) return null;

        const s1 = candy1.special;
        const s2 = candy2.special;
        const comboCells = new Set();

        if (s1 === 'color-bomb' && s2 === 'color-bomb') {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (this.board[r][c] && this.board[r][c].type !== 'blocker') {
                        comboCells.add(`${r},${c}`);
                    }
                }
            }
            Animations.showColorBombEffect(null);
            AudioManager.play('special');
            return comboCells;
        }

        if (s1 === 'color-bomb' || s2 === 'color-bomb') {
            const bomb = s1 === 'color-bomb' ? candy1 : candy2;
            const other = s1 === 'color-bomb' ? candy2 : candy1;
            const targetColor = other.color;

            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (this.board[r][c]?.color === targetColor && this.board[r][c].type !== 'blocker') {
                        comboCells.add(`${r},${c}`);
                        if (other.special && other.special !== 'color-bomb') {
                            const activated = this.activateSpecial({ special: other.special }, r, c);
                            activated.forEach(pos => comboCells.add(`${pos.r},${pos.c}`));
                        }
                    }
                }
            }
            Animations.showColorBombEffect(targetColor);
            AudioManager.play('special');
            return comboCells;
        }

        if ((s1 === 'striped-h' || s1 === 'striped-v') && (s2 === 'striped-h' || s2 === 'striped-v')) {
            for (let cc = 0; cc < this.cols; cc++) {
                if (this.board[r1][cc]?.type !== 'blocker') comboCells.add(`${r1},${cc}`);
            }
            for (let rr = 0; rr < this.rows; rr++) {
                if (this.board[rr][c1]?.type !== 'blocker') comboCells.add(`${rr},${c1}`);
            }
            Animations.showLineClearEffect(r1, null);
            Animations.showLineClearEffect(null, c1);
            AudioManager.play('special');
            return comboCells;
        }

        if (s1 === 'wrapped' && s2 === 'wrapped') {
            for (let dr = -2; dr <= 2; dr++) {
                for (let dc = -2; dc <= 2; dc++) {
                    const nr = r1 + dr;
                    const nc = c1 + dc;
                    if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                        if (this.board[nr][nc]?.type !== 'blocker') {
                            comboCells.add(`${nr},${nc}`);
                        }
                    }
                }
            }
            Animations.showExplosionEffect(r1, c1, true);
            AudioManager.play('special');
            return comboCells;
        }

        if ((s1 === 'wrapped' && (s2 === 'striped-h' || s2 === 'striped-v')) ||
            (s2 === 'wrapped' && (s1 === 'striped-h' || s1 === 'striped-v'))) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let cc = 0; cc < this.cols; cc++) {
                    const rr = r1 + dr;
                    if (rr >= 0 && rr < this.rows && this.board[rr][cc]?.type !== 'blocker') {
                        comboCells.add(`${rr},${cc}`);
                    }
                }
            }
            for (let dc = -1; dc <= 1; dc++) {
                for (let rr = 0; rr < this.rows; rr++) {
                    const cc = c1 + dc;
                    if (cc >= 0 && cc < this.cols && this.board[rr][cc]?.type !== 'blocker') {
                        comboCells.add(`${rr},${cc}`);
                    }
                }
            }
            Animations.showLineClearEffect(r1, null);
            Animations.showLineClearEffect(null, c1);
            Animations.showExplosionEffect(r1, c1);
            AudioManager.play('special');
            return comboCells;
        }

        return null;
    },
    
    async handleSpecialCombo(comboCells) {
        this.moves--;
        this.combo = 0;

        const comboMatches = [...comboCells].map(k => {
            const [r, c] = k.split(',').map(Number);
            return { r, c };
        });

        const totalScore = comboMatches.length * 40;
        this.score += totalScore;

        await Animations.animateMatches(comboMatches, totalScore);

        for (const m of comboMatches) {
            if (this.board[m.r]?.[m.c]?.type !== 'blocker') {
                Board.checkAdjacentBlockers(m.r, m.c);
                this.board[m.r][m.c] = null;
            }
        }

        await this.doGravityFillRender();
        UI.updateGameUI(this);
        await this.processBoardCascade();
    },
    
    async handleColorBombSwap(candy1, candy2, r1, c1, r2, c2) {
        this.moves--;
        this.combo = 0;

        const bombCandy = candy1?.special === 'color-bomb' ? candy1 : candy2;
        const partnerCandy = candy1?.special === 'color-bomb' ? candy2 : candy1;
        const bombPos = candy1?.special === 'color-bomb' ? { r: r2, c: c2 } : { r: r1, c: c1 };
        const targetColor = partnerCandy?.color;

        if (targetColor) {
            const bombClears = [];
            for (let rr = 0; rr < this.rows; rr++) {
                for (let cc = 0; cc < this.cols; cc++) {
                    if (this.board[rr][cc]?.color === targetColor && this.board[rr][cc].type !== 'blocker') {
                        bombClears.push({ r: rr, c: cc });
                    }
                }
            }
            if (!bombClears.find(m => m.r === bombPos.r && m.c === bombPos.c)) {
                bombClears.push(bombPos);
            }

            Animations.showColorBombEffect(targetColor);
            AudioManager.play('colorBomb');

            const totalScore = bombClears.length * 30;
            this.score += totalScore;

            await Animations.animateMatches(bombClears, totalScore);

            for (const m of bombClears) {
                if (this.board[m.r]?.[m.c]?.type !== 'blocker') {
                    Board.checkAdjacentBlockers(m.r, m.c);
                    this.board[m.r][m.c] = null;
                }
            }

            await this.doGravityFillRender();
            UI.updateGameUI(this);
            await this.processBoardCascade();
        }
    },
    
    checkPostMoveState() {
        if (this.moves <= 0) {
            this.checkWinLoseState();
            return;
        }

        if (!Board.hasValidMoves()) {
            Utils.showToast('No moves left! Use Shuffle.', 'warning');
        }
    },
    
    checkWinLoseState() {
        if (this.moves <= 0) {
            if (this.score >= Math.ceil(this.levelData.star1 * this.target)) {
                this.winLevel();
            } else {
                this.loseLevel();
            }
        }
    },
    
    winLevel() {
        clearTimeout(this.hintTimeout);
        AudioManager.play('victory');

        const pct = this.score / this.target;
        const ld = this.levelData;
        let stars = 0;
        if (pct >= ld.star1) stars = 1;
        if (pct >= ld.star2) stars = 2;
        if (pct >= ld.star3) stars = 3;

        this.starsEarned = stars;
        Storage.updateLevelProgress(this.level, this.score, stars);

        UI.showVictoryScreen(this);
    },
    
    loseLevel() {
        clearTimeout(this.hintTimeout);
        AudioManager.play('gameOver');
        Storage.savedData.profile.gamesPlayed = (Storage.savedData.profile.gamesPlayed || 0) + 1;
        Storage.save();
        UI.showGameOverScreen(this);
    },
    
    shuffleBoard() {
        AudioManager.play('shuffle');
        
        const candies = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c]?.type !== 'blocker') {
                    candies.push(this.board[r][c]);
                }
            }
        }

        for (let i = candies.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candies[i], candies[j]] = [candies[j], candies[i]];
        }

        let idx = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c]?.type !== 'blocker') {
                    this.board[r][c] = candies[idx++];
                }
            }
        }

        this.removeInitialMatches();
        UI.renderBoard(this);

        if (!Board.hasValidMoves()) {
            this.shuffleBoard();
        }
    }
};