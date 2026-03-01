const Animations = {
    boardEl: null,
    game: null,
    
    init(boardElement, gameInstance) {
        this.boardEl = boardElement;
        this.game = gameInstance;
    },
    
    async animateSwap(r1, c1, r2, c2) {
        const idx1 = r1 * this.game.cols + c1;
        const idx2 = r2 * this.game.cols + c2;
        const cell1 = this.boardEl.children[idx1];
        const cell2 = this.boardEl.children[idx2];

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

            await Utils.sleep(260);

            cell1.style.transition = '';
            cell1.style.transform = '';
            cell1.style.zIndex = '';
            cell2.style.transition = '';
            cell2.style.transform = '';
        }
    },
    
    async animateMatches(matches, score) {
        const midR = matches.reduce((s, m) => s + m.r, 0) / matches.length;
        const midC = matches.reduce((s, m) => s + m.c, 0) / matches.length;

        matches.forEach(m => {
            const idx = m.r * this.game.cols + m.c;
            const cell = this.boardEl.children[idx];
            if (cell) {
                cell.classList.add('match-pop');
                this.spawnParticles(cell, this.game.board[m.r]?.[m.c]?.color);
            }
        });

        UI.showScorePopup(midR, midC, `+${score}`, score > 100);

        if (matches.length >= 5 || this.game.combo >= 3) {
            this.boardEl.classList.add('board-shake');
            AudioManager.play('bigMatch');
            setTimeout(() => this.boardEl.classList.remove('board-shake'), 350);
        } else {
            AudioManager.play('match');
        }

        await Utils.sleep(400);
    },
    
    async animateFall(newCells) {
        newCells.forEach(({ r, c }) => {
            const idx = r * this.game.cols + c;
            const cell = this.boardEl.children[idx];
            if (cell) cell.classList.add('candy-fall');
        });
        
        await Utils.sleep(420);
        
        newCells.forEach(({ r, c }) => {
            const idx = r * this.game.cols + c;
            const cell = this.boardEl.children[idx];
            if (cell) cell.classList.remove('candy-fall');
        });
    },
    
    spawnParticles(cell, color) {
        const c = COLOR_MAP[color] || '#fff';

        for (let i = 0; i < 6; i++) {
            const p = document.createElement('div');
            p.className = 'match-particle';
            p.style.background = c;
            p.style.setProperty('--px', `${(Math.random() - 0.5) * 60}px`);
            p.style.setProperty('--py', `${(Math.random() - 0.5) * 60}px`);
            
            const rect = cell.getBoundingClientRect();
            const boardRect = this.boardEl.getBoundingClientRect();
            p.style.left = `${rect.left - boardRect.left + rect.width / 2}px`;
            p.style.top = `${rect.top - boardRect.top + rect.height / 2}px`;
            
            document.getElementById('score-popups').appendChild(p);
            setTimeout(() => p.remove(), 600);
        }
    },
    
    showLineClearEffect(row, col) {
        const boardRect = this.boardEl.getBoundingClientRect();
        const cellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--candy-size'));
        const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-gap'));
        const padding = 10;

        const line = document.createElement('div');
        line.className = 'line-clear-effect';

        if (row !== null) {
            line.classList.add('horizontal');
            line.style.top = `${padding + row * (cellSize + gap) + cellSize / 2}px`;
            line.style.left = `${padding}px`;
            line.style.width = `${this.game.cols * (cellSize + gap) - gap}px`;
        } else if (col !== null) {
            line.classList.add('vertical');
            line.style.left = `${padding + col * (cellSize + gap) + cellSize / 2}px`;
            line.style.top = `${padding}px`;
            line.style.height = `${this.game.rows * (cellSize + gap) - gap}px`;
        }

        this.boardEl.appendChild(line);
        setTimeout(() => line.remove(), 600);
    },
    
    showExplosionEffect(row, col, big = false) {
        const cellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--candy-size'));
        const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-gap'));
        const padding = 10;

        const explosion = document.createElement('div');
        explosion.className = 'explosion-effect' + (big ? ' big' : '');
        explosion.style.left = `${padding + col * (cellSize + gap) + cellSize / 2}px`;
        explosion.style.top = `${padding + row * (cellSize + gap) + cellSize / 2}px`;

        this.boardEl.appendChild(explosion);
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
            this.boardEl.appendChild(p);
            setTimeout(() => p.remove(), 600);
        }
    },
    
    showColorBombEffect(targetColor) {
        const flash = document.createElement('div');
        flash.className = 'color-bomb-flash';
        
        if (targetColor && COLOR_MAP[targetColor]) {
            flash.style.background = `radial-gradient(circle, ${COLOR_MAP[targetColor]}88, transparent 70%)`;
        } else {
            flash.style.background = 'radial-gradient(circle, rgba(255,215,0,0.6), transparent 70%)';
        }
        
        this.boardEl.appendChild(flash);
        setTimeout(() => flash.remove(), 800);

        const boardRect = this.boardEl.getBoundingClientRect();
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'color-bomb-particle';
            const color = targetColor ? COLOR_MAP[targetColor] : '#ffd700';
            p.style.background = color || '#ffd700';
            p.style.left = `${Math.random() * boardRect.width}px`;
            p.style.top = `${Math.random() * boardRect.height}px`;
            p.style.setProperty('--px', `${(Math.random() - 0.5) * 100}px`);
            p.style.setProperty('--py', `${(Math.random() - 0.5) * 100}px`);
            this.boardEl.appendChild(p);
            setTimeout(() => p.remove(), 800);
        }

        this.boardEl.classList.add('board-shake');
        setTimeout(() => this.boardEl.classList.remove('board-shake'), 400);
    },
    
    showCombo(count) {
        const comboDisplay = document.getElementById('combo-display');
        const comboText = document.getElementById('combo-text');
        
        comboDisplay.classList.remove('hidden');
        const labels = ['', '', 'SWEET!', 'DELICIOUS!', 'SUGAR RUSH!', 'DIVINE!', 'TASTY!'];
        const label = labels[Math.min(count, labels.length - 1)] || 'INCREDIBLE!';
        
        comboText.textContent = `${label} x${count}`;
        comboText.style.animation = 'none';
        void comboText.offsetWidth;
        comboText.style.animation = 'comboFlash 1s ease forwards';
        
        setTimeout(() => comboDisplay.classList.add('hidden'), 1200);
    }
};