const Utils = {
    $: (id) => document.getElementById(id),
    
    sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    },
    
    showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = msg;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },
    
    animateScore(from, to, element) {
        const diff = to - from;
        if (diff <= 0) {
            element.textContent = to.toLocaleString();
            return;
        }
        
        const steps = 20;
        const inc = Math.ceil(diff / steps);
        let current = from;
        
        const interval = setInterval(() => {
            current += inc;
            if (current >= to) {
                current = to;
                clearInterval(interval);
            }
            element.textContent = current.toLocaleString();
        }, 30);
    },
    
    getSpecialImg(color, special) {
        if (special === 'striped-h') return `images/${color}-Striped-Horizontal.png`;
        if (special === 'striped-v') return `images/${color}-Striped-Vertical.png`;
        if (special === 'wrapped') return `images/${color}-Wrapped.png`;
        if (special === 'color-bomb') return 'images/Choco.png';
        return `images/${color}.png`;
    },
    
    createCandy(colors) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        return {
            type: 'candy',
            color,
            special: null,
            img: `images/${color}.png`
        };
    },
    
    findBestBombColor(board, r, c) {
        // Check adjacent cells first
        for (const [dr, dc] of DIRECTIONS) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
                const adj = board[nr][nc];
                if (adj && adj.color && adj.type !== 'blocker' && adj.special !== 'color-bomb') {
                    return adj.color;
                }
            }
        }
        
        // Fallback to most common color
        const counts = {};
        for (let rr = 0; rr < board.length; rr++) {
            for (let cc = 0; cc < board[0].length; cc++) {
                const clr = board[rr][cc]?.color;
                if (clr) counts[clr] = (counts[clr] || 0) + 1;
            }
        }
        
        let best = null, bestCount = 0;
        for (const [clr, cnt] of Object.entries(counts)) {
            if (cnt > bestCount) {
                best = clr;
                bestCount = cnt;
            }
        }
        return best;
    }
};